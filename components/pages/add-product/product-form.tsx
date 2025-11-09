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
    category: (propInitialValues?.category as any) || "Skincare",
    description: propInitialValues?.description || "",
    image: propInitialValues?.image || (undefined as any),
    isSale: propInitialValues?.isSale || false,
    salePercentage: propInitialValues?.salePercentage || 0,
    oldPrice: propInitialValues?.oldPrice || 0,
    currentPrice: propInitialValues?.currentPrice || 0,
    price: propInitialValues?.price || 0,
  }

  // Make image optional when editing (if initialImage is provided)
  const validationSchema = initialImage
    ? yup.object({
        name: yup.string().required("Product name is required"),
        category: yup
          .string()
          .oneOf(["Skincare", "Lips", "Makeup", "Eyes"], "Invalid category")
          .required("Category is required"),
        description: yup.string().required("Description is required"),
        image: yup.mixed<File>().optional(),
        isSale: yup.boolean().required(),
        salePercentage: yup.number().when("isSale", {
          is: true,
          then: (schema) =>
            schema
              .required("Sale percentage is required when sale is enabled")
              .min(1, "Sale percentage must be at least 1%")
              .max(100, "Sale percentage cannot exceed 100%"),
          otherwise: (schema) => schema.notRequired(),
        }),
        oldPrice: yup.number().when("isSale", {
          is: true,
          then: (schema) =>
            schema
              .required("Original price is required when sale is enabled")
              .min(0.01, "Original price must be greater than 0"),
          otherwise: (schema) => schema.notRequired(),
        }),
        currentPrice: yup.number().when("isSale", {
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

