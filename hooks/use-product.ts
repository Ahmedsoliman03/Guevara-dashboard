"use client"
import axios from "axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { AddProductForApi } from "@/types"
import api from "@/lib/api"

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


  // Add product
  const addProduct = 
     useMutation({
      mutationFn: async (data: AddProductForApi) => {
     const formData = new FormData();
      for (const key in data) {
        formData.append(key, (data as any)[key]);
      }
        const res = await api.post("/product", formData)
        return res.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] })
      },
    })
  

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
    addProduct,
    updateProduct,
    deleteProduct,
  }
}

export default useProduct

