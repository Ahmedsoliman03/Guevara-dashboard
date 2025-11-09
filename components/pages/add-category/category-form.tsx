"use client"

import { Formik, Form } from "formik"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { addCategorySchema, type AddCategoryFormData } from "@/lib/validation"
import * as yup from "yup"
import { CategoryNameField } from "./category-name-field"
import { CategoryPhotoUpload } from "./category-photo-upload"
import { CategoryNumberOfProductsField } from "./category-number-of-products-field"


interface CategoryFormProps {
  onSubmit: (data: AddCategoryFormData) => void
  initialValues?: Partial<AddCategoryFormData>
  submitButtonText?: string
  initialImage?: string
  showCard?: boolean
}

export function CategoryForm({
  onSubmit,
  initialValues: propInitialValues,
  submitButtonText = "Add Category",
  initialImage,
  showCard = true,
}: CategoryFormProps) {
  const initialValues: AddCategoryFormData = {
    name: propInitialValues?.name || "",
    numberOfProducts: propInitialValues?.numberOfProducts || 0,
    photo: propInitialValues?.photo || (undefined as any),
  }

  // Make photo optional when editing (if initialImage is provided)
  const validationSchema = initialImage
    ? yup.object({
        name: yup.string().required("Category name is required"),
        numberOfProducts: yup
          .number()
          .required("Number of products is required")
          .min(0, "Number of products cannot be negative")
          .integer("Number of products must be a whole number"),
        photo: yup.mixed<File>().optional(),
      })
    : addCategorySchema

  const handleSubmit = (values: AddCategoryFormData, { resetForm }: any) => {
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
        {/* Category Name */}
        <CategoryNameField />

        {/* Number of Products */}
        <CategoryNumberOfProductsField />

        {/* Photo Upload */}
        <CategoryPhotoUpload initialImage={initialImage} />

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
        <CardTitle>Category Information</CardTitle>
        <CardDescription>Fill in the details for your category</CardDescription>
      </CardHeader>
      <CardContent className="w-full">{formContent}</CardContent>
    </Card>
  )
}
