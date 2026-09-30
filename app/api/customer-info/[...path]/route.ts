import { request as httpsRequest } from "node:https";
import type { NextRequest } from "next/server";
import type { CustomerImage, CustomerImages } from "@/interfaces/customer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PDF_API_URL = process.env.PDF_API_URL || "http://localhost:3400";
const DOCUMENT_API_URL =
  process.env.PTG_DOCUMENT_API_URL ||
  "https://ptgdocapi.ptg.co.th/customers/documents";

const EMPTY_IMAGES: CustomerImages = {
  logo: null,
  interior: [],
  exterior: [],
};

type DocumentFile = {
  id: number;
  file_name: string;
  mime_type: string;
  content_base64: string;
};

type CustomerDocument = {
  note: string | null;
  files: DocumentFile[];
};

type DocumentApiResponse = {
  success: boolean;
  message?: string;
  data?: {
    document_types?: Array<{ documents?: CustomerDocument[] }>;
  };
};

type UpstreamResponse = {
  status: number;
  body: string;
};

function shouldAllowInvalidTls(): boolean {
  const appEnvironment =
    process.env.APP_ENV ?? process.env.NEXT_PUBLIC_APP_ENV;
  return appEnvironment
    ? appEnvironment !== "production"
    : process.env.NODE_ENV !== "production";
}

function postJsonWithTlsOverride(
  endpoint: string,
  headers: Record<string, string>,
  body: string,
): Promise<UpstreamResponse> {
  return new Promise((resolve, reject) => {
    const request = httpsRequest(
      endpoint,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Length": Buffer.byteLength(body).toString(),
        },
        rejectUnauthorized: false,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        response.on("end", () => {
          resolve({
            status: response.statusCode ?? 502,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );

    request.on("error", reject);
    request.end(body);
  });
}

async function postDocumentApi(
  headers: Record<string, string>,
  body: string,
): Promise<UpstreamResponse> {
  const endpoint = new URL(DOCUMENT_API_URL);
  if (endpoint.protocol === "https:" && shouldAllowInvalidTls()) {
    return postJsonWithTlsOverride(DOCUMENT_API_URL, headers, body);
  }

  const response = await fetch(DOCUMENT_API_URL, {
    method: "POST",
    headers,
    body,
    cache: "no-store",
  });
  return { status: response.status, body: await response.text() };
}

function getDocumentCategory(note: string | null): string {
  return note?.match(/ประเภทเอกสาร:\s*([^\r\n]+)/)?.[1]?.trim() ?? "";
}

function toCustomerImage(file: DocumentFile): CustomerImage | null {
  if (!file.mime_type?.startsWith("image/") || !file.content_base64) return null;
  return {
    id: file.id,
    name: file.file_name,
    mimeType: file.mime_type,
    src: `data:${file.mime_type};base64,${file.content_base64}`,
  };
}

function normalizeImages(response: DocumentApiResponse): CustomerImages {
  const images: CustomerImages = { ...EMPTY_IMAGES, interior: [], exterior: [] };
  const documents =
    response.data?.document_types?.flatMap((type) => type.documents ?? []) ?? [];

  for (const document of documents) {
    const category = getDocumentCategory(document.note);
    const files = document.files.map(toCustomerImage).filter(Boolean) as CustomerImage[];
    if (category.includes("โลโก้") && !images.logo) images.logo = files[0] ?? null;
    if (category.includes("รูปภายในร้าน")) images.interior.push(...files);
    if (
      category.includes("รูปภายนอกร้าน") ||
      category.includes("รูปหน้าร้าน")
    ) {
      images.exterior.push(...files);
    }
  }

  return images;
}

async function getCustomerImages(
  customerId: string,
  userToken: string,
): Promise<{ images: CustomerImages; error?: string }> {
  const authorization = process.env.PTG_DOCUMENT_API_TOKEN?.trim();
  if (!authorization) {
    return { images: EMPTY_IMAGES, error: "PTG_DOCUMENT_API_TOKEN is not configured" };
  }
  if (!userToken) {
    return { images: EMPTY_IMAGES, error: "Missing user token" };
  }

  try {
    const upstream = await postDocumentApi(
      {
        Authorization: authorization.startsWith("Bearer ")
          ? authorization
          : `Bearer ${authorization}`,
        "Content-Type": "application/json",
        usertoken: userToken,
      },
      JSON.stringify({ customerId }),
    );
    const data = JSON.parse(upstream.body) as DocumentApiResponse;
    const isOk = upstream.status >= 200 && upstream.status < 300;
    if (!isOk || !data.success) {
      return {
        images: EMPTY_IMAGES,
        error: data.message ?? `Document API returned ${upstream.status}`,
      };
    }
    return { images: normalizeImages(data) };
  } catch (error) {
    return {
      images: EMPTY_IMAGES,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function GET(request: NextRequest): Promise<Response> {
  const path = request.nextUrl.pathname.replace(/^\/api\/customer-info\/?/, "");
  const query = request.nextUrl.search;
  const upstreamUrl = `${PDF_API_URL}/api/customer-info/${path}${query}`;

  try {
    const profilePromise = fetch(upstreamUrl, { cache: "no-store" });
    const customerId = request.nextUrl.searchParams.get("custID")?.trim() ?? "";
    const imagePromise = path.replace(/\/$/, "") === "profile" && customerId
      ? getCustomerImages(customerId, request.headers.get("usertoken") ?? "")
      : Promise.resolve(null);
    const [upstream, imageResult] = await Promise.all([profilePromise, imagePromise]);
    const body = await upstream.text();

    if (!imageResult) {
      return new Response(body, {
        status: upstream.status,
        headers: {
          "Content-Type": upstream.headers.get("content-type") ?? "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      });
    }

    const profile = JSON.parse(body) as Record<string, unknown>;
    return Response.json(
      {
        ...profile,
        images: imageResult.images,
        ...(imageResult.error ? { imageError: imageResult.error } : {}),
      },
      {
        status: upstream.status,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { status: "error", results: [], error: `Upstream unreachable: ${message}` },
      { status: 502 },
    );
  }
}
