import Cookies from "js-cookie"

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    Cookies.set("accessToken", token, { expires: 1, path: "/" });
  }
}

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      return accessToken;
    }
  }
  return null
}

export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    Cookies.remove("accessToken", { path: "/" });
  }
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}
