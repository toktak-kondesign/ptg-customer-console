import jwt, { SignOptions } from "jsonwebtoken";
import type { Customer } from "@/interfaces/customer";

// Mirrors C# GenerateCustomerAccessToken configuration.
// C# defaults: Key="PTG@MinimumLength32CharactersSecretKey2024",
// Issuer="https://www.ptg.co.th", Audience="ApproveV2", expires=8h, HmacSha256.
const SECRET = process.env.secertJWT ?? "PTG@MinimumLength32CharactersSecretKey2024";
const ISSUER = process.env.JWT_ISSUER ?? "https://www.ptg.co.th";
const AUDIENCE = process.env.JWT_AUDIENCE ?? "ApproveV2";
const ALGORITHM = "HS256";
const EXPIRES_IN_SECONDS = 8 * 60 * 60; // 8 hours, matches C# DateTime.Now.AddHours(8)

export interface CustomerAccessTokenPayload {
  custid: string;
  customer: Customer;
}

/**
 * Generate a JWT for a Customer — TypeScript port of the C#
 * GenerateCustomerAccessToken method. Claims: `custid` (string) and
 * `customer` (JSON-serialized Customer, matching System.Text.Json).
 */
export function generateCustomerAccessToken(cust: Customer): string {
  const claims = {
    custid: cust.custID ?? "",
    customer: JSON.stringify(cust),
  };

  const signOptions: SignOptions = {
    algorithm: ALGORITHM,
    issuer: ISSUER,
    audience: AUDIENCE,
    expiresIn: EXPIRES_IN_SECONDS,
  };

  return jwt.sign(claims, SECRET, signOptions);
}

/**
 * Verify a customer access token (signature, issuer, audience, expiry).
 * Throws jwt.JsonWebTokenError / TokenExpiredError on invalid tokens.
 * Returns the decoded claims with `customer` parsed back into a Customer.
 */
export function verifyCustomerAccessToken(token: string): CustomerAccessTokenPayload {
  const decoded = jwt.verify(token, SECRET, {
    algorithms: [ALGORITHM],
    issuer: ISSUER,
    audience: AUDIENCE,
  }) as jwt.JwtPayload;

  const customerRaw = decoded.customer;
  const customer =
    typeof customerRaw === "string"
      ? (JSON.parse(customerRaw) as Customer)
      : (customerRaw as Customer);

  return {
    custid: decoded.custid ?? "",
    customer,
  };
}

/**
 * Decode a customer access token WITHOUT verifying signature/expiry.
 * Useful for reading payload on the client or when the upstream system
 * has already validated the token. Returns null on malformed input.
 */
export function decodeCustomerAccessToken(
  token: string,
): CustomerAccessTokenPayload | null {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === "string") return null;

  const payload = decoded as jwt.JwtPayload;
  let customer: Customer | undefined;
  try {
    customer =
      typeof payload.customer === "string"
        ? (JSON.parse(payload.customer) as Customer)
        : (payload.customer as Customer | undefined);
  } catch {
    return null;
  }

  if (!customer) return null;

  return {
    custid: payload.custid ?? "",
    customer,
  };
}
