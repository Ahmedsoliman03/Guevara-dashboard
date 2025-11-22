export interface Order {
  id: string
  code: string
  status: "Pending" | "In-Progress" | "Delivered" | "Rejected"
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
  _id: string,
  image: {
    secure_url: string;
  };
  name: string;
  stock: number;
  onSale: boolean;
  originalPrice: number;
  discountPercent: number;
  finalPrice: number;
  folderId: string;
  categoryId: {
    _id: string;
    name: string;
  };

  createdAt: string; // or Date if you convert it

}



export interface DashboardStats {
  pending: number
  inProgress: number
  completed: number
  rejected: number
}

export interface Category {
  _id: string,
  createdAt: string,
  name: string,
  logo: {
    secure_url: string
  },
  productNum: number
  updatedAt: string
}

export interface AddProductForApi {
  name: string,
  categoryId: string
  image: File
  stock: number
  isSale?: boolean
  discountPercent?: number | null
  originalPrice?: number
  finalPrice?: number,
  price?: number,
}

export interface OrderStatus {
  status: "Pending" | "In-Progress" | "Delivered" | "Rejected" | "Canceled"
  count: number;
}

// Auth
export interface AuthCredentials {

  email: string
  password: string
}

export interface ResetPasswordData {
  email: string
  otp: string
  newPassword: string
}