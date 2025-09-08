export interface User {
  id: number
  name: string
  email: string
}

export interface Item {
  id: number
  name: string
  description?: string
  category: string
  price: number
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  id: number
  userId: number
  itemId: number
  quantity: number
  item: Item
  createdAt?: string
  updatedAt?: string
}

export interface Cart {
  cartItems: CartItem[]
  total: number
  itemCount: number
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface ApiError {
  error: string
  details?: any
}

export interface ItemsResponse {
  items: Item[]
  count: number
}

export interface CartResponse extends Cart {}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
}

export interface ItemFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
}
