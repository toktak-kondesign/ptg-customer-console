import type {
  CarCheckResponse,
  CreateCardOtuPayload,
  CreateCardOtuResponse,
  RequestProductsResponse,
} from "@/interfaces/card-temp";
import { BASE_PATH } from "@/lib/env";

export async function checkCarService(
  car: string,
  custID: string,
  phone: string,
): Promise<CarCheckResponse> {
  try {
    const params = new URLSearchParams({ car, custID, phone });
    const response = await fetch(
      `${BASE_PATH}/api/car-card/check?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: CarCheckResponse = await response.json();
    if (!response.ok) {
      return {
        status: "error",
        pendingBills: [],
        pendingCard: null,
        error: data.error ?? `Failed to check car: ${response.status}`,
      };
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      status: "error",
      pendingBills: [],
      pendingCard: null,
      error: `An error occurred while checking car: ${message}`,
    };
  }
}

export async function createCardOtuService(
  payload: CreateCardOtuPayload,
): Promise<CreateCardOtuResponse> {
  try {
    const response = await fetch(`${BASE_PATH}/api/car-card/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data: CreateCardOtuResponse = await response.json();
    if (!response.ok || data.status !== "success") {
      return {
        status: "error",
        error: data.error ?? `Failed to create card: ${response.status}`,
      };
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      status: "error",
      error: `An error occurred while creating card: ${message}`,
    };
  }
}

export async function getRequestProductsService(
  custID: string,
): Promise<RequestProductsResponse> {
  try {
    const params = new URLSearchParams({ custID });
    const response = await fetch(
      `${BASE_PATH}/api/car-card/products?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: RequestProductsResponse = await response.json();
    if (!response.ok) {
      return {
        status: "error",
        results: [],
        error: data.error ?? `Failed to fetch products: ${response.status}`,
      };
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      status: "error",
      results: [],
      error: `An error occurred while fetching products: ${message}`,
    };
  }
}
