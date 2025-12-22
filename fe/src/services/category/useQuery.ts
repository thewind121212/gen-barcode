// this is code generated usequery for api
import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { CategoryResponse, CreateCategoryRequest, CreateCategoryResponse, GetCategoryByIdRequest, GetCategoryOverviewRequest, GetCategoryOverviewResponse, GetCategoryOverviewWithDepthRequest, GetCategoryTreeRequest, GetCategoryTreeResponse, RemoveCategoryRequest, RemoveCategoryResponse, UpdateCategoryRequest, UpdateCategoryResponse } from "@Jade/types/category.d";
import {
    createCategory,
    getCategoryById,
    removeCategory,
    updateCategory,
    getCategoryOverview,
    getCategoryOverviewWithDepth,
    getCategoryTree,
} from "./api";

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  timestamp: string;
};

export const useCreateCategory = ({ storeId, onSuccess, onError }: { storeId?: string, onSuccess?: (data: ApiSuccessResponse<CreateCategoryResponse>) => void, onError?: (error: Error) => void }) => {
    return useMutation<CreateCategoryResponse, Error, CreateCategoryRequest>({
        mutationFn: (request: CreateCategoryRequest) => createCategory(request, storeId),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<CreateCategoryResponse>),
        onError: (error) => onError?.(error),
    });
};

export const useGetCategoryById = ({ storeId, onSuccess, onError }: { storeId?: string, onSuccess?: (data: ApiSuccessResponse<CategoryResponse>) => void, onError?: (error: Error) => void }) => {
    return useMutation<CategoryResponse, Error, GetCategoryByIdRequest>({
        mutationFn: (request: GetCategoryByIdRequest) => getCategoryById(request, storeId),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<CategoryResponse>),
        onError: (error) => onError?.(error),
    });
};

export const useRemoveCategory = ({ storeId, onSuccess, onError }: { storeId?: string, onSuccess?: (data: ApiSuccessResponse<RemoveCategoryResponse>) => void, onError?: (error: Error) => void }) => {
    return useMutation<RemoveCategoryResponse, Error, RemoveCategoryRequest>({
        mutationFn: (request: RemoveCategoryRequest) => removeCategory(request, storeId),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<RemoveCategoryResponse>),
        onError: (error) => onError?.(error),
    });
};

export const useUpdateCategory = ({ storeId, onSuccess, onError }: { storeId?: string, onSuccess?: (data: ApiSuccessResponse<UpdateCategoryResponse>) => void, onError?: (error: Error) => void }) => {
    return useMutation<UpdateCategoryResponse, Error, UpdateCategoryRequest>({
        mutationFn: (request: UpdateCategoryRequest) => updateCategory(request, storeId),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<UpdateCategoryResponse>),
        onError: (error) => onError?.(error),
    });
};

export const useGetCategoryOverview = (
  request: GetCategoryOverviewRequest,
  storeId?: string,
  options?: Omit<UseQueryOptions<ApiSuccessResponse<GetCategoryOverviewResponse>, Error, ApiSuccessResponse<GetCategoryOverviewResponse>>, "queryKey" | "queryFn">,
) => {
    return useQuery<ApiSuccessResponse<GetCategoryOverviewResponse>, Error, ApiSuccessResponse<GetCategoryOverviewResponse>>({
        queryKey: ["category", "GetCategoryOverview", request],
        queryFn: () => getCategoryOverview(request, storeId) as unknown as ApiSuccessResponse<GetCategoryOverviewResponse>,
        ...options,
    });
};

export const useGetCategoryOverviewWithDepth = ({ storeId, onSuccess, onError }: { storeId?: string, onSuccess?: (data: ApiSuccessResponse<GetCategoryOverviewResponse>) => void, onError?: (error: Error) => void }) => {
    return useMutation<GetCategoryOverviewResponse, Error, GetCategoryOverviewWithDepthRequest>({
        mutationFn: (request: GetCategoryOverviewWithDepthRequest) => getCategoryOverviewWithDepth(request, storeId),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<GetCategoryOverviewResponse>),
        onError: (error) => onError?.(error),
    });
};

export const useGetCategoryTree = (
  request: GetCategoryTreeRequest,
  storeId?: string,
  options?: Omit<UseQueryOptions<ApiSuccessResponse<GetCategoryTreeResponse>, Error, ApiSuccessResponse<GetCategoryTreeResponse>>, "queryKey" | "queryFn">,
) => {
    return useQuery<ApiSuccessResponse<GetCategoryTreeResponse>, Error, ApiSuccessResponse<GetCategoryTreeResponse>>({
        queryKey: ["category", "GetCategoryTree", request],
        queryFn: () => getCategoryTree(request, storeId) as unknown as ApiSuccessResponse<GetCategoryTreeResponse>,
        ...options,
    });
};

