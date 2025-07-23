import api from "./api";
import type { TLogin, TLoginResponse } from "@/types/auth.d";
import { saveAuthData, removeAuthData } from "@/utils/token";

/**
 * Logs in a user and saves the access and refresh tokens.
 * @param credentials - The login credentials.
 * @returns The user data and tokens from the API response.
 */
export const login = async (credentials: TLogin): Promise<TLoginResponse> => {
  const { data } = await api.post<TLoginResponse>("/login/", credentials);
  saveAuthData(data.tokens, data.user.type);
  return data;
};


 
export const logout = async () => {
  removeAuthData(); // ✅ Immediately remove tokens to log out locally

  try {
    await api.post("/logout/"); // ✅ Backend logout (optional)
  } catch (error) {
    console.warn("Logout API failed, but tokens are cleared:", error);
  }
};
