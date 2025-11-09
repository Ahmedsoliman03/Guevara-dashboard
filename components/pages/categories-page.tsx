"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCategories } from "@/components/providers/categories-provider"
import { CategoryForm } from "./add-category/category-form"
import type { AddCategoryFormData } from "@/lib/validation"
import type { Category } from "@/types"
import {
  Edit24Regular,
  Delete24Regular,
  Add24Regular,
  Folder24Regular,
} from "@fluentui/react-icons"

export default function CategoriesPage() {
  const router = useRouter()
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  const handleAddSubmit = (data: AddCategoryFormData) => {
    addCategory(data)
    setIsAddModalOpen(false)
  }

  const handleEditSubmit = (data: AddCategoryFormData) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: data.name,
        numberOfProducts: data.numberOfProducts,
        // If a new file was uploaded, use it; otherwise keep the existing photo
        photo: data.photo instanceof File ? data.photo : editingCategory.photo,
      })
      setEditingCategory(null)
    }
  }

  const handleDelete = (category: Category) => {
    deleteCategory(category.id)
    setDeletingCategory(null)
  }

  return (
    <div className="p-8 space-y-8 w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground mt-2">Manage your product categories</p>
          </div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
              <Add24Regular className="w-5 h-5" />
              Add Category
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-0">
                  {/* Category Image */}
                  <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={category.photo || "/placeholder.jpg"}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Category Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{category.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.numberOfProducts} product{category.numberOfProducts !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <Folder24Regular className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Created: {category.createdAt.toLocaleDateString()}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Edit24Regular className="w-4 h-4" />
                          Edit
                        </Button>
                      </motion.div>
                      <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() => setDeletingCategory(category)}
                        >
                          <Delete24Regular className="w-4 h-4" />
                          Delete
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Folder24Regular className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No categories yet</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first category</p>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Add24Regular className="w-5 h-5" />
            Add Category
          </Button>
        </motion.div>
      )}

      {/* Add Category Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <Modal
            title="Add Category"
            onClose={() => setIsAddModalOpen(false)}
          >
            <CategoryForm onSubmit={handleAddSubmit} showCard={false} />
          </Modal>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {editingCategory && (
          <Modal
            title="Edit Category"
            onClose={() => setEditingCategory(null)}
          >
            <CategoryForm
              onSubmit={handleEditSubmit}
              initialValues={{
                name: editingCategory.name,
                numberOfProducts: editingCategory.numberOfProducts,
                photo: undefined as any,
              }}
              initialImage={editingCategory.photo}
              submitButtonText="Update Category"
              showCard={false}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingCategory && (
          <Modal
            title="Delete Category"
            onClose={() => setDeletingCategory(null)}
          >
            <div className="space-y-4">
              <p className="text-foreground">
                Are you sure you want to delete the category <strong>{deletingCategory.name}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDeletingCategory(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deletingCategory)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

// Modal Component
function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>
            <div className="p-6 w-full">{children}</div>
      </motion.div>
    </motion.div>
  )
}


