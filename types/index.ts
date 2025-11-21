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

// export interface Product {
//   id: string
//   name: string
//   categoryId: "Skincare" | "Lips" | "Makeup" | "Eyes"
//   image: string
//   price?: number
//   originalPrice?: number
//   finalPrice?: string ,
//   discountPercent?: number | null ,
//   isSale: boolean
//   stock: number
//   createdAt: Date
// }
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
  _id: string,
  createdAt: string,
  name: string,
  logo: {
    secure_url: string
  },
  productNum: number
  updatedAt: string
}

export interface AuthCredentials {

  email: string
  password: string

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
  status: "pending" | "inprogress" | "delivered" | "canceled" | "rejected";
  count: number;
}