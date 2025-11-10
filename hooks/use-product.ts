import axios from "axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

const useProduct = () => {
  const queryClient = useQueryClient()

  // Get all products
  const getAllProducts = useCallback(() => {
    return useQuery({
      queryKey: ["products", "all"],
      queryFn: async () => {
        // TODO: Replace with actual endpoint
        const res = await axios.get("")
        return res.data
      },
      staleTime: 1000 * 10, // cache for 10s
    })
  }, [])

  // Get single product by ID
  const getProductById = useCallback((id: string) => {
    return useQuery({
      queryKey: ["products", "single", { id }],
      queryFn: async () => {
        // TODO: Replace with actual endpoint
        const res = await axios.get(`/${id}`)
        return res.data
      },
      staleTime: 1000 * 10,
      enabled: !!id,
    })
  }, [])

  // Add product
  const addProduct = useCallback(() => {
    return useMutation({
      mutationFn: async (data: unknown) => {
        // TODO: Replace with actual endpoint
        const res = await axios.post("", data)
        return res.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] })
      },
    })
  }, [queryClient])

  // Update product
  const updateProduct = useCallback(() => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
        // TODO: Replace with actual endpoint
        const res = await axios.put(`/${id}`, data)
        return res.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] })
      },
    })
  }, [queryClient])

  // Delete product
  const deleteProduct = useCallback(() => {
    return useMutation({
      mutationFn: async (id: string) => {
        // TODO: Replace with actual endpoint
        const res = await axios.delete(`/${id}`)
        return res.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] })
      },
    })
  }, [queryClient])

  return {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}

export default useProduct

