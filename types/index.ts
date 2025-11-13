export interface Order {
  id: string
  code: string
  status: "pending" | "in-progress" | "completed" | "rejected"
  userName: string
  productName: string
  quantity: number
  totalPrice: number
  address: string
  createdAt: Date
  accepted?: boolean
  rejected?: boolean
  
}

export interface Product {
  id: string
  name: string
  category: "Skincare" | "Lips" | "Makeup" | "Eyes"
  image: string
  price: number
  oldPrice?: number
  salePercentage?: number
  isSale: boolean
  count: number
  createdAt: Date
}

export interface AdminUser {
  id: string
  email: string
  password: string
}

export interface DashboardStats {
  pending: number
  inProgress: number
  completed: number
  rejected: number
}

export interface Category {
  id: string
  name: string
  numberOfProducts: number
  photo: string
  createdAt: Date
}

export interface AuthCredentials {

  email: string
  password: string
 
}