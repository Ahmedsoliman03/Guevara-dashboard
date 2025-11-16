"use client"

import { Field } from "formik"
import type { AddProductFormData } from "@/lib/validation"

export function ProductSaleToggle() {
  return (
    <div className="flex items-center gap-3">
      <Field
        type="checkbox"
        name="isSale"
        id="sale-toggle"
        className="w-5 h-5 cursor-pointer"
      />
      <label htmlFor="sale-toggle" className="text-sm font-medium cursor-pointer">
        Add Sale Price
      </label>
    </div>
  )
}

