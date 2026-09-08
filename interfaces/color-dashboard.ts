export interface ColorDashboardRow {
  ResaleID: string;
  Company: string;
  Color1: number;
  Cmt: number;
  Amt: number;
}

export interface ColorDashboardResponse {
  status: string;
  results: ColorDashboardRow[];
  error?: string;
}
