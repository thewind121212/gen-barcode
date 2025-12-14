//==== This is code generated
import Session from "supertokens-auth-react/recipe/session";
import type { CreateCategoryRequest, CreateCategoryResponse, GetCategoryRequest, GetCategoryResponse, RemoveCategoryRequest, RemoveCategoryResponse } from "@Jade/types/category.d";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


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

export const createCategory = async (request: CreateCategoryRequest): Promise<CreateCategoryResponse> => {
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/category/CreateCategory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

export const getCategory = async (request: GetCategoryRequest): Promise<GetCategoryResponse> => {
  const params = new URLSearchParams(request as unknown as Record<string, string>).toString();
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/category/GetCategory?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok && data.success === false) {
    throw new Error(data.error.message);
  }

  await Session.doesSessionExist();

  return data;
};

export const removeCategory = async (request: RemoveCategoryRequest): Promise<RemoveCategoryResponse> => {
  const response = await fetch(`${API_BASE_URL}/${API_VERSION_PREFIX}/category/RemoveCategory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

