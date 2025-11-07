"use client"

import { motion } from "framer-motion"
import { ProductForm } from "./add-product/product-form"
import type { AddProductFormData } from "@/lib/validation"

export default function AddProductPage() {
  const handleSubmit = (data: AddProductFormData) => {
    console.log("Product submitted:", data)
    alert("Product added successfully!")
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
