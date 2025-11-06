// Simple auth utility (in production, use proper authentication)
export const validateCredentials = (email: string, password: string): boolean => {
  // Mock validation - replace with real auth
  const adminEmail = "admin@guevara.com"
  const adminPassword = "admin123"

  return email === adminEmail && password === adminPassword
}

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}
