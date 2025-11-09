"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { mockOrders } from "@/lib/mock-data"
import type { Order } from "@/types"

interface OrdersContextType {
  orders: Order[]
  setOrders: (orders: Order[] | ((prev: Order[]) => Order[])) => void
  handleAccept: (orderId: string) => void
  handleComplete: (orderId: string) => void
  handleReject: (orderId: string) => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders)

  const handleAccept = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: "in-progress", accepted: true } : order)),
    )
  }

  const handleComplete = (orderId: string) => {
    setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status: "completed" } : order)))
  }

  const handleReject = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: "rejected", rejected: true } : order)),
    )
  }

  return (
    <OrdersContext.Provider value={{ orders, setOrders, handleAccept, handleComplete, handleReject }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}

