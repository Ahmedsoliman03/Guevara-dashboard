"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "Skincare",
    description: "",
    image: null as File | null,
    isSale: false,
    salePercentage: 0,
    oldPrice: 0,
    currentPrice: 0,
    price: 0,
  })

  const [imagePreview, setImagePreview] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Product submitted:", formData)
    alert("Product added successfully!")
    setFormData({
      name: "",
      category: "Skincare",
      description: "",
      image: null,
      isSale: false,
      salePercentage: 0,
      oldPrice: 0,
      currentPrice: 0,
      price: 0,
    })
    setImagePreview("")
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
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Fill in the details for your new product</CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {/* Category & Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground cursor-pointer hover:border-primary transition-colors"
                  >
                    <option>Skincare</option>
                    <option>Lips</option>
                    <option>Makeup</option>
                    <option>Eyes</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Product Image</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-input"
                  />
                  <label htmlFor="image-input" className="cursor-pointer w-full">
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="preview"
                          className="w-32 h-32 object-cover mx-auto rounded"
                        />
                        <p className="text-xs text-muted-foreground">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Drop image here or click</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Sale Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sale-toggle"
                  name="isSale"
                  checked={formData.isSale}
                  onChange={handleInputChange}
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor="sale-toggle" className="text-sm font-medium cursor-pointer">
                  Add Sale Price
                </label>
              </div>

              {/* Pricing */}
              <div className="space-y-4 w-full">
                {formData.isSale ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sale Percentage (%)</label>
                      <Input
                        type="number"
                        name="salePercentage"
                        min="1"
                        max="100"
                        value={formData.salePercentage}
                        onChange={handleInputChange}
                        placeholder="e.g., 25"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Original Price ($)</label>
                      <Input
                        type="number"
                        name="oldPrice"
                        min="0"
                        step="0.01"
                        value={formData.oldPrice}
                        onChange={handleInputChange}
                        placeholder="e.g., 99.99"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sale Price ($)</label>
                      <Input
                        type="number"
                        name="currentPrice"
                        min="0"
                        step="0.01"
                        value={formData.currentPrice}
                        onChange={handleInputChange}
                        placeholder="e.g., 74.99"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 w-full">
                    <label className="text-sm font-medium">Price ($)</label>
                    <Input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., 49.99"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button type="submit" size="lg" className="w-full">
                  Add Product
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
