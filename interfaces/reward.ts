export interface CustomerLatestOrderDetailResponse {
  itemId: number;
  productId: string | null;
  productCode: string | null;
  productName: string | null;
  qty: number | null;
  score: number | null;
  imageThumb: string | null;
}

export interface CustomerLatestOrderDeliveryLocationResponse {
  houseNo: string | null;
  villageNo: string | null;
  lane: string | null;
  road: string | null;
  subDistrict: string | null;
  district: string | null;
  province: string | null;
  zipCode: string | null;
  deliveryNote: string | null;
}

export interface CustomerLatestOrderResponse {
  orderId: number;
  orderCode: string | null;
  orderDate: string | null;
  osStatus: number | null;
  totalScoreOd: number | null;
  remarks1: string | null;
  details: CustomerLatestOrderDetailResponse[];
  deliveryLocation: CustomerLatestOrderDeliveryLocationResponse | null;
}

export interface CustomerLatestOrdersResponse {
  success: boolean;
  data?: CustomerLatestOrderResponse[];
  total?: number;
  page?: number;
  perPage?: number;
  totalPages?: number;
  summary?: Record<string, unknown>;
  error?: string;
}

export interface RewardItem {
  name: string;
  qty: number;
  points: number;
}

export interface RewardOrder {
  id: string;
  status: string;
  statusType: "preparing" | "delivered";
  date: string;
  total: number;
  tier: string;
  address: string;
  items: RewardItem[];
}

export interface RewardsQuery {
  custId: string;
  token: string;
  limit?: number;
}

export interface RewardsResponse {
  success: boolean;
  data?: RewardOrder[];
  error?: string;
}
