"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import { motion } from "framer-motion"
import * as yup from "yup"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UseAuth from "@/hooks/useAuth"
import toast from "react-hot-toast"

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmNewPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
})

export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>

export default function ChangePasswordPage() {
  const {ChangePassword} = UseAuth()
  const handleSubmit = async (values: ChangePasswordFormData, { setSubmitting, resetForm }: any) => {
try{
      const res = await ChangePassword(values)
      toast.success(res.message);
      
resetForm()
}
catch(err){
  toast.error("Somthing went wrong please check your current password")
}
    setSubmitting(false)
  }

  return (
    <div className="p-8 space-y-8 w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-foreground">Change Password</h1>
        <p className="text-muted-foreground mt-2">Update your account password</p>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Password Information</CardTitle>
            <CardDescription>Enter your current password and choose a new one</CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <Formik
              initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              }}
              validationSchema={changePasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6 w-full">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <Field
                      as={Input}
                      type="password"
                      name="currentPassword"
                      placeholder="Enter current password"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="currentPassword" component="div" className="text-sm text-destructive" />
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Field
                      as={Input}
                      type="password"
                      name="newPassword"
                      placeholder="Enter new password"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="newPassword" component="div" className="text-sm text-destructive" />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Field
                      as={Input}
                      type="password"
                      name="confirmNewPassword"
                      placeholder="Confirm new password"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="confirmNewPassword" component="div" className="text-sm text-destructive" />
                  </div>

                  {/* Submit Button */}
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Changing Password..." : "Change Password"}
                    </Button>
                  </motion.div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

