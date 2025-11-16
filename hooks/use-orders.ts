import axios from "axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

const useOrders = () => {
  const queryClient = useQueryClient()

  // Get all orders
  const getAllOrders = useCallback(() => {
    return useQuery({
      queryKey: ["orders", "all"],
      queryFn: async () => {
        // TODO: Replace with actual endpoint
        const res = await axios.get("")
        return res.data
      },
      staleTime: 1000 * 10, // cache for 10s
    })
  }, [])

  // Get single order by ID
  const getOrderById = useCallback((id: string) => {
    return useQuery({
      queryKey: ["orders", "single", { id }],
      queryFn: async () => {
        // TODO: Replace with actual endpoint
        const res = await axios.get(`/${id}`)
        return res.data
      },
      staleTime: 1000 * 10,
      enabled: !!id,
    })
  }, [])
// send message after order accepted or rejected
const sendMessage = (userName: string , phone:string , orderId:string , reason?:string) => {
  const message = reason ?`مرحبًا ${userName} 👋
نأسف لإبلاغك أن طلبك لدى Guevara (رقم ${orderId}) تم رفضه ❌
السبب: ${reason}
إذا رغبت في مزيد من المعلومات أو إعادة المحاولة، تواصل معنا وسنكون سعداء بالمساعدة.
شكرًا لتفهمك ❤️`
:
`مرحبًا ${userName} 👋
تم استلام طلبك في Guevara بنجاح وجارٍ الآن تجهيز الطلب 🚚💨
🔢 رقم الطلب: ${orderId}
شكرًا لثقتك في Guevara ❤️`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};
  // Accept order
  const acceptOrder = useCallback(() => {
    return useMutation({
      mutationFn: async (id: string) => {
        // TODO: Replace with actual endpoint
        const res = await axios.post(`/${id}/accept`)
        return res.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] })
      },
    })
  }, [queryClient])

  // Reject order
  const rejectOrder = useCallback(() => {
    return useMutation({
      mutationFn: async (id: string) => {
        // TODO: Replace with actual endpoint
        const res = await axios.post(`/${id}/reject`)
        return res.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] })
      },
    })
  }, [queryClient])

  return {
    getAllOrders,
    getOrderById,
    acceptOrder,
    rejectOrder,
    sendMessage
  }
}

export default useOrders

