"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ProductForm } from "@/components/products/product-form"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip"
import useCategory from "@/hooks/use-category"
import { formatDate } from "@/utils/format"
import ProductLoadingSkeleton from "./product-loading-skeleton"

import { ProductFilters } from "./product-filters"

export default function ProductsClient() {

    // state
    const [selectedCategory, setSelectedCategory] = useState<string>("All")
    const [selectedCompany, setSelectedCompany] = useState<string>("All")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
    const { categoryId } = categoriesContext()
    const [searchTerm, setSearchTerm] = useState("")
    const { getCompaniesOfCategory: { data: companies, isPending: companiesLoading } } = useCategory()

    // Data
    const { addProduct } = useProduct()
    const { getAllCategory } = useCategory()
    const { data: categoryData } = getAllCategory
    const { getAllProducts, updateProduct, deleteProduct } = useProduct()
    const { data: products, isPending } = getAllProducts({ key: selectedCategory })

    // Filter products by category, company and search term
    const filteredProducts = useMemo(() => {
        let result = products

        // Category filter
        if (selectedCategory !== "All") {
            result = result?.filter((p: Product) => p.categoryId.name === selectedCategory)
        }

        // Company filter
        if (selectedCompany !== "All") {
            result = result?.filter((p: Product) => p.companyName === selectedCompany)
        }

        // Search filter - simple case-insensitive search
        if (searchTerm && result) {
            const searchLower = searchTerm.toLowerCase()
            result = result.filter((p: Product) =>
                p.productEnglishName.toLowerCase().includes(searchLower) ||
                p.productArabicName.toLowerCase().includes(searchLower) ||
                p.companyName.toLowerCase().includes(searchLower)
            )
        }

        return result ? [...result].reverse() : []
    }, [products, selectedCategory, selectedCompany, searchTerm])

    // Add product
    const handleAddSubmit = (data: AddProductFormData) => {
        const mainData = {
            productEnglishName: data.productEnglishName,
            productArabicName: data.productArabicName,
            companyName: data.companyName,
            image: data.image,
            categoryId: categoryId ? categoryId : categoryData?.[0]?._id ?? "",
            stock: data.stock,
            onSale: data.isSale,
        }
        const dataForApi: AddProductForApi = data.price && data.price > 0 ? {
            ...mainData,
            originalPrice: data.price
        } : {
            ...mainData,
            originalPrice: data.originalPrice,
            finalPrice: data.finalPrice,
            discountPercent: data.discountPercent
        }

        addProduct.mutate(dataForApi, {
            onSuccess: (res: any) => {
                toast.success(res.message);
                setIsAddModalOpen(false);
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || "Something went wrong");
            },
        });
    }

    // Update
    const handleEditSubmit = (data: AddProductFormData, id?: string) => {
        if (editingProduct && id) {
            const mainData = {
                productEnglishName: data.productEnglishName,
                productArabicName: data.productArabicName,
                companyName: data.companyName,
                image: data.image,
                categoryId: data.categoryId,
                stock: data.stock,
                onSale: data.isSale,
            }
            const dataForApi: Partial<AddProductForApi> = !data.isSale ? {
                ...mainData,
                originalPrice: data.price
            } : {
                ...mainData,
                originalPrice: data.originalPrice,
                finalPrice: data.finalPrice,
                discountPercent: data.discountPercent
            }

            updateProduct.mutate({ data: dataForApi, id }, {
                onSuccess: (res: any) => {
                    setEditingProduct(null)
                    toast.success(res.message);
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || "Something went wrong");
                },
            })
        }
    }

    // Delete
    const handleDelete = (product: Product) => {
        deleteProduct.mutate(product._id, {
            onSuccess: () => {
                toast.success("Product deleted successfully");
                setDeletingProduct(null)

            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || "Something went wrong");
            },
        })
    }

    const convertProductToFormData = (product: Product): Partial<AddProductFormData> => {
        return {
            productEnglishName: product.productEnglishName,
            productArabicName: product.productArabicName,
            companyName: product.companyName,
            categoryId: product.categoryId._id,
            stock: product.stock,
            isSale: product.onSale,
            price: product.onSale ? 0 : product.originalPrice,
            originalPrice: product.onSale ? product.originalPrice : 0,
            finalPrice: product.onSale ? product.finalPrice : 0,
            discountPercent: product.onSale ? product.discountPercent : 0,
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

            {/* Search and Filters */}
            <ProductFilters
                categories={categoryData || []}
                categoryCompanies={companies || []}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isLoading={isPending || companiesLoading}
            />

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {isPending ? (
                        <ProductLoadingSkeleton />
                    ) : (
                        filteredProducts?.map((product: Product, idx: number) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow h-full py-0">
                                    <CardContent className="p-0">
                                        {/* Product Image */}
                                        <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
                                            <Image
                                                src={product.image.secure_url || "/placeholder.jpg"}
                                                alt={product.productEnglishName}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                priority={idx < 4}
                                            />
                                            {product.onSale && (
                                                <div className="absolute top-2 right-2 bg-destructive text-white px-3 py-1 rounded-full text-sm font-bold shadow-md transform -rotate-1 group-hover:rotate-0 transition-transform">
                                                    {product.discountPercent}% OFF
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-xs text-muted-foreground font-medium">{product.categoryId.name}</p>
                                                    <div className="flex items-center gap-1 justify-between">
                                                        <h3 className="text-lg font-bold text-foreground mt-1 line-clamp-2">{product.productEnglishName.slice(0, 20)}...</h3>
                                                        <h3 className="text-lg font-bold text-foreground mt-1 line-clamp-2">QTY: {product.stock}</h3>
                                                    </div>
                                                </div>
                                                <Box24Regular className="w-5 h-5 text-muted-foreground  ml-2" />
                                            </div>

                                            {/* Pricing */}
                                            <div className="flex items-baseline gap-2">
                                                {product.onSale ? (
                                                    <>
                                                        <span className="text-lg font-bold text-primary">{product.finalPrice.toFixed(0)}{" "}EGP</span>
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            {product.originalPrice?.toFixed(0)} EGP
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-lg font-bold text-primary">
                                                        {Number(product.originalPrice ?? product.finalPrice ?? 0).toFixed()} {" "}EGP
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-muted-foreground">
                                                Created: {formatDate(product.createdAt)}
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
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredProducts?.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <Box24Regular className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchTerm
                            ? `No products found matching "${searchTerm}"`
                            : selectedCompany !== "All"
                                ? `No products found for company "${selectedCompany}" in "${selectedCategory}"`
                                : selectedCategory === "All"
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
                        <ProductForm onSubmit={handleAddSubmit} showCard={false} isLoading={addProduct.isPending} />
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
                            initialImage={editingProduct.image.secure_url}
                            submitButtonText="Update Product"
                            showCard={false}
                            productId={editingProduct._id}
                            isLoading={updateProduct.isPending}
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
                                Are you sure you want to delete the product <strong>{deletingProduct.productEnglishName}</strong>?
                            </p>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setDeletingProduct(null)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(deletingProduct)}
                                    disabled={deleteProduct.isPending}
                                    loading={deleteProduct.isPending}
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
