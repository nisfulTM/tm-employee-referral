import { setCookie, getCookie, eraseCookie } from "./cookies";
import type { TTokens, TUser } from "@/types/auth.d";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_ROLE_KEY = "user_role";
const USER_NAME_KEY = "first_name";
const USER_EMPLOYEE_ID_KEY = "user_employee_id";

/**
 * Saves the authentication data to cookies and local storage.
 * @param data - The authentication data including tokens and user info.
 */
export const saveAuthData = (data: { user: TUser; tokens: TTokens }): void => {
  const { user, tokens } = data;
  setCookie(ACCESS_TOKEN_KEY, tokens.access, 7);
  setCookie(REFRESH_TOKEN_KEY, tokens.refresh, 30);
  setCookie(USER_ROLE_KEY, user.type, 7);
  localStorage.setItem(USER_NAME_KEY, user.first_name);
  localStorage.setItem(USER_EMPLOYEE_ID_KEY, user.employee_id);
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
 * Retrieves the user's name from local storage.
 * @returns The user's name, or null if not found.
 */
export const getUserName = (): string | null => {
  return localStorage.getItem(USER_NAME_KEY);
};

/**
 * Retrieves the user's employee ID from local storage.
 * @returns The user's employee ID, or null if not found.
 */
export const getUserEmployeeId = (): string | null => {
  return localStorage.getItem(USER_EMPLOYEE_ID_KEY);
};

/**
 * Removes all authentication data from cookies and local storage.
 */
export const removeAuthData = (): void => {
  eraseCookie(ACCESS_TOKEN_KEY);
  eraseCookie(REFRESH_TOKEN_KEY);
  eraseCookie(USER_ROLE_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(USER_EMPLOYEE_ID_KEY);
};
