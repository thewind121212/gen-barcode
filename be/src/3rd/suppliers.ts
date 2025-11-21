import axios from 'axios';
import { env } from '../env';
import type {
    Supplier,
    SupplierResponse,
    SuppliersApiResponse
} from './types/supplier.types';

// Base URL for the ERP API
const ERP_BASE_URL = env.ERP_BASE_URL;

// Get token from environment variable
const getAuthToken = (): string => {
    return env.ERP_NEXT_TOKEN;
};

export const fetchSuppliers = async (fields: string[] = ['name', 'supplier_name', 'supplier_group', 'tax_id', 'email_id', 'supplier_details']): Promise<SuppliersApiResponse> => {
    try {
        const token = getAuthToken();

        // Construct the fields query parameter
        const fieldsParam = JSON.stringify(fields);

        const response = await axios.get<SuppliersApiResponse>(
            `${ERP_BASE_URL}/api/resource/Supplier`,
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
            console.error('Error fetching suppliers from ERP:', error.response?.data || error.message);
            throw new Error(`Failed to fetch suppliers: ${error.response?.statusText || error.message}`);
        }
        throw error;
    }
};

export const getSupplierNames = async (): Promise<Supplier[]> => {
    const response = await fetchSuppliers()
    return response.data
};
