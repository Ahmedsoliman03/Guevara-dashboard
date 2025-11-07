"use client"

import { motion } from "framer-motion"
import { CategoryForm } from "./add-category/category-form"
import type { AddCategoryFormData } from "@/lib/validation"

export default function AddCategoryPage() {
  const handleSubmit = (data: AddCategoryFormData) => {
    console.log("Category submitted:", data)
    alert("Category added successfully!")
  }

  return (
    <div className="p-8 space-y-8 w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-foreground">Add Category</h1>
        <p className="text-muted-foreground mt-2">Add a new category to your catalog</p>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <CategoryForm onSubmit={handleSubmit} />
      </motion.div>
    </div>
  )
}

