// this is code generated usequery for api
import { useMutation } from "@tanstack/react-query";
import type { CreateStoreRequest, CreateStoreResponse, GetUserInfoRequest, GetUserInfoResponse } from "@Jade/types/store.d";
import {
    createStore,
    getUserInfo,
} from "./api";

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  timestamp: string;
};

export const useCreateStore = ({ onSuccess, onError }: { onSuccess?: (data: ApiSuccessResponse<CreateStoreResponse>) => void, onError?: (error: Error) => void }) => {
    return useMutation<CreateStoreResponse, Error, CreateStoreRequest>({
        mutationFn: (request: CreateStoreRequest) => createStore(request),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<CreateStoreResponse>),
        onError: (error) => onError?.(error),
    });
};

export const useGetUserInfo = ({ onSuccess, onError }: { onSuccess?: (data: ApiSuccessResponse<GetUserInfoResponse>) => void, onError?: (error: Error) => void }) => {
    return useMutation<GetUserInfoResponse, Error, GetUserInfoRequest>({
        mutationFn: (request: GetUserInfoRequest) => getUserInfo(request),
        onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<GetUserInfoResponse>),
        onError: (error) => onError?.(error),
    });
};

