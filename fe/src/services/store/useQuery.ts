import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Supplier } from "../../types/supplier.types";
import {
    createStore,
    fetchProducts,
    fetchSuppliers,
    type ProductItem,
    type Store,
} from "./api";

export const useProducts = () => {
    return useQuery<ProductItem[], Error>({
        queryKey: ["products"],
        queryFn: fetchProducts,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 2,
        refetchOnWindowFocus: false,
    });
};

export const useSuppliers = () => {
    return useQuery<Supplier[], Error>({
        queryKey: ["suppliers"],
        queryFn: fetchSuppliers,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 2,
        refetchOnWindowFocus: false,
    });
};

export const useCreateStore = ({ onSuccess, onError }: { onSuccess?: (data: any) => void, onError?: (error: any) => void }) => {
    return useMutation<Store, Error, string>({
        mutationFn: (name: string) => createStore(name),
        onSuccess: onSuccess,
        onError: onError,
    });
};
