import Session from "supertokens-auth-react/recipe/session";
import type { Supplier } from "../types/supplier.types";
const API_BASE_URL = "http://localhost:9090/api/v1";

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

    // Add SuperTokens session token if needed
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
