import * as yup from "yup"

export const addProductSchema = yup.object({
  name: yup.string().required("Product name is required"),
  category: yup
    .string()
    .oneOf(["Skincare", "Lips", "Makeup", "Eyes"], "Invalid category")
    .required("Category is required"),
  image: yup
    .mixed<File>()
    .required("Product image is required")
    .test("fileSize", "Image size must be less than 5MB", (value) => {
      if (!value || !(value instanceof File)) return false
      return value.size <= 5 * 1024 * 1024
    })
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value || !(value instanceof File)) return false
      return value.type.startsWith("image/")
    }),
  count: yup
    .number()
    .required("Product count is required")
    .min(0, "Product count cannot be negative")
    .integer("Product count must be a whole number"),
  isSale: yup.boolean().required(),
  salePercentage: yup.number().notRequired(), // Auto-calculated, not user input
  oldPrice: yup.number().when("isSale", {
    is: true,
    then: (schema) =>
      schema
        .required("Original price is required when sale is enabled")
        .min(0.01, "Original price must be greater than 0")
        .test("greater-than-sale-price", "Original price must be greater than sale price", function (value) {
          const { currentPrice } = this.parent
          if (value && currentPrice && value <= currentPrice) {
            return this.createError({ message: "Original price must be greater than sale price" })
          }
          return true
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  currentPrice: yup.number().when("isSale", {
    is: true,
    then: (schema) =>
      schema
        .required("Sale price is required when sale is enabled")
        .min(0.01, "Sale price must be greater than 0"),
    otherwise: (schema) => schema.notRequired(),
  }),
  price: yup.number().when("isSale", {
    is: false,
    then: (schema) =>
      schema
        .required("Price is required")
        .min(0.01, "Price must be greater than 0"),
    otherwise: (schema) => schema.notRequired(),
  }),
})

export type AddProductFormData = yup.InferType<typeof addProductSchema>

export const addCategorySchema = yup.object({
  name: yup.string().required("Category name is required"),
 
  file: yup
    .mixed<File>()
    .required("Category photo is required")
    .test("fileSize", "Image size must be less than 5MB", (value) => {
      if (!value || !(value instanceof File)) return false
      return value.size <= 5 * 1024 * 1024
    })
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value || !(value instanceof File)) return false
      return value.type.startsWith("image/")
    }),
})

export type AddCategoryFormData = yup.InferType<typeof addCategorySchema>

