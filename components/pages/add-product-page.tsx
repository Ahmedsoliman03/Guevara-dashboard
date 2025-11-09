"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ProductForm } from "./add-product/product-form"
import { useProducts } from "@/components/providers/products-provider"
import type { AddProductFormData } from "@/lib/validation"

export default function AddProductPage() {
  const router = useRouter()
  const { addProduct } = useProducts()

  const handleSubmit = (data: AddProductFormData) => {
    addProduct(data)
    router.push("/products")
  }

  return (
    <div className="p-8 space-y-8 w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-foreground">Add Product</h1>
        <p className="text-muted-foreground mt-2">Add a new cosmetics product to your catalog</p>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <ProductForm onSubmit={handleSubmit} />
      </motion.div>
    </div>
  )
}
