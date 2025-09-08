import { apiClient } from "./api"
import type { AuthResponse, LoginCredentials, SignupCredentials, User } from "./types"

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials)
    if (response.token) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }
    return response
  }

  static async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/signup", credentials)
    if (response.token) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }
    return response
  }

  static logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  static getToken(): string | null {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null
  }

  static getUser(): User | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }
}
