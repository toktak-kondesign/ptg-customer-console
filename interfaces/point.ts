export interface CustomerPointQuery {
  custId: string;
}

export interface CustomerGoldPointData {
  currentPoint: number | null;
  unfundedPoint: number | null;
  xStatus: number | null;
}

export interface CustomerSilverPointData {
  currentPoint: number | null;
  xStatus: number | null;
}

export interface CustomerPointsData {
  custId: string;
  gold: CustomerGoldPointData | null;
  silver: CustomerSilverPointData | null;
  waitpaypointGold: number | null;
  waitpaypointSilver: number | null;
}

export interface CustomerPointsResponse {
  success: boolean;
  data?: CustomerPointsData;
  error?: string;
}
