"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { mockCategories } from "@/lib/mock-data"
import type { Category } from "@/types"
import type { AddCategoryFormData } from "@/lib/validation"

interface CategoriesContextType {
  categories: Category[]
  setCategories: (categories: Category[] | ((prev: Category[]) => Category[])) => void
  addCategory: (data: AddCategoryFormData) => void
  updateCategory: (id: string, data: Partial<Category>) => void
  deleteCategory: (id: string) => void
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined)

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(mockCategories)

  const addCategory = (data: AddCategoryFormData) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: data.name,
      numberOfProducts: data.numberOfProducts,
      photo: data.photo instanceof File ? URL.createObjectURL(data.photo) : "/placeholder.jpg",
      createdAt: new Date(),
    }
    setCategories((prev) => [...prev, newCategory])
  }

  const updateCategory = (id: string, data: Partial<Category> | { name: string; numberOfProducts: number; photo?: File | string }) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== id) return category
        
        const updatedCategory = {
          ...category,
          name: data.name ?? category.name,
          numberOfProducts: data.numberOfProducts ?? category.numberOfProducts,
          photo: data.photo instanceof File 
            ? URL.createObjectURL(data.photo) 
            : typeof data.photo === 'string' 
              ? data.photo 
              : category.photo,
        }
        return updatedCategory
      }),
    )
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id))
  }

  return (
    <CategoriesContext.Provider value={{ categories, setCategories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoriesContext)
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider")
  }
  return context
}

