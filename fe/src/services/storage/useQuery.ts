// this is code generated usequery for api
import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { CreateStorageRequest, CreateStorageResponse, GetStorageByIdRequest, GetStorageByStoreIdOverviewResponse, GetStorageByStoreIdRequest, GetStorageByStoreIdResponse, RemoveStorageRequest, RemoveStorageResponse, StorageResponse, UpdateStorageRequest, UpdateStorageResponse } from "@Jade/types/storage.d";
import {
    createStorage,
    getStorageById,
    getStorageByStoreId,
    getStorageByStoreIdOverview,
    updateStorage,
    removeStorage,
} from "./api";

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  timestamp: string;
};

export const useCreateStorage = ({ storeId, onSuccess, onError }: { storeId?: string, onSuccess?: (data: ApiSuccessResponse<CreateStorageResponse>) => void, onError?: (error: Error) => void }) => {
    return useMutation<CreateStorageResponse, Error, CreateStorageRequest>({
        mutationFn: (request: CreateStorageRequest) => createStorage(request, storeId),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<CreateStorageResponse>),
        onError: (error) => onError?.(error),
    });
};

export const useGetStorageById = (
  request: GetStorageByIdRequest,
  storeId?: string,
  options?: Omit<UseQueryOptions<ApiSuccessResponse<StorageResponse>, Error, ApiSuccessResponse<StorageResponse>>, "queryKey" | "queryFn">,
) => {
    return useQuery<ApiSuccessResponse<StorageResponse>, Error, ApiSuccessResponse<StorageResponse>>({
        queryKey: ["storage", "GetStorageById", request],
        queryFn: () => getStorageById(request, storeId) as unknown as ApiSuccessResponse<StorageResponse>,
        ...options,
    });
};

export const useGetStorageByStoreId = (
  request: GetStorageByStoreIdRequest,
  storeId?: string,
  options?: Omit<UseQueryOptions<ApiSuccessResponse<GetStorageByStoreIdResponse>, Error, ApiSuccessResponse<GetStorageByStoreIdResponse>>, "queryKey" | "queryFn">,
) => {
    return useQuery<ApiSuccessResponse<GetStorageByStoreIdResponse>, Error, ApiSuccessResponse<GetStorageByStoreIdResponse>>({
        queryKey: ["storage", "GetStorageByStoreId", request],
        queryFn: () => getStorageByStoreId(request, storeId) as unknown as ApiSuccessResponse<GetStorageByStoreIdResponse>,
        ...options,
    });
};

export const useGetStorageByStoreIdOverview = (
  request: GetStorageByStoreIdRequest,
  storeId?: string,
  options?: Omit<UseQueryOptions<ApiSuccessResponse<GetStorageByStoreIdOverviewResponse>, Error, ApiSuccessResponse<GetStorageByStoreIdOverviewResponse>>, "queryKey" | "queryFn">,
) => {
    return useQuery<ApiSuccessResponse<GetStorageByStoreIdOverviewResponse>, Error, ApiSuccessResponse<GetStorageByStoreIdOverviewResponse>>({
        queryKey: ["storage", "GetStorageByStoreIdOverview", request],
        queryFn: () => getStorageByStoreIdOverview(request, storeId) as unknown as ApiSuccessResponse<GetStorageByStoreIdOverviewResponse>,
        ...options,
    });
};

export const useUpdateStorage = ({ storeId, onSuccess, onError }: { storeId?: string, onSuccess?: (data: ApiSuccessResponse<UpdateStorageResponse>) => void, onError?: (error: Error) => void }) => {
    return useMutation<UpdateStorageResponse, Error, UpdateStorageRequest>({
        mutationFn: (request: UpdateStorageRequest) => updateStorage(request, storeId),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<UpdateStorageResponse>),
        onError: (error) => onError?.(error),
    });
};

export const useRemoveStorage = ({ storeId, onSuccess, onError }: { storeId?: string, onSuccess?: (data: ApiSuccessResponse<RemoveStorageResponse>) => void, onError?: (error: Error) => void }) => {
    return useMutation<RemoveStorageResponse, Error, RemoveStorageRequest>({
        mutationFn: (request: RemoveStorageRequest) => removeStorage(request, storeId),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<RemoveStorageResponse>),
        onError: (error) => onError?.(error),
    });
};

