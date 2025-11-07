"use client"

import { Field, ErrorMessage } from "formik"
import { Input } from "@/components/ui/input"

export function CategoryNameField() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium">Category Name</label>
      <Field
        as={Input}
        name="name"
        placeholder="Enter category name"
        className="w-full"
      />
      <ErrorMessage name="name" component="div" className="text-sm text-destructive" />
    </div>
  )
}

