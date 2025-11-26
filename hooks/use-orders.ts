"use client"
import axios from "axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import api from "@/lib/api"
import { Order, OrderResponse } from "@/types"

const useOrders = () => {
  const queryClient = useQueryClient()

  // Get all orders
  const getAllOrders = useQuery({
    queryKey: ["orders", "all"],
    queryFn: async () => {
      // TODO: Replace with actual endpoint
      const res = await api.get("/order/all-orders")
      return res.data as Order[]
    },
    staleTime: 1000 * 10, // cache for 10s
  })

  // send message after order accepted or rejected
  const sendMessage = (userName: string, phone: string, orderId: string, reason?: string) => {
    const message = reason ? `مرحبًا ${userName} 
نأسف لإبلاغك أن طلبك لدى Guevara (رقم ${orderId}) تم رفضه 
السبب: ${reason}
إذا رغبت في مزيد من المعلومات أو إعادة المحاولة، تواصل معنا وسنكون سعداء بالمساعدة.
شكرًا لتفهمك `
      :
      `مرحبًا ${userName} 
تم استلام طلبك في Guevara بنجاح وجارٍ الآن تجهيز الطلب 
 رقم الطلب: ${orderId}
شكرًا لثقتك في Guevara `;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };
  // Accept order
  const acceptOrderMutation = useMutation({
    mutationFn: async (order: Order) => {
      const data = {
        id: order._id,
        "status": "In Progress"
      }
      // TODO: Replace with actual endpoint
      const res = await api.patch(`/order/inprogress-order`, data)
      sendMessage(order.shippingName, order.phone, order._id)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })

  // Reject order
  // Reject order
  const rejectOrderMutation = useMutation({
    mutationFn: async ({ order, reason }: { order: Order; reason?: string }) => {
      const data = {
        id: order._id,
        status: "Rejected",
      }
      const res = await api.patch(`/order/reject-order`, data)
      sendMessage(order.shippingName, order.phone, order._id, reason)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
  // Reject order
  const confirmOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      const data = {
        id,
        "status": "Delivered"
      }
      const res = await api.patch(`/order/confirm-order`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })

  return {
    getAllOrders,
    acceptOrder: acceptOrderMutation,
    rejectOrder: rejectOrderMutation,
    confirmOrder: confirmOrderMutation,
    sendMessage
  }
}

export default useOrders

