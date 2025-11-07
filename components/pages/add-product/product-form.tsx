"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { addProductSchema, type AddProductFormData } from "@/lib/validation"
import { ProductCategorySelect } from "./product-category-select"
import { ProductImageUpload } from "./product-image-upload"
import { ProductSaleToggle } from "./product-sale-toggle"
import { ProductPricingFields } from "./product-pricing-fields"

interface ProductFormProps {
  onSubmit: (data: AddProductFormData) => void
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const initialValues: AddProductFormData = {
    name: "",
    category: "Skincare",
    description: "",
    image: undefined as any,
    isSale: false,
    salePercentage: 0,
    oldPrice: 0,
    currentPrice: 0,
    price: 0,
  }

  const handleSubmit = (values: AddProductFormData, { resetForm }: any) => {
    onSubmit(values)
    resetForm()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>Fill in the details for your new product</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <Formik
          initialValues={initialValues}
          validationSchema={addProductSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-6 w-full">
            {/* Category & Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <ProductCategorySelect />
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Field
                  name="name"
                  placeholder="Enter product name"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <ErrorMessage name="name" component="div" className="text-sm text-destructive" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Field
                as="textarea"
                name="description"
                placeholder="Enter product description"
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="description" component="div" className="text-sm text-destructive" />
            </div>

            {/* Image Upload */}
            <ProductImageUpload />

            {/* Sale Toggle */}
            <ProductSaleToggle />

            {/* Pricing */}
            <ProductPricingFields />

            {/* Submit Button */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button type="submit" size="lg" className="w-full">
                Add Product
              </Button>
            </motion.div>
          </Form>
        </Formik>
      </CardContent>
    </Card>
  )
}

