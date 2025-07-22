import { setCookie, getCookie, eraseCookie } from "./cookies";
import type { TTokens, TUser } from "@/types/auth.d";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_ROLE_KEY = "user_role";

/**
 * Saves the authentication tokens and user role to cookies.
 * @param tokens - The access and refresh tokens.
 * @param role - The user's role.
 */
export const saveAuthData = (tokens: TTokens, role: TUser["type"]): void => {
  setCookie(ACCESS_TOKEN_KEY, tokens.access, 7);
  setCookie(REFRESH_TOKEN_KEY, tokens.refresh, 30); // Refresh token has a longer expiry
  setCookie(USER_ROLE_KEY, role, 7);
};

/**
 * Retrieves the access token from the cookie.
 * @returns The access token, or null if not found.
 */
export const getAccessToken = (): string | null => {
  return getCookie(ACCESS_TOKEN_KEY);
};

/**
 * Retrieves the refresh token from the cookie.
 * @returns The refresh token, or null if not found.
 */
export const getRefreshToken = (): string | null => {
  return getCookie(REFRESH_TOKEN_KEY);
};

/**
 * Retrieves the user's role from the cookie.
 * @returns The user's role, or null if not found.
 */
export const getUserRole = (): string | null => {
  return getCookie(USER_ROLE_KEY);
};

/**
 * Removes the authentication tokens and user role from cookies.
 */
export const removeAuthData = (): void => {
  eraseCookie(ACCESS_TOKEN_KEY);
  eraseCookie(REFRESH_TOKEN_KEY);
  eraseCookie(USER_ROLE_KEY);
};
