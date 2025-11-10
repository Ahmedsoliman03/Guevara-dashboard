import axios from "axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

const useCart = () => {
  const queryClient = useQueryClient()

  // Get all cart items
  const getAllCart =
     useQuery({
      queryKey: ["cart", "all"],
      queryFn: async () => {
        // TODO: Replace with actual endpoint
        const res = await axios.get("")
        return res.data
      },
      staleTime: 1000 * 10, // cache for 10s
    })

  // Get single cart item by ID
  const getCartById = useCallback((id: string) => {
    return useQuery({
      queryKey: ["cart", "single", { id }],
      queryFn: async () => {
        // TODO: Replace with actual endpoint
        const res = await axios.get(`/${id}`)
        return res.data
      },
      staleTime: 1000 * 10,
      enabled: !!id,
    })
  }, [])

  // Add item to cart
  const addToCart = useCallback(() => {
    return useMutation({
      mutationFn: async (data: unknown) => {
        // TODO: Replace with actual endpoint
        const res = await axios.post("", data)
        return res.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] })
      },
    })
  }, [queryClient])

  // Update cart item
  const updateCart = useCallback(() => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
        // TODO: Replace with actual endpoint
        const res = await axios.put(`/${id}`, data)
        return res.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] })
      },
    })
  }, [queryClient])

  // Delete cart item
  const deleteCart = useCallback(() => {
    return useMutation({
      mutationFn: async (id: string) => {
        // TODO: Replace with actual endpoint
        const res = await axios.delete(`/${id}`)
        return res.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] })
      },
    })
  }, [queryClient])

  return {
    getAllCart,
    getCartById,
    addToCart,
    updateCart,
    deleteCart,
  }
}

export default useCart

