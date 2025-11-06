"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { mockProducts } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"

type CategoryType = "Skincare" | "Lips" | "Makeup" | "Eyes" | "All"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All")

  const categories: CategoryType[] = ["All", "Skincare", "Lips", "Makeup", "Eyes"]

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return mockProducts
    }
    return mockProducts.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  const categoryStats = useMemo(() => {
    const stats = {
      All: mockProducts.length,
      Skincare: mockProducts.filter((p) => p.category === "Skincare").length,
      Lips: mockProducts.filter((p) => p.category === "Lips").length,
      Makeup: mockProducts.filter((p) => p.category === "Makeup").length,
      Eyes: mockProducts.filter((p) => p.category === "Eyes").length,
    }
    return stats
  }, [])

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-foreground">Products Inventory</h1>
        <p className="text-muted-foreground mt-2">Manage your product catalog</p>
      </motion.div>

      {/* Category Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2">
        {categories.map((category, idx) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card border border-border text-foreground hover:border-primary"
            }`}
          >
            {category}
            <span className="ml-2 text-xs">({categoryStats[category as keyof typeof categoryStats]})</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <Card className="overflow-hidden h-full hover:border-primary transition-colors">
              {/* Image */}
              <div className="relative w-full h-48 bg-muted overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {product.isSale && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold"
                  >
                    -{product.salePercentage}%
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{product.category}</p>
                  <h3 className="text-lg font-bold text-foreground mt-1 line-clamp-2">{product.name}</h3>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                {/* Pricing */}
                <div className="flex items-baseline gap-2">
                  {product.isSale ? (
                    <>
                      <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.oldPrice?.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  View Details
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found</p>
        </motion.div>
      )}
    </div>
  )
}
