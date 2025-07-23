import api from "./api";
import type { TLogin, TLoginResponse } from "@/types/auth.d";

/**
 * Logs in a user and saves the access and refresh tokens.
 * @param credentials - The login credentials.
 * @returns The user data and tokens from the API response.
 */
export const login = async (credentials: TLogin): Promise<TLoginResponse> => {
  const { data } = await api.post<TLoginResponse>("/login/", credentials);
  return data;
};

export const logout = async () => {
  await api.post("/logout/");
};
