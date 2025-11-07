"use client"

import { Formik, Form } from "formik"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { addCategorySchema, type AddCategoryFormData } from "@/lib/validation"
import { CategoryNameField } from "./category-name-field"
import { CategoryPhotoUpload } from "./category-photo-upload"
import { CategoryNumberOfProductsField } from "./category-number-of-products-field"

interface CategoryFormProps {
  onSubmit: (data: AddCategoryFormData) => void
}

export function CategoryForm({ onSubmit }: CategoryFormProps) {
  const initialValues: AddCategoryFormData = {
    name: "",
    numberOfProducts: 0,
    photo: undefined as any,
  }

  const handleSubmit = (values: AddCategoryFormData, { resetForm }: any) => {
    onSubmit(values)
    resetForm()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Category Information</CardTitle>
        <CardDescription>Fill in the details for your new category</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <Formik
          initialValues={initialValues}
          validationSchema={addCategorySchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-6 w-full">
            {/* Category Name */}
            <CategoryNameField />

            {/* Number of Products */}
            <CategoryNumberOfProductsField />

            {/* Photo Upload */}
            <CategoryPhotoUpload />

            {/* Submit Button */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button type="submit" size="lg" className="w-full">
                Add Category
              </Button>
            </motion.div>
          </Form>
        </Formik>
      </CardContent>
    </Card>
  )
}
