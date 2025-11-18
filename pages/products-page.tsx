"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/components/providers/products-provider"
import { ProductForm } from "../components/products/product-form"
import type { AddProductFormData } from "@/lib/validation"
import type { AddProductForApi, Product } from "@/types"
import {
  Edit24Regular,
  Delete24Regular,
  Box24Regular,
  Add24Regular,
} from "@fluentui/react-icons"
import useProduct from "@/hooks/use-product"
import toast from "react-hot-toast"
import { categoriesContext } from "@/components/providers/categories-provider"
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import useCategory from "@/hooks/use-category"


export default function ProductsPage() {
  // Data
   const {addProduct} = useProduct()
    const {getAllCategory} = useCategory()
  const {data:categoryData} = getAllCategory
    const { products, updateProduct, deleteProduct } = useProducts()

  // state
 
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const { categoryId} = categoriesContext()


//  filteration of product 
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return products
    }
    return products.filter((p) => p.categoryId === selectedCategory)
  }, [products, selectedCategory])

// Number of products
const numberofProducts = useMemo(()=>{
let sum = 0;
for (const item of categoryData ?? []) {
  sum += item.productNum;
}
return sum
},[categoryData])

// Add product
  const handleAddSubmit = (data: AddProductFormData) => {
    const mainData={
       name: data.name,
      image: data.image,
categoryId: categoryId ? categoryId : categoryData?.[0]?._id ?? "",
      stock: data.stock,
    }
    const dataForApi: AddProductForApi = data.price && data.price > 0 ? {
     ... mainData,
     finalPrice: data.price
      
    }:{
       ... mainData,
       originalPrice:data.originalPrice,
       finalPrice:data.finalPrice,
       discountPercent: data.discountPercent
    }    
    
     addProduct.mutate(dataForApi, {
    onSuccess: (res: any) => {   
      toast.success(res.message); 
      setIsAddModalOpen(false);
      // sendMessage("ooooo" , "201557588855" , "123456")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
    
  }

  // Update
  const handleEditSubmit = (data: AddProductFormData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data)
      setEditingProduct(null)
    }
  }

  // Delete
  const handleDelete = (product: Product) => {
    deleteProduct(product.id)
    setDeletingProduct(null)
  }

  const convertProductToFormData = (product: Product): Partial<AddProductFormData> => {
    return {
      name: product.name,
      categoryId: product.categoryId,
      stock: product.stock,
      isSale: product.isSale,
      price: product.isSale ? 0 : product.price,
      originalPrice: product.isSale ? product.originalPrice : 0,
      finalPrice: product.isSale ? product.price : 0,
      discountPercent: product.isSale ? product.discountPercent : 0,
    }
  }

  return (
    <div className="p-8 space-y-8 w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-2">Manage your product catalog</p>
          </div>
          <motion.div whileTap={{ scale: 0.95 }}>
       <Tooltip>
  <TooltipTrigger asChild>
    <div>
      <Button disabled={categoryData?.length === 0} onClick={() => setIsAddModalOpen(true)}>
        <Add24Regular className="w-5 h-5" />
        Add Product
      </Button>
    </div>
  </TooltipTrigger>
 {categoryData?.length === 0 && (
      <TooltipContent
        side="top"
        className="bg-red-900 text-white shadow rounded px-2 py-1 mb-2 mr-1"
      >
        Please add category first
      </TooltipContent>
    )}
</Tooltip>

          </motion.div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2">
        <motion.button
            onClick={() => setSelectedCategory("All")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 * 0.05 }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === "All"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card border border-border text-foreground hover:border-primary"
            }`}
          >
            All
            <span className="ml-2 text-xs">{numberofProducts}</span>
          </motion.button>
        {categoryData?.map((category, idx) => (
          <motion.button
            key={category._id}
            onClick={() => setSelectedCategory(category.name)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category.name
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card border border-border text-foreground hover:border-primary"
            }`}
          >
            {category.name}
            <span className="ml-2 text-xs">({category.productNum})</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full py-0">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.isSale && (
                      <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
                        -{product.discountPercent}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium">{product.categoryId}</p>
                        <h3 className="text-lg font-bold text-foreground mt-1 line-clamp-2">{product.name}</h3>
                      </div>
                      <Box24Regular className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2">
                      {product.isSale ? (
                        <>
                          <span className="text-lg font-bold text-primary">{product.price ? product.price.toFixed(2):""} EGP</span>
                          <span className="text-sm text-muted-foreground line-through">
                            {product.originalPrice?.toFixed(2)} EGP
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-primary">
  {Number(product.price ?? product.finalPrice ?? 0).toFixed(2)} EGP

                          </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Created: {product.createdAt.toLocaleDateString()}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() => setEditingProduct(product)}
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
                          onClick={() => setDeletingProduct(product)}
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
      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Box24Regular className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {selectedCategory === "All"
              ? "No products available"
              : `No products found in ${selectedCategory} category`}
          </p>
          {selectedCategory === "All" && (
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
              <Add24Regular className="w-5 h-5" />
              Add Product
            </Button>
          )}
        </motion.div>
      )}

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <Modal
            title="Add Product"
            onClose={() => setIsAddModalOpen(false)}
          >
            <ProductForm onSubmit={handleAddSubmit} showCard={false} />
          </Modal>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <Modal
            title="Edit Product"
            onClose={() => setEditingProduct(null)}
          >
            <ProductForm
              onSubmit={handleEditSubmit}
              initialValues={convertProductToFormData(editingProduct)}
              initialImage={editingProduct.image}
              submitButtonText="Update Product"
              showCard={false}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingProduct && (
          <Modal
            title="Delete Product"
            onClose={() => setDeletingProduct(null)}
          >
            <div className="space-y-4">
              <p className="text-foreground">
                Are you sure you want to delete the product <strong>{deletingProduct.name}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDeletingProduct(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deletingProduct)}
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
        className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
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
