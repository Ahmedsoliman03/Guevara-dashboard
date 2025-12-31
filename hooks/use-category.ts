"use client"
import api from "@/lib/api"
import { AddCategoryFormData } from "@/lib/validation";
import { Category, CategoryCompany } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const useCategory = () => {
  const queryClient = useQueryClient();
  // Get all Category items
  const getAllCategory = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await api.get("/category"); // replace with real endpoint

      return res.data.data.categories as Category[];
    },
    staleTime: 1000 * 10,
  });

  // Add item to Category
  const addToCategory = useMutation({
    mutationFn: async (data: AddCategoryFormData) => {
      // formData append if needed
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, (data as any)[key]);
      }
      const res = await api.post("/category", formData);

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  // Update Category item
  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AddCategoryFormData }) => {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, (data as any)[key]);
      }
      const res = await api.patch(`/category/${id}`, formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  // Delete Category item
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/category/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  // get companies of categoryies
  const getCompaniesOfCategory = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await api.get(`/category/companies`)
      return res.data.data as CategoryCompany[]
    },
    staleTime: 1000 * 10,
  })
  return {
    getAllCategory,
    addToCategory,
    updateCategory,
    deleteCategory,
    getCompaniesOfCategory,
  };
};

export default useCategory;
