"use client"

import { useEffect } from "react"
import { useFormikContext, Field, ErrorMessage } from "formik"
import type { AddProductFormData } from "@/lib/validation"
import useCategory from "@/hooks/use-category"

export function ProductCategorySelect() {
  const { getAllCategory } = useCategory()
  const { data } = getAllCategory
  const { setFieldValue, values } = useFormikContext<AddProductFormData>()

  useEffect(() => {
    if (!values.categoryId && data && data.length > 0) {
      setFieldValue("categoryId", data[0]._id)
    }
  }, [data, values.categoryId, setFieldValue])

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Category</label>
      <Field
        as="select"
        name="categoryId"
        className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground cursor-pointer hover:border-primary transition-colors"
      >
        {data?.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </Field>
      <ErrorMessage name="categoryId" component="div" className="text-sm text-destructive" />
    </div>
  )
}

