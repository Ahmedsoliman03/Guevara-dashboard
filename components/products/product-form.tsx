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
import { Product } from "@/types"

interface ProductFormProps {
  onSubmit: (data: AddProductFormData, id?: string) => void
  initialValues?: Partial<AddProductFormData>
  submitButtonText?: string
  initialImage?: string
  showCard?: boolean
  isLoading?: boolean
  productId?: string
}

export function ProductForm({
  onSubmit,
  initialValues: propInitialValues,
  submitButtonText = "Add Product",
  initialImage,
  showCard = true,
  isLoading = false,
  productId,
}: ProductFormProps) {
  // Define form values type to allow empty strings for numeric fields
  type ProductFormValues = {
    productEnglishName: string
    productArabicName: string
    companyName: string
    categoryId: string
    image: File | undefined
    stock: number | ""
    isSale: boolean
    discountPercent: number | ""
    originalPrice: number | ""
    finalPrice: number | ""
    price: number | ""
  }

  const initialValues: ProductFormValues = {
    productEnglishName: propInitialValues?.productEnglishName || "",
    productArabicName: propInitialValues?.productArabicName || "",
    companyName: propInitialValues?.companyName || "",
    // Handle categoryId which might be an object if passed from Product
    categoryId: typeof propInitialValues?.categoryId === 'object'
      ? (propInitialValues.categoryId as any)._id
      : propInitialValues?.categoryId || "",
    // Handle image which might be an object if passed from Product
    image: propInitialValues?.image || undefined,
    stock: propInitialValues?.stock ?? "",
    isSale: propInitialValues?.isSale || false,
    discountPercent: propInitialValues?.discountPercent ?? "",
    originalPrice: propInitialValues?.originalPrice ?? "",
    finalPrice: propInitialValues?.finalPrice ?? "",
    price: propInitialValues?.price ?? "",
  }

  // Make image optional when editing (if initialImage is provided)
  const validationSchema = initialImage
    ? yup.object({
       productEnglishName: yup.string().required("English product name is required"),
        productArabicName: yup.string().required("Arabic product name is required"),
        companyName: yup.string().required("Company name is required"),
      categoryId: yup
        .string()
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
            .min(1, "Original price must be greater than 0")
            .test("greater-than-sale-price", "Original price must be greater than sale price", function (value) {
              const { finalPrice } = this.parent
              if (value && finalPrice && value <= finalPrice) {
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
            .min(1, "Sale price must be greater than 0"),
        otherwise: (schema) => schema.notRequired(),
      }),
      price: yup.number().when("isSale", {
        is: false,
        then: (schema) =>
          schema
            .required("Price is required")
            .min(1, "Price must be greater than 0"),
        otherwise: (schema) => schema.notRequired(),
      }),
    })
    : addProductSchema

  const handleSubmit = (values: ProductFormValues, { resetForm }: any) => {
    // Sale percentage is automatically calculated in ProductPricingFields component
    // Cast values to AddProductFormData since validation ensures they are numbers
    onSubmit(values as unknown as AddProductFormData, productId)
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
      {({ isSubmitting }) => (
        <Form className="space-y-6 w-full">
          {/* Category & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <ProductCategorySelect />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Field
                name="companyName"
                placeholder="Enter Company name"
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="companyName" component="div" className="text-sm text-destructive" />
            </div>
          </div>
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
           <div className="space-y-2">
              <label className="text-sm font-medium">Product Arabic Name</label>
              <Field
                name="productArabicName"
                placeholder="Enter Arabic name"
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="productArabicName" component="div" className="text-sm text-destructive" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Product English Name</label>
              <Field
                name="productEnglishName"
                placeholder="Enter English name"
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="productEnglishName" component="div" className="text-sm text-destructive" />
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
              placeholder="Enter prod8uct count"
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
            <Button
              disabled={isLoading || isSubmitting}

              type="submit" size="lg" className="w-full">
              {isLoading || isSubmitting ? "Loading..." : submitButtonText}
            </Button>
          </motion.div>
        </Form>
      )}
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

