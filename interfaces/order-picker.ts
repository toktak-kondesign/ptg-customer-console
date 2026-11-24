export interface OrderPickerProduct {
  Company: string;
  OrderNum: string;
  OrderLine: number;
  ItemCode: string;
  ItemName: string;
  Unit: string;
  NumToUse: number;
  TypeSale: string;
  ProdName: string;
  WorkCus: string | null;
  isLowStock?: boolean;
}

export interface OrderPickerResponse {
  status: string;
  results: OrderPickerProduct[];
  error?: string;
}
