// this is code generated usequery for api
import { useMutation, useQuery } from "@tanstack/react-query";
import type { CreateCategoryRequest, CreateCategoryResponse, GetCategoryRequest, GetCategoryResponse, RemoveCategoryRequest, RemoveCategoryResponse } from "@Jade/types/category.d";
import {
    createCategory,
    getCategory,
    removeCategory,
} from "./api";

export const useCreateCategory = ({ onSuccess, onError }: { onSuccess?: (data: CreateCategoryResponse) => void, onError?: (error: Error) => void }) => {
    return useMutation<CreateCategoryResponse, Error, CreateCategoryRequest>({
        mutationFn: (request: CreateCategoryRequest) => createCategory(request),
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
    });
};

export const useGetCategory = (request: GetCategoryRequest, options?: { enabled?: boolean }) => {
    return useQuery<GetCategoryResponse, Error>({
        queryKey: ["category", "GetCategory", request],
        queryFn: () => getCategory(request),
        enabled: options?.enabled ?? true,
    });
};

export const useRemoveCategory = ({ onSuccess, onError }: { onSuccess?: (data: RemoveCategoryResponse) => void, onError?: (error: Error) => void }) => {
    return useMutation<RemoveCategoryResponse, Error, RemoveCategoryRequest>({
        mutationFn: (request: RemoveCategoryRequest) => removeCategory(request),
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
    });
};

