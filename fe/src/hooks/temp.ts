
import Session from "supertokens-auth-react/recipe/session";

const API_BASE_URL = "http://localhost:9190/api/v1";

export interface ProductItem {
    ItemCode: string;
    ItemName: string;
    // Add other fields from your ERP API response
}

export interface Supplier {
    name: string;
    supplier_name: string;
    supplier_group: string;
    tax_id?: string;
    email_id?: string;
    supplier_details?: string;
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