export interface AccessLogRow {
  itemId: number;
  custId: string | null;
  username: string | null;
  module: string;
  actionName: string;
  actionDetail: string | null;
  refNo: string | null;
  result: "SUCCESS" | "FAIL";
  errorMessage: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdDate: string;
}

export interface AccessLogQuery {
  custId?: string;
  username?: string;
  module?: string;
  actionName?: string;
  result?: string;
  refNo?: string;
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface AccessLogResponse {
  status: "success" | "error";
  results: AccessLogRow[];
  total: number;
  page: number;
  pageSize: number;
  error?: string;
}
