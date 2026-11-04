import {
  getAuthUser,
  getFreshCustomerAccessToken,
  getViewedCustomerId,
  setCustomerAccessToken,
  setCustomerInfo,
  setOutsourceSystemLink,
  setPtgSystemLink,
} from "@/lib/auth";
import { BASE_PATH, getApproveLinkBaseUrl } from "@/lib/env";

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

// ref1 systems whose link, in staff mode, must come from the staff member's
// own PTGApprove.dbo.ApproveLinkToPTGSystem row instead of createApproveLink.
const STAFF_SYSTEM_LINK_REF1S = new Set(["ptg-rewards"]);

export function isStaffSystemLink(ref1: string): boolean {
  return STAFF_SYSTEM_LINK_REF1S.has(ref1);
}

// custID ที่ staff (EMP) กำลังสวมสิทธิ์อยู่ — "" ถ้าไม่ใช่ staff mode
export function getStaffViewedCustomerId(): string {
  const user = getAuthUser();
  if (user?.UserType !== "EMP") return "";
  return getViewedCustomerId();
}

// Re-mint the CustomerAccessToken (8h lifetime) by re-running the ptg-system
// login step — refreshes the stored system link + customer info alongside.
async function refreshCustomerSession(): Promise<boolean> {
  const user = getAuthUser();
  const viewedCustId = getStaffViewedCustomerId();
  const custID = (viewedCustId || user?.custID || "").trim();
  if (!user || !custID) return false;
  try {
    const res = await fetch(`${BASE_PATH}/api/approve-link/ptg-system/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.username,
        personName: user.personName,
        custID,
        custName: viewedCustId ? "" : user.custName,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success || !data.token) return false;
    setCustomerAccessToken(data.token);
    if (data.link) setPtgSystemLink(data.link);
    if (data.customerInfo) setCustomerInfo(data.customerInfo);
    return true;
  } catch {
    return false;
  }
}

/**
 * Staff mode only: fetch the staff member's existing LinkId from
 * PTGApprove.dbo.ApproveLinkToPTGSystem (ref2=username, ref3=personCode).
 */
async function fetchStaffSystemLink(
  ref1: string,
  identity: { username: string; personCode?: string },
  signal?: AbortSignal,
): Promise<CreateOutsourceLinkResult> {
  try {
    const response = await fetch(`${BASE_PATH}/api/approve-link/system-link/`, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ref1,
        username: identity.username,
        personCode: identity.personCode ?? "",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success || !data.linkId) {
      return {
        success: false,
        error: data.error ?? `Failed: ${response.status}`,
      };
    }

    setOutsourceSystemLink(data.linkId);
    return { success: true, link: data.linkId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: `An error occurred: ${message}` };
  }
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
  signal?: AbortSignal,
): Promise<CreateOutsourceLinkResult> {
  // Staff mode: for STAFF_SYSTEM_LINK_REF1S the link must be the staff
  // member's own ApproveLinkToPTGSystem row — createApproveLink would mint a
  // link under the customer session instead, which can't carry &cid.
  const identity = getApproveLinkIdentity();
  if (identity && getStaffViewedCustomerId() && isStaffSystemLink(ref1)) {
    return fetchStaffSystemLink(ref1, identity, signal);
  }

  // The JWT only lives 8h — a session left overnight sends a stale token and
  // createApproveLink 401s. Re-mint it via the ptg-system step when expired.
  let token = getFreshCustomerAccessToken();
  if (!token) {
    if (!(await refreshCustomerSession())) {
      return { success: false, error: "No CustomerAccessToken in localStorage" };
    }
    token = getFreshCustomerAccessToken();
    if (!token) {
      return { success: false, error: "Failed to refresh CustomerAccessToken" };
    }
  }

  try {
    const response = await fetch(`${BASE_PATH}/api/approve-link/outsource/`, {
      method: "POST",
      signal,
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

// Identity sent to the resolve endpoints. In staff mode (an EMP user viewing
// a customer via ?cid) the row is keyed by the employee's personCode plus the
// viewed custID instead of the user's own username/custID.
function getApproveLinkIdentity(): {
  username: string;
  custID: string;
  personCode?: string;
} | null {
  const user = getAuthUser();
  if (!user) return null;
  const viewedCustId = getStaffViewedCustomerId();
  const custID = (viewedCustId || user.custID)?.trim() ?? "";
  const username = user.username?.trim() ?? "";
  const personCode = viewedCustId ? (user.personCode?.trim() ?? "") : "";
  if (!custID || (!username && !personCode)) return null;
  return { username, custID, ...(personCode ? { personCode } : {}) };
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
  const identity = getApproveLinkIdentity();
  if (!identity) {
    return { success: false, error: "Not logged in" };
  }

  try {
    const response = await fetch(`${BASE_PATH}/api/approve-link/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref1, ...identity }),
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
  return `${getApproveLinkBaseUrl()}CustomerBase/ApproveLinkToPTG?x=${encodeURIComponent(linkId)}`;
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
    const identity = getApproveLinkIdentity();
    if (!identity) {
      return { success: false, error: "Not logged in" };
    }
    try {
      const response = await fetch(
        `${BASE_PATH}/api/approve-link/sync-token/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ref1, ...identity }),
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
