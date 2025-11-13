"use client"

import { useState, useEffect } from "react"
import { useFormikContext, ErrorMessage } from "formik"
import type { AddCategoryFormData } from "@/lib/validation"

interface CategoryPhotoUploadProps {
  initialImage?: string
}

export function CategoryPhotoUpload({ initialImage }: CategoryPhotoUploadProps) {
  const { setFieldValue, values } = useFormikContext<AddCategoryFormData>()
  const [imagePreview, setImagePreview] = useState(initialImage || "")

  useEffect(() => {
    if (initialImage && !imagePreview) {
      setImagePreview(initialImage)
    }
  }, [initialImage])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFieldValue("file", file, false)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else if (initialImage) {
      // If no file selected and we have an initial image, keep it
      setFieldValue("file", undefined, false)
      setImagePreview(initialImage)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Category Photo</label>
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer w-full">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="category-photo-input"
        />
        <label htmlFor="category-photo-input" className="cursor-pointer w-full">
          {imagePreview ? (
            <div className="space-y-2">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="preview"
                className="w-32 h-32 object-cover mx-auto rounded"
              />
              <p className="text-xs text-muted-foreground">Click to change photo</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium">Drop photo here or click</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
            </div>
          )}
        </label>
      </div>
      <ErrorMessage name="file" component="div" className="text-sm text-destructive" />
    </div>
  )
}

