"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CategoryForm } from "../components/categorys/category-form"
import type { AddCategoryFormData } from "@/lib/validation"
import type { Category } from "@/types"
import {
  Edit24Regular,
  Delete24Regular,
  Add24Regular,
  Folder24Regular,
} from "@fluentui/react-icons"
import useCategory from "@/hooks/use-category"
import toast from "react-hot-toast"
import useOrders from "@/hooks/use-orders"
import { formatDate } from "@/utils/format"
import EmptyCategory from "@/components/categorys/emptyCategory"
import Modal from "@/components/categorys/Modal"
import ConfirmationDelete from "@/components/categorys/confirmationDelete"

export default function CategoriesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [singleId , setSingleId] = useState<string>("")
const {addToCategory , getAllCategory , updateCategory , deleteCategory} = useCategory()
const {data: CategoryData , isPending , error} = getAllCategory

const {sendMessage} = useOrders()
 const handleAddSubmit = (data: AddCategoryFormData ) => {
  addToCategory.mutate(data, {
    onSuccess: (res: any) => {   
      toast.success(res.message); 
      setIsAddModalOpen(false);
      // sendMessage("كسمك" , "201557588855" , "123456")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

const onEdit = (id:string , category:Category)=>{
  setSingleId(id)
  setEditingCategory(category)
}


const handleEditSubmit = (data: AddCategoryFormData, id?: string) => {
  if (!id) {
    toast.error("ID is required to update category");
    return;
  }

  updateCategory.mutate({ data, id }, {
    onSuccess: (res: any) => {   
      setEditingCategory(null)
      toast.success(res.message); 
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};
  const handleDelete = ( id:string) => {
    if (!id) {
    toast.error("ID is required to update category");
    return;
  }

  deleteCategory.mutate( id, {
    onSuccess: (res: any) => {   
      toast.success(res.message); 
      setDeletingCategory(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
    
  }

  return (
    <div className="p-8 space-y-8 w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-2 justify-between">
          <div>
            <h1 className=" text-2xl md:text-4xl font-bold text-foreground">Categories</h1>
          </div>
          <motion.div whileTap={{ scale: 0.95 }}>
            {CategoryData?.length !== 0 &&
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
              <Add24Regular className="w-5 h-5" />
              Add Category
            </Button>
}
          </motion.div>
        </div>
                    <p className="text-muted-foreground mt-2 w-full">Manage your product categories</p>

      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {isPending ? <p>loading</p> : 
[...(CategoryData || [])].reverse().map((category, idx) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full py-0">
                <CardContent className="p-0">
                  {/* Category Image */}
                  <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={category.logo.secure_url || "/placeholder.jpg"}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Category Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{category.name}</h3>
                     
                      </div>
                      <p className="text-md text-muted-foreground">{category?.productNum} product</p>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Created: {formatDate(category.createdAt)}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() => onEdit( category._id , category )}
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
      {CategoryData?.length === 0 && (
      <EmptyCategory setIsAddModalOpen={setIsAddModalOpen}/>
      )}

      {/* Add Category Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <Modal
            title="Add Category"
            onClose={() => setIsAddModalOpen(false)}
          >
            <CategoryForm onSubmit={handleAddSubmit} showCard={false} isLoading={addToCategory.isPending}/>
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
                file: undefined as any,
              }}
              initialImage={editingCategory.logo.secure_url}
              submitButtonText="Update Category"
              showCard={false}
              id= {singleId}
              isLoading={updateCategory.isPending}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingCategory && (
        <ConfirmationDelete 
        deletingCategory={deletingCategory}
        handleDelete={handleDelete}
        setDeletingCategory={setDeletingCategory}
        isLoading= {deleteCategory.isPending}
        />
        )}
      </AnimatePresence>
    </div>
  )
}