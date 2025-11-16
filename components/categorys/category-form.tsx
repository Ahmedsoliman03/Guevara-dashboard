"use client"

import { Formik, Form } from "formik"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { addCategorySchema, type AddCategoryFormData } from "@/lib/validation"
import * as yup from "yup"
import { CategoryNameField } from "./category-name-field"
import { CategoryPhotoUpload } from "./category-photo-upload"


interface CategoryFormProps {
  onSubmit: (data: AddCategoryFormData , id?:string ) => void
  initialValues?: Partial<AddCategoryFormData>
  submitButtonText?: string
  initialImage?: string
  showCard?: boolean
  isLoading?: boolean
  id?: string
}

export function CategoryForm({
  onSubmit,
  initialValues: propInitialValues,
    isLoading,
  submitButtonText = isLoading ? "Loading..." : "Add Category",
  initialImage,
  showCard = true,
  id
}: CategoryFormProps) {
  const initialValues: AddCategoryFormData = {
    name: propInitialValues?.name || "",
    file: propInitialValues?.file || (undefined as any),
  }

  // Make photo optional when editing (if initialImage is provided)
  const validationSchema = initialImage
    ? yup.object({
        name: yup.string().required("Category name is required"),
      
        photo: yup.mixed<File>().optional(),
      })
    : addCategorySchema

  const handleSubmit = (values: AddCategoryFormData, { resetForm }: any) => {
    if(id){
      onSubmit(values , id)
      
      
    }
    else{
    onSubmit(values)
    }
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

  

        {/* Photo Upload */}
        <CategoryPhotoUpload initialImage={initialImage} />

        {/* Submit Button */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button disabled={isLoading} type="submit" size="lg" className="w-full">
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
