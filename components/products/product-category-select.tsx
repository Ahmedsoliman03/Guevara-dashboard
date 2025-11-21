"use client"

import { useFormikContext, Field, ErrorMessage } from "formik"
import type { AddProductFormData } from "@/lib/validation"
import useCategory from "@/hooks/use-category"
import { categoriesContext } from "../providers/categories-provider"

export function ProductCategorySelect() {
  const { getAllCategory } = useCategory()
  const { setCategoryId } = categoriesContext()
  const { data } = getAllCategory
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Category</label>
      <Field
        as="select"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setCategoryId
            (e.target.value)
        }}
        name="category"
        className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground cursor-pointer hover:border-primary transition-colors"
      >
        {data?.map((category) => {
          return (
            <option key={category._id} value={category._id}
            >{category.name}</option>
          )
        })}

      </Field>
      <ErrorMessage name="category" component="div" className="text-sm text-destructive" />
    </div>
  )
}

