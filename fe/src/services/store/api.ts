import Session from "supertokens-auth-react/recipe/session";
import type { Supplier } from "@Jade/types/supplier.types";

const API_BASE_URL = "http://localhost:9190/api/v1";

export interface ProductItem {
  ItemCode: string;
  ItemName: string;
  // Add other fields from your ERP API response
}

export const fetchProducts = async (): Promise<ProductItem[]> => {
  const response = await fetch(`${API_BASE_URL}/erp/getFulItemsDetail`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  // Ensure SuperTokens session exists / sync cookies
  await Session.doesSessionExist();

  return response.json();
};

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const response = await fetch(`${API_BASE_URL}/erp/getSupplier`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch suppliers");
  }


  return response.json();
};

// ----- Store APIs -----

export interface Store {
  id: number;
  name: string;
  // add other fields from Prisma model if needed
}

export const createStore = async (name: string): Promise<Store> => {
  const response = await fetch(`${API_BASE_URL}/store/createStore`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  const data = await response.json();

  if (!response.ok && data.success === false) {
    throw new Error(data.error.message);
  } 

  await Session.doesSessionExist();

  return response.json();
};

