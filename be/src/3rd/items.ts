import axios from 'axios';
import { env } from '../env';
import type {
    ItemDetail,
    ItemDetailResponse,
    ItemResponse,
    ItemsApiResponse
} from './types/item.types';

// Base URL for the ERP API
const ERP_BASE_URL = env.ERP_BASE_URL;

// Get token from environment variable
const getAuthToken = (): string => {
    return env.ERP_NEXT_TOKEN;
};

const fetchItems = async (fields: string[] = ['name']): Promise<ItemsApiResponse> => {
    try {
        const token = getAuthToken();

        // Construct the fields query parameter
        const fieldsParam = JSON.stringify(fields);

        const response = await axios.get<ItemsApiResponse>(
            `${ERP_BASE_URL}/api/resource/Item`,
            {
                params: {
                    fields: fieldsParam,
                },
                headers: {
                    'Authorization': `${token}`,
                    'Cookie': 'full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=',
                },
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching items from ERP:', error.response?.data || error.message);
            throw new Error(`Failed to fetch items: ${error.response?.statusText || error.message}`);
        }
        throw error;
    }
};


const fetchItemDetail = async (itemId: string): Promise<ItemDetailResponse> => {
    try {
        const token = getAuthToken();

        const response = await axios.get<ItemDetailResponse>(
            `${ERP_BASE_URL}/api/resource/Item/${itemId}`,
            {
                headers: {
                    'Authorization': `${token}`,
                    'Cookie': 'full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=',
                },
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching item detail from ERP:', error.response?.data || error.message);
            throw new Error(`Failed to fetch item detail: ${error.response?.statusText || error.message}`);
        }
        throw error;
    }
};

export const updateItem = async (itemId: string, data: Partial<ItemDetail>): Promise<ItemDetail> => {
    try {
        const token = getAuthToken();

        const response = await axios.put<ItemDetailResponse>(
            `${ERP_BASE_URL}/api/resource/Item/${itemId}`,
            data,
            {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                    'Cookie': 'full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=',
                },
            }
        );

        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating item in ERP:', error.response?.data || error.message);
            throw new Error(`Failed to update item: ${error.response?.statusText || error.message}`);
        }
        throw error;
    }
};

export const getItemNames = async (): Promise<string[]> => {
    const response = await fetchItems(['name']);
    return response.data.map(item => item.name);
};

export const getItemDetail = async (itemId: string): Promise<ItemDetail> => {
    const response = await fetchItemDetail(itemId)
    return response.data
}
