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
  }
}

export default useOrders

