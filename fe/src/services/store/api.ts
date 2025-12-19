//==== This is code generated
import Session from "supertokens-auth-react/recipe/session";
import type { CreateStoreRequest, CreateStoreResponse, GetUserInfoRequest, GetUserInfoResponse } from "@Jade/types/store.d";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const buildHeaders = (storeId?: string) => ({
  "Content-Type": "application/json",
  ...(storeId ? { "x-store-id": storeId } : {}),
});


export enum ApiVersion {
  API_VERSION_UNSPECIFIED = 0,
  API_VERSION_V1 = 1,
}

// Change this to switch between API versions
export const API_VERSION: ApiVersion = ApiVersion.API_VERSION_V1;

const API_VERSION_PATHS: Record<ApiVersion, string> = {
  [ApiVersion.API_VERSION_UNSPECIFIED]: "",
  [ApiVersion.API_VERSION_V1]: "v1",
};

const API_VERSION_PREFIX = API_VERSION_PATHS[API_VERSION];

export const createStore = async (request: CreateStoreRequest, storeId?: string): Promise<CreateStoreResponse> => {
  const resolvedStoreId = storeId ?? (request as any)?.storeId;
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/store/CreateStore`, {
    method: "POST",
    headers: buildHeaders(resolvedStoreId),
    credentials: "include",
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok && data.success === false) {
    throw new Error(data.error.message);
  }

  await Session.doesSessionExist();

  return data;
};

export const getUserInfo = async (request: GetUserInfoRequest, storeId?: string): Promise<GetUserInfoResponse> => {
  const resolvedStoreId = storeId ?? (request as any)?.storeId;
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/store/GetUserInfo`, {
    method: "POST",
    headers: buildHeaders(resolvedStoreId),
    credentials: "include",
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok && data.success === false) {
    throw new Error(data.error.message);
  }

  await Session.doesSessionExist();

  return data;
};

