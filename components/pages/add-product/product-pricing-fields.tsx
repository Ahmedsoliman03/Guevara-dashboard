"use client"

import { Field, ErrorMessage, useFormikContext } from "formik"
import type { AddProductFormData } from "@/lib/validation"

export function ProductPricingFields() {
  const { values } = useFormikContext<AddProductFormData>()
  const isSale = values.isSale

  if (isSale) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="space-y-2">
          <label className="text-sm font-medium">Sale Percentage (%)</label>
          <Field
            type="number"
            name="salePercentage"
            min="1"
            max="100"
            placeholder="e.g., 25"
            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <ErrorMessage name="salePercentage" component="div" className="text-sm text-destructive" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Original Price ($)</label>
          <Field
            type="number"
            name="oldPrice"
           
            step="0.01"
            placeholder="e.g., 99.99"
            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <ErrorMessage name="oldPrice" component="div" className="text-sm text-destructive" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Sale Price ($)</label>
          <Field
            type="number"
            name="currentPrice"
           
            step="0.01"
            placeholder="e.g., 74.99"
            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <ErrorMessage name="currentPrice" component="div" className="text-sm text-destructive" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Price ($)</label>
      <Field
        type="number"
        name="price"
       
        step="0.01"
        placeholder="e.g., 49.99"
        className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <ErrorMessage name="price" component="div" className="text-sm text-destructive" />
    </div>
  )
}

