// Mirrors C# Customer class (ApproveV2) — property names match [JsonPropertyName]
// so JSON.stringify output is identical to System.Text.Json.JsonSerializer.Serialize(cust).
export interface Customer {
  username?: string;
  userFullName?: string;
  custID?: string;
  customerName?: string;
  positionLevel: number;
  pointSilver: number;
  pointGold: number;
  active: number;
  // metadata from ApproveLinkToPTGSystem
  systemId?: string; // ref1
  linkId?: string;
}
