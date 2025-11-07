"use client"

import { Field, ErrorMessage } from "formik"
import { Input } from "@/components/ui/input"

export function CategoryNumberOfProductsField() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium ">Number of Products</label>
      <Field
        as={Input}
        type="number"
        name="numberOfProducts"
       
        step="1"
        placeholder="Enter number of products"
        className="w-full"
      />
      <ErrorMessage name="numberOfProducts" component="div" className="text-sm text-destructive" />
    </div>
  )
}

