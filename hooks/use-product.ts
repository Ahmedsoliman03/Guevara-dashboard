"use client"
import axios from "axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { AddProductForApi, Product } from "@/types"
import api from "@/lib/api"

const useProduct = () => {
  const queryClient = useQueryClient()

  // Get all products
  const getAllProducts = ({ key }: { key: string }) =>
    useQuery({
      queryKey: ["products", { key }],
      queryFn: async () => {
        const res = await api.get("/product");
        console.log(res.data);

        return res.data.data.products;
      },
      staleTime: 1000 * 10,
    });


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
        queryClient.invalidateQueries({ queryKey: ["category"] });

      },
    })


  // Update product
  const updateProduct =
    useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<AddProductForApi> }) => {
        const formData = new FormData();
        for (const key in data) {
          const value = (data as any)[key];
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        }
        const res = await api.patch(`/product/${id}`, formData)
        console.log(res);

        return res.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] })
      },
    })


  // Delete product
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/product/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["category"] });

    },
  })

  return {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}

export default useProduct

