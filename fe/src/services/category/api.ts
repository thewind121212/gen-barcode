//==== This is code generated
import Session from "supertokens-auth-react/recipe/session";
import type { CategoryResponse, CreateCategoryRequest, CreateCategoryResponse, GetCategoryByIdRequest, GetCategoryOverviewRequest, GetCategoryOverviewResponse, GetCategoryOverviewWithDepthRequest, GetCategoryTreeRequest, GetCategoryTreeResponse, RemoveCategoryRequest, RemoveCategoryResponse, UpdateCategoryRequest, UpdateCategoryResponse } from "@Jade/types/category.d";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const buildHeaders = (storeId?: string) => ({
  "Content-Type": "application/json",
  ...(storeId ? { "x-store-id": storeId } : {}),
});

const buildQueryString = (request: Record<string, unknown>) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(request)) {
    if (value === undefined || value === null) {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item === undefined || item === null) {
          continue;
        }
        params.append(key, String(item));
      }
      continue;
    }
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};


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
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/category/CreateCategory`, {
    method: "POST",
    headers: buildHeaders(storeId),
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

export const getCategoryById = async (request: GetCategoryByIdRequest, storeId?: string): Promise<CategoryResponse> => {
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/category/GetCategoryById`, {
    method: "POST",
    headers: buildHeaders(storeId),
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
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/category/RemoveCategory`, {
    method: "POST",
    headers: buildHeaders(storeId),
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

export const updateCategory = async (request: UpdateCategoryRequest, storeId?: string): Promise<UpdateCategoryResponse> => {
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/category/UpdateCategory`, {
    method: "PUT",
    headers: buildHeaders(storeId),
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
  const baseUrl = `${API_BASE_URL}/${API_VERSION_PREFIX}/category/GetCategoryOverview`;
  const url = `${baseUrl}${buildQueryString(request as unknown as Record<string, unknown>)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: buildHeaders(storeId),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok && data.success === false) {
    throw new Error(data.error.message);
  }

  await Session.doesSessionExist();

  return data;
};

export const getCategoryOverviewWithDepth = async (request: GetCategoryOverviewWithDepthRequest, storeId?: string): Promise<GetCategoryOverviewResponse> => {
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/category/GetCategoryOverviewWithDepth`, {
    method: "POST",
    headers: buildHeaders(storeId),
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

export const getCategoryTree = async (request: GetCategoryTreeRequest, storeId?: string): Promise<GetCategoryTreeResponse> => {
  const baseUrl = `${API_BASE_URL}/${API_VERSION_PREFIX}/category/GetCategoryTree`;
  const url = `${baseUrl}${buildQueryString(request as unknown as Record<string, unknown>)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: buildHeaders(storeId),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok && data.success === false) {
    throw new Error(data.error.message);
  }

  await Session.doesSessionExist();

  return data;
};

