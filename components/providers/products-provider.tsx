"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { mockProducts } from "@/lib/mock-data"
import type { Product } from "@/types"
import type { AddProductFormData } from "@/lib/validation"

interface ProductsContextType {
  products: Product[]
  setProducts: (products: Product[] | ((prev: Product[]) => Product[])) => void
  addProduct: (data: AddProductFormData) => void
  updateProduct: (id: string, data: Partial<Product> | AddProductFormData) => void
  deleteProduct: (id: string) => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts)

  const addProduct = (data: AddProductFormData) => {
    // Auto-calculate sale percentage if sale is enabled
    let discountPercent = data.discountPercent
    if (data.isSale && data.originalPrice && data.finalPrice && data.originalPrice > data.finalPrice) {
      discountPercent = Math.round(((data.originalPrice - data.finalPrice) / data.originalPrice) * 100)
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: data.name,
      categoryId: data.categoryId as Product["categoryId"],
      image: data.image instanceof File ? URL.createObjectURL(data.image) : "/placeholder.jpg",
      price: data.isSale ? data.finalPrice! : data.price!,
      originalPrice: data.isSale ? data.originalPrice : undefined,
      discountPercent: data.isSale ? discountPercent : null,
      isSale: data.isSale,
      stock: data.stock || 0,
      createdAt: new Date(),
    }
    setProducts((prev) => [...prev, newProduct])
  }

  const updateProduct = (id: string, data: Partial<Product> | AddProductFormData) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== id) return product

        // Check if it's AddProductFormData (from form) or Partial<Product>
        if ("name" in data && "category" in data && "isSale" in data) {
          // It's AddProductFormData
          const formData = data as AddProductFormData
          
          // Auto-calculate sale percentage if sale is enabled
          let salePercentage = formData.discountPercent
          if (formData.isSale && formData.originalPrice && formData.finalPrice && formData.originalPrice > formData.finalPrice) {
            salePercentage = Math.round(((formData.originalPrice - formData.finalPrice) / formData.originalPrice) * 100)
          }

          const updatedProduct = {
            ...product,
            name: formData.name,
            category: formData.categoryId as Product["categoryId"],
            price: formData.isSale ? formData.finalPrice! : formData.price!,
            originalPrice: formData.isSale ? formData.originalPrice : undefined,
            discountPercent: formData.isSale ? salePercentage : undefined,
            isSale: formData.isSale,
            stock: formData.stock || 0,
          }

          // Handle image update - only update if a new file was uploaded
          if (formData.image instanceof File) {
            return {
              ...updatedProduct,
              image: URL.createObjectURL(formData.image),
            }
          }
          // If no new image, keep the existing one
          return updatedProduct
        } else {
          // It's Partial<Product>
          const partialData = data as Partial<any>
          return {
            ...product,
            ...partialData,
            image:
              partialData.image instanceof File
                ? URL.createObjectURL(partialData.image)
                : typeof partialData.image === "string"
                  ? partialData.image
                  : product.image,
          }
        }
      }),
    )
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  return (
    <ProductsContext.Provider value={{ products, setProducts, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}

