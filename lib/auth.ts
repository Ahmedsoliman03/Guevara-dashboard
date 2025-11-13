// Simple auth utility (in production, use proper authentication)


import Cookies from "js-cookie"

export const validateCredentials = (email: string, password: string): boolean => {
  // Mock validation - replace with real auth
  const adminEmail = "admin@guevara.com"
  const adminPassword = "admin123"

  return email === adminEmail && password === adminPassword
}

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
