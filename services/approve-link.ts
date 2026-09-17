import {
  getAuthUser,
  getCustomerAccessToken,
  setOutsourceSystemLink,
} from "@/lib/auth";
import { BASE_PATH, getApiBaseUrl } from "@/lib/env";

interface OutsourceApiResponse {
  success: boolean;
  link?: string;
  error?: string;
}

export interface CreateOutsourceLinkResult {
  success: boolean;
  link?: string;
  error?: string;
}

/**
 * Step 4: Create an outsource system approve link.
 * Takes 3 variables (ref1, ref3, custID) and calls the same createApproveLink
 * API as step 3 but with a custom body. The JWT (CustomerAccessToken) is read
 * from localStorage and sent as Bearer token. The resulting link UUID is
 * stored in localStorage under "outsource-system-link".
 *
 * @param ref1 - system identifier (e.g. "ptg-rewards")
 * @param ref3 - reference string (e.g. username or custID)
 * @param custID - customer ID (used as ref2)
 */
export async function createOutsourceSystemLink(
  ref1: string,
  ref3: string,
  custID: string,
): Promise<CreateOutsourceLinkResult> {
  const token = getCustomerAccessToken();
  if (!token) {
    return { success: false, error: "No CustomerAccessToken in localStorage" };
  }

  try {
    const response = await fetch(`${BASE_PATH}/api/approve-link/outsource/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref1,
        ref2: custID,
        ref3,
        ref4: "",
      }),
    });

    const data: OutsourceApiResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error ?? `Failed: ${response.status}`,
      };
    }

    if (data.link) {
      setOutsourceSystemLink(data.link);
    }

    return { success: true, link: data.link };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: `An error occurred: ${message}` };
  }
}

export interface ResolveApproveLinkResult {
  success: boolean;
  linkId?: string;
  error?: string;
}

/**
 * Find-or-create a tbApproveLinkToPTG row for the given system (ref1) and the
 * currently logged-in customer (ref2=username, ref3=custID), and return its
 * LinkId. Use buildApproveLinkUrl() to turn the LinkId into the final
 * redirect URL.
 */
export async function resolveApproveLink(
  ref1: string,
): Promise<ResolveApproveLinkResult> {
  const user = getAuthUser();
  if (!user?.username || !user?.custID) {
    return { success: false, error: "Not logged in" };
  }

  try {
    const response = await fetch(`${BASE_PATH}/api/approve-link/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ref1,
        username: user.username,
        custID: user.custID,
      }),
    });

    const data: ResolveApproveLinkResult = await response.json();

    if (!response.ok || !data.success || !data.linkId) {
      return {
        success: false,
        error: data.error ?? `Failed: ${response.status}`,
      };
    }

    return { success: true, linkId: data.linkId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: `An error occurred: ${message}` };
  }
}

/** Build the external SSO redirect URL for a resolved LinkId. */
export function buildApproveLinkUrl(linkId: string): string {
  return `${getApiBaseUrl()}CustomerBase/ApproveLinkToPTG?x=${encodeURIComponent(linkId)}`;
}

// ref1 systems that require the CreateLinkToken -> SyncAuthenLink step
// instead of redirecting straight to CustomerBase/ApproveLinkToPTG.
const SYNC_AUTH_REF1S = new Set(["myCart", "OrderHistory"]);

export interface ApproveLinkRedirectResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Resolve the final redirect URL for a service card/menu entry:
 * - normal systems -> CustomerBase/ApproveLinkToPTG?x={linkId}
 * - SYNC_AUTH_REF1S  -> SyncAuthenLink?t={token} (via the sync-token route)
 */
export async function getApproveLinkRedirectUrl(
  ref1: string,
): Promise<ApproveLinkRedirectResult> {
  if (SYNC_AUTH_REF1S.has(ref1)) {
    const user = getAuthUser();
    if (!user?.username || !user?.custID) {
      return { success: false, error: "Not logged in" };
    }
    try {
      const response = await fetch(
        `${BASE_PATH}/api/approve-link/sync-token/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ref1,
            username: user.username,
            custID: user.custID,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok || !data.success || !data.url) {
        return {
          success: false,
          error: data.error ?? `Failed: ${response.status}`,
        };
      }
      return { success: true, url: data.url };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: `An error occurred: ${message}` };
    }
  }

  const result = await resolveApproveLink(ref1);
  if (!result.success || !result.linkId) {
    return { success: false, error: result.error };
  }
  return { success: true, url: buildApproveLinkUrl(result.linkId) };
}
