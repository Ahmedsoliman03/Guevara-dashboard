"use client"

import { useEffect } from "react"
import { useFormikContext, Field, ErrorMessage } from "formik"
import type { AddProductFormData } from "@/lib/validation"
import useCategory from "@/hooks/use-category"
import { categoriesContext } from "../providers/categories-provider"

import { CustomSelect } from "../ui/custom-select"

export function ProductCategorySelect() {
  const { getAllCategory } = useCategory()
  const { data } = getAllCategory
  const { setFieldValue, values } = useFormikContext<AddProductFormData>()
  const { setCategoryId } = categoriesContext()

  useEffect(() => {
    if (!values.categoryId && data && data.length > 0) {
      setFieldValue("categoryId", data[0]._id)
    }
    else {
      setCategoryId(values.categoryId)
    }
  }, [data, values.categoryId, setFieldValue])

  const categoryOptions = data?.map(cat => ({
    label: cat.name,
    value: cat._id
  })) || []

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Category</label>
      <CustomSelect
        value={values.categoryId}
        options={categoryOptions}
        onChange={(val) => setFieldValue("categoryId", val)}
        placeholder="Select Category"
      />
      <ErrorMessage name="categoryId" component="div" className="text-sm text-destructive" />
    </div>
  )
}

