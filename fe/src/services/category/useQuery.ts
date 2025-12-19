// this is code generated usequery for api
import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { CreateCategoryRequest, CreateCategoryResponse, GetCategoryByIDResponse, GetCategoryByIdRequest, GetCategoryOverviewRequest, GetCategoryOverviewResponse, RemoveCategoryRequest, RemoveCategoryResponse } from "@Jade/types/category.d";
import {
    createCategory,
    getCategoryById,
    removeCategory,
    getCategoryOverview,
} from "./api";

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  timestamp: string;
};

export const useCreateCategory = ({ onSuccess, onError }: { onSuccess?: (data: ApiSuccessResponse<CreateCategoryResponse>) => void, onError?: (error: Error) => void }) => {
    return useMutation<CreateCategoryResponse, Error, CreateCategoryRequest>({
        mutationFn: (request: CreateCategoryRequest) => createCategory(request),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<CreateCategoryResponse>),
        onError: (error) => onError?.(error),
    });
};

export const useGetCategoryById = (request: GetCategoryByIdRequest, options?: UseQueryOptions<ApiSuccessResponse<GetCategoryByIDResponse>, Error, GetCategoryByIdRequest>) => {
    return useQuery<ApiSuccessResponse<GetCategoryByIDResponse>, Error, GetCategoryByIdRequest>({
        queryKey: ["category", "GetCategoryById", request],
        queryFn: () => getCategoryById(request) as unknown as ApiSuccessResponse<GetCategoryByIDResponse>,
        ...options,
    });
};

export const useRemoveCategory = ({ onSuccess, onError }: { onSuccess?: (data: ApiSuccessResponse<RemoveCategoryResponse>) => void, onError?: (error: Error) => void }) => {
    return useMutation<RemoveCategoryResponse, Error, RemoveCategoryRequest>({
        mutationFn: (request: RemoveCategoryRequest) => removeCategory(request),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<RemoveCategoryResponse>),
        onError: (error) => onError?.(error),
    });
};

export const useGetCategoryOverview = (request: GetCategoryOverviewRequest, options?: UseQueryOptions<ApiSuccessResponse<GetCategoryOverviewResponse>, Error, GetCategoryOverviewRequest>) => {
    return useQuery<ApiSuccessResponse<GetCategoryOverviewResponse>, Error, GetCategoryOverviewRequest>({
        queryKey: ["category", "GetCategoryOverview", request],
        queryFn: () => getCategoryOverview(request) as unknown as ApiSuccessResponse<GetCategoryOverviewResponse>,
        ...options,
    });
};

