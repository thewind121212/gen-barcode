// this is code generated usequery for api
import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { CreateProductRequest, CreateProductResponse, GetProductByIdRequest, ProductResponse } from "@Jade/types/product.d";
import {
    createProduct,
    getProductById,
} from "./api";

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  timestamp: string;
};

export const useCreateProduct = ({ storeId, onSuccess, onError }: { storeId?: string, onSuccess?: (data: ApiSuccessResponse<CreateProductResponse>) => void, onError?: (error: Error) => void }) => {
    return useMutation<CreateProductResponse, Error, CreateProductRequest>({
        mutationFn: (request: CreateProductRequest) => createProduct(request, storeId),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<CreateProductResponse>),
        onError: (error) => onError?.(error),
    });
};

export const useGetProductById = (
  request: GetProductByIdRequest,
  storeId?: string,
  options?: Omit<UseQueryOptions<ApiSuccessResponse<ProductResponse>, Error, ApiSuccessResponse<ProductResponse>>, "queryKey" | "queryFn">,
) => {
    return useQuery<ApiSuccessResponse<ProductResponse>, Error, ApiSuccessResponse<ProductResponse>>({
        queryKey: ["product", "GetProductById", request],
        queryFn: () => getProductById(request, storeId) as unknown as ApiSuccessResponse<ProductResponse>,
        ...options,
    });
};

