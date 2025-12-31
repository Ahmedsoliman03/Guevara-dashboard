"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CategoryForm } from "@/components/categorys/category-form"
import type { AddCategoryFormData } from "@/lib/validation"
import type { Category } from "@/types"
import {
    Edit24Regular,
    Delete24Regular,
    Add24Regular,
} from "@fluentui/react-icons"
import useCategory from "@/hooks/use-category"
import toast from "react-hot-toast"
import useOrders from "@/hooks/use-orders"
import { formatDate } from "@/utils/format"
import EmptyCategory from "@/components/categorys/emptyCategory"
import Modal from "@/components/ui/Modal"
import ConfirmationDelete from "@/components/categorys/confirmationDelete"
import CategoryLoadingSkeleton from "@/components/categorys/category-loading-skeleton"

export default function CategoriesClient() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
    const [singleId, setSingleId] = useState<string>("")
    const { addToCategory, getAllCategory, updateCategory, deleteCategory } = useCategory()
    const { data: CategoryData, isPending, error } = getAllCategory

    const { sendMessage } = useOrders()

    const handleAddSubmit = (data: AddCategoryFormData) => {
        addToCategory.mutate(data, {
            onSuccess: (res: any) => {
                toast.success(res.message);
                setIsAddModalOpen(false);
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || "Something went wrong");
            },
        });
    };

    const onEdit = (id: string, category: Category) => {
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

    const handleDelete = (id: string) => {
        if (!id) {
            toast.error("ID is required to update category");
            return;
        }

        deleteCategory.mutate(id, {
            onSuccess: (res: any) => {
                toast.success(res.message);
                setDeletingCategory(null)
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || "Something went wrong");
            },
        });
    }

    const sortedCategories = useMemo(() => {
        return [...(CategoryData || [])].reverse();
    }, [CategoryData]);

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
                    {isPending ? (
                        <CategoryLoadingSkeleton />
                    ) :
                        sortedCategories.map((category: Category, idx: number) => (
                            <motion.div
                                key={category._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className="h-full"
                            >
                                <Card className="group h-full flex flex-col p-0 overflow-hidden border-border hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                                    <CardContent className="p-0 flex flex-col h-full">
                                        {/* Category Image */}
                                        <div className="relative w-full h-48 bg-muted overflow-hidden shrink-0">
                                            <Image
                                                src={category.logo.secure_url || "/placeholder.jpg"}
                                                alt={category.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                priority={idx < 4}
                                            />
                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>

                                        {/* Category Info */}
                                        <div className="p-5 flex flex-col flex-grow">
                                            {/* Title & Product Count Section - Fixed min-height for alignment */}
                                            <div className="flex items-start justify-between min-h-[3.5rem] gap-2 mb-2">
                                                <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-tight">
                                                    {category.name}
                                                </h3>
                                                <div className="shrink-0 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-bold">
                                                    {category?.productNum || 0} Products
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                                                    Created {formatDate(category.createdAt)}
                                                </p>
                                            </div>

                                            {/* Action Buttons - Pushed to bottom */}
                                            <div className="mt-auto flex gap-2 pt-4 border-t border-border/60">
                                                <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full h-9 gap-2 font-semibold border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors"
                                                        onClick={() => onEdit(category._id, category)}
                                                    >
                                                        <Edit24Regular className="w-4 h-4" />
                                                        Edit
                                                    </Button>
                                                </motion.div>
                                                <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="w-full h-9 gap-2 font-semibold shadow-sm shadow-destructive/20"
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
                <EmptyCategory setIsAddModalOpen={setIsAddModalOpen} />
            )}

            {/* Add Category Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <Modal
                        title="Add Category"
                        onClose={() => setIsAddModalOpen(false)}
                    >
                        <CategoryForm onSubmit={handleAddSubmit} showCard={false} isLoading={addToCategory.isPending} />
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
                            id={singleId}
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
                        isLoading={deleteCategory.isPending}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
