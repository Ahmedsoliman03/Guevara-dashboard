"use client"

import { Field, ErrorMessage, useFormikContext } from "formik"
import { useEffect } from "react"
import type { AddProductFormData } from "@/lib/validation"

export function ProductPricingFields() {
  const { values, setFieldValue } = useFormikContext<AddProductFormData>()
  const isSale = values.isSale

  // Auto-calculate sale percentage when oldPrice or currentPrice changes
  useEffect(() => {
    if (isSale && values.originalPrice && values.finalPrice && values.originalPrice > 0 && values.finalPrice > 0) {
      if (values.originalPrice
         > values.finalPrice) {
        const calculatedPercentage = Math.round(((values.originalPrice
           - values.finalPrice) / values.originalPrice
      ) * 100)
        setFieldValue("discountPercent", calculatedPercentage, false)
      } else {
        setFieldValue("discountPercent", 0, false)
      }
    } else if (isSale) {
      setFieldValue("discountPercent", 0, false)
    }
  }, [isSale, values.originalPrice, values.finalPrice, setFieldValue])

  if (isSale) {
    return (
      <div className="space-y-2 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Original Price (EGP)</label>
            <Field
              type="number"
              name="originalPrice"
              min="0.01"
              step="0.01"
              placeholder="e.g., 99.99"
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <ErrorMessage name="originalPrice" component="div" className="text-sm text-destructive" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Sale Price (EGP)</label>
            <Field
              type="number"
              name="finalPrice"
              min="0.01"
              step="0.01"
              placeholder="e.g., 74.99"
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <ErrorMessage name="finalPrice" component="div" className="text-sm text-destructive" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Sale Percentage (%)</label>
            <Field
              type="number"
              name="discountPercent"
              readOnly
              disabled
              className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground cursor-not-allowed opacity-70"
            />
            <p className="text-xs text-muted-foreground">
              Auto calculated
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Price (EGP)</label>
      <Field
        type="number"
        name="price"
        min="0.01"
        step="0.01"
        placeholder="e.g., 49.99"
        className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <ErrorMessage name="price" component="div" className="text-sm text-destructive" />
    </div>
  )
}
