// this is code generated usequery for api
import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { CreateCategoryRequest, CreateCategoryResponse, GetCategoryRequest, GetCategoryResponse, RemoveCategoryRequest, RemoveCategoryResponse } from "@Jade/types/category.d";
import {
    createCategory,
    getCategory,
    removeCategory,
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

export const useGetCategory = (request: GetCategoryRequest, options?: UseQueryOptions<ApiSuccessResponse<GetCategoryResponse>, Error, GetCategoryRequest>) => {
    return useQuery<ApiSuccessResponse<GetCategoryResponse>, Error, GetCategoryRequest>({
        queryKey: ["category", "GetCategory", request],
        queryFn: () => getCategory(request) as unknown as ApiSuccessResponse<GetCategoryResponse>,
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

