import type { Order, Product, Category } from "@/types"

export const mockOrders: Order[] = [
  {
    id: "1",
    code: "ORD-2024-001",
    status: "Pending",
    userName: "Sarah Johnson",
    productName: "Hydrating Face Serum",
    quantity: 2,
    totalPrice: 89.99,
    address: "123 Beauty Lane, NYC",
    createdAt: new Date("2024-11-05"),
  },
  {
    id: "2",
    code: "ORD-2024-002",
    status: "Pending",
    userName: "Emma Wilson",
    productName: "Lipstick Red Velvet",
    quantity: 1,
    totalPrice: 24.99,
    address: "456 Style Ave, LA",
    createdAt: new Date("2024-11-04"),
  },
  {
    id: "3",
    code: "ORD-2024-003",
    status: "Delivered",
    userName: "Jessica Brown",
    productName: "Eye Shadow Palette",
    quantity: 3,
    totalPrice: 119.97,
    address: "789 Glamour St, Miami",
    createdAt: new Date("2024-11-03"),
  },
  {
    id: "4",
    code: "ORD-2024-004",
    status: "Pending",
    userName: "Michael Chen",
    productName: "Moisturizing Cream",
    quantity: 1,
    totalPrice: 45.99,
    address: "321 Care Blvd, SF",
    createdAt: new Date("2024-11-02"),
  },
]


