//==== This is code generated
import Session from "supertokens-auth-react/recipe/session";
import type { CreateCategoryRequest, CreateCategoryResponse, GetCategoryByIDResponse, GetCategoryByIdRequest, GetCategoryOverviewRequest, GetCategoryOverviewResponse, RemoveCategoryRequest, RemoveCategoryResponse } from "@Jade/types/category.d";

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

export const createCategory = async (request: CreateCategoryRequest, storeId?: string): Promise<CreateCategoryResponse> => {
  const resolvedStoreId = storeId ?? (request as any)?.storeId;
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/category/CreateCategory`, {
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

export const getCategoryById = async (request: GetCategoryByIdRequest, storeId?: string): Promise<GetCategoryByIDResponse> => {
  const resolvedStoreId = storeId ?? (request as any)?.storeId;
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/category/GetCategoryById`, {
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

export const removeCategory = async (request: RemoveCategoryRequest, storeId?: string): Promise<RemoveCategoryResponse> => {
  const resolvedStoreId = storeId ?? (request as any)?.storeId;
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/category/RemoveCategory`, {
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

export const getCategoryOverview = async (request: GetCategoryOverviewRequest, storeId?: string): Promise<GetCategoryOverviewResponse> => {
  const params = new URLSearchParams(request as unknown as Record<string, string>).toString();
  const resolvedStoreId = storeId ?? (request as any)?.storeId;
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/category/GetCategoryOverview?${params}`, {
    method: "GET",
    headers: buildHeaders(resolvedStoreId),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok && data.success === false) {
    throw new Error(data.error.message);
  }

  await Session.doesSessionExist();

  return data;
};

