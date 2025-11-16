"use client"

import { useFormikContext, Field, ErrorMessage } from "formik"
import type { AddProductFormData } from "@/lib/validation"

export function ProductCategorySelect() {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Category</label>
      <Field
        as="select"
        name="category"
        className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground cursor-pointer hover:border-primary transition-colors"
      >
        <option value="Skincare">Skincare</option>
        <option value="Lips">Lips</option>
        <option value="Makeup">Makeup</option>
        <option value="Eyes">Eyes</option>
      </Field>
      <ErrorMessage name="category" component="div" className="text-sm text-destructive" />
    </div>
  )
}

