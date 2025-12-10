import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type ProductItem } from "@Jade/services/store/api";

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
