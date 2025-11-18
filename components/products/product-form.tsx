"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { addProductSchema, type AddProductFormData } from "@/lib/validation"
import * as yup from "yup"
import { ProductCategorySelect } from "./product-category-select"
import { ProductImageUpload } from "./product-image-upload"
import { ProductSaleToggle } from "./product-sale-toggle"
import { ProductPricingFields } from "./product-pricing-fields"

interface ProductFormProps {
  onSubmit: (data: AddProductFormData) => void
  initialValues?: Partial<AddProductFormData>
  submitButtonText?: string
  initialImage?: string
  showCard?: boolean
}

export function ProductForm({
  onSubmit,
  initialValues: propInitialValues,
  submitButtonText = "Add Product",
  initialImage,
  showCard = true,
}: ProductFormProps) {
  const initialValues: AddProductFormData = {
    name: propInitialValues?.name || "",
    categoryId: (propInitialValues?.categoryId as any) || "Skincare",
    image: propInitialValues?.image || (undefined as any),
    stock: propInitialValues?.stock || 0,
    isSale: propInitialValues?.isSale || false,
    discountPercent: propInitialValues?.discountPercent || 0,
    originalPrice: propInitialValues?.originalPrice || 0,
    finalPrice: propInitialValues?.finalPrice || 0,
    price: propInitialValues?.price || 0,
  }

  // Make image optional when editing (if initialImage is provided)
  const validationSchema = initialImage
    ? yup.object({
        name: yup.string().required("Product name is required"),
        categoryId: yup
          .string()
          .oneOf(["Skincare", "Lips", "Makeup", "Eyes"], "Invalid category")
          .required("Category is required"),
        image: yup.mixed<File>().optional(),
        stock: yup
          .number()
          .required("Product count is required")
          .min(0, "Product count cannot be negative")
          .integer("Product count must be a whole number"),
        isSale: yup.boolean().required(),
        discountPercent: yup.number().notRequired(),
        originalPrice: yup.number().when("isSale", {
          is: true,
          then: (schema) =>
            schema
              .required("Original price is required when sale is enabled")
              .min(0.01, "Original price must be greater than 0")
              .test("greater-than-sale-price", "Original price must be greater than sale price", function (value) {
                const { currentPrice } = this.parent
                if (value && currentPrice && value <= currentPrice) {
                  return this.createError({ message: "Original price must be greater than sale price" })
                }
                return true
              }),
          otherwise: (schema) => schema.notRequired(),
        }),
        finalPrice: yup.number().when("isSale", {
          is: true,
          then: (schema) =>
            schema
              .required("Sale price is required when sale is enabled")
              .min(0.01, "Sale price must be greater than 0"),
          otherwise: (schema) => schema.notRequired(),
        }),
        price: yup.number().when("isSale", {
          is: false,
          then: (schema) =>
            schema
              .required("Price is required")
              .min(0.01, "Price must be greater than 0"),
          otherwise: (schema) => schema.notRequired(),
        }),
      })
    : addProductSchema

  const handleSubmit = (values: AddProductFormData, { resetForm }: any) => {
    // Sale percentage is automatically calculated in ProductPricingFields component
    onSubmit(values)
    if (!initialImage) {
      resetForm()
    }
  }

  const formContent = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
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

            {/* Count */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Count</label>
              <Field
                type="number"
                name="stock"
                min="0"
                step="1"
                placeholder="Enter product count"
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="stock" component="div" className="text-sm text-destructive" />
            </div>

            {/* Image Upload */}
            <ProductImageUpload initialImage={initialImage} />

            {/* Sale Toggle */}
            <ProductSaleToggle />

            {/* Pricing */}
            <ProductPricingFields />

            {/* Submit Button */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button type="submit" size="lg" className="w-full">
                {submitButtonText}
              </Button>
            </motion.div>
          </Form>
        </Formik>
  )

  if (!showCard) {
    return <div className="w-full">{formContent}</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>Fill in the details for your product</CardDescription>
      </CardHeader>
      <CardContent className="w-full">{formContent}</CardContent>
    </Card>
  )
}

