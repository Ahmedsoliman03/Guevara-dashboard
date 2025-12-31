export interface Order {
  _id: string
  shippingName: string
  address: string
  phone: string
  note: string
  products: OrderProduct[]
  orderId: string
  createdAt: string
  finalPrice: number
  status: "Pending" | "In Progress" | "Delivered" | "Rejected" | "Canceled" | "Deleted"
  paymentMethod: string
  userRating?: number
}
interface OrderProduct {
  name: string,
  productId: string,
  unitPrice: number,
  quantity: number,
  finalPrice: number,
}
export interface OrderResponse {
  orders: Order[]
}
export interface Product {
  _id: string,
  image: {
    secure_url: string;
  };
  productEnglishName: string;
  productArabicName: string;
  companyName: string;
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
  productEnglishName: string,
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


export interface CategoryCompany {
  categoryName: string
  companies: string[]
}