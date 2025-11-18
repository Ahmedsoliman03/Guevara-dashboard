"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { Category } from "@/types"


interface CategoriesContextType {
  categories: Category[]
  setCategories: (categories: Category[] | ((prev: Category[]) => Category[])) => void

  setCategoryId: (val: string) => void,
  categoryId: string | null
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined)

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
const [categoryId , setCategoryId] = useState<string | null>( null)




  return (
    <CategoriesContext.Provider value={{ categories, setCategories, setCategoryId , categoryId }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function categoriesContext() {
  const context = useContext(CategoriesContext)
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider")
  }
  return context
}

