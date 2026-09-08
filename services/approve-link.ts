import {
  getCustomerAccessToken,
  setOutsourceSystemLink,
} from "@/lib/auth";

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
    const response = await fetch("/api/approve-link/outsource", {
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
