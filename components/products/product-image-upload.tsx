"use client"

import { useState, useEffect, useRef } from "react"
import { useFormikContext, ErrorMessage } from "formik"
import type { AddProductFormData } from "@/lib/validation"

interface ProductImageUploadProps {
  initialImage?: string
}

export function ProductImageUpload({ initialImage }: ProductImageUploadProps) {
  const { setFieldValue, values } = useFormikContext<AddProductFormData>()
  const [imagePreview, setImagePreview] = useState(initialImage || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialImage) {
      setImagePreview(initialImage)
    }
  }, [initialImage])

  // Reset image preview when form is reset (detected by checking if image field is cleared)
  useEffect(() => {
    if (!values.image && !initialImage) {
      setImagePreview("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [values.image, initialImage])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFieldValue("image", file, false)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else if (initialImage) {
      // If no file selected and we have an initial image, keep it
      setFieldValue("image", undefined, false)
      setImagePreview(initialImage)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Product Image</label>
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer w-full">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-input"
        />
        <label htmlFor="image-input" className="cursor-pointer w-full">
          {imagePreview ? (
            <div className="space-y-2">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="preview"
                className="w-32 h-32 object-cover mx-auto rounded"
              />
              <p className="text-xs text-muted-foreground">Click to change image</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium">Drop image here or click</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
            </div>
          )}
        </label>
      </div>
      <ErrorMessage name="image" component="div" className="text-sm text-destructive" />
    </div>
  )
}

