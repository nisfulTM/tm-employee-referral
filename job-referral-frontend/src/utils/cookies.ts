/**
 * Sets a cookie with the given name, value, and expiration days.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param days - The number of days until the cookie expires.
 */
export const setCookie = (name: string, value: string, days: number): void => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

/**
 * Gets the value of a cookie by its name.
 * @param name - The name of the cookie.
 * @returns The value of the cookie, or null if not found.
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Erases a cookie by its name.
 * @param name - The name of the cookie to erase.
 */
export const eraseCookie = (name: string): void => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}
