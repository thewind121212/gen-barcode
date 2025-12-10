// this is code generated usequery for api
import { useMutation } from "@tanstack/react-query";
import type { CreateStoreRequest, CreateStoreResponse } from "@Jade/types/store.d";
import {
    createStore,
} from "./api";

export const useCreateStore = ({ onSuccess, onError }: { onSuccess?: (data: CreateStoreResponse) => void, onError?: (error: Error) => void }) => {
    return useMutation<CreateStoreResponse, Error, CreateStoreRequest>({
        mutationFn: (request: CreateStoreRequest) => createStore(request),
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
    });
};

