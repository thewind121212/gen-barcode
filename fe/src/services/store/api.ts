import Session from "supertokens-auth-react/recipe/session";
import type { CreateStoreRequest, CreateStoreResponse } from "@Jade/types/store.d";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createStore = async (request: CreateStoreRequest): Promise<CreateStoreResponse> => {
  const response = await fetch(`${API_BASE_URL}/store/createStore`, {
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

  return response.json();
};

