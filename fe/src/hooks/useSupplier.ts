import { useQuery } from "@tanstack/react-query";
import { fetchSuppliers } from "@Jade/hooks/temp";
import type { Supplier } from "@Jade/types/supplier";

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
