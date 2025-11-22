"use client"
import React, { useState } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { Button } from '../ui/button'
import { LockClosed24Regular } from '@fluentui/react-icons'
import Modal from '../ui/Modal'
import UseAuth from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import * as yup from "yup"
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { PasswordInput } from '../ui/password-input'

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters and contain: uppercase letter, lowercase letter, number, and special character (@$!%*?&)"),
  confirmNewPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
})

export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>

export default function ChangPassModal() {
  const [changePass, setChangePass] = useState(false)
  const { ChangePassword } = UseAuth()
  const handleSubmit = async (values: ChangePasswordFormData, { setSubmitting, resetForm }: any) => {
    try {
      const res = await ChangePassword(values)
      toast.success(res.message);
      setChangePass(false)
      resetForm()
    }
    catch (err: any) {
      toast.error(err?.response.data.message)
    }
    setSubmitting(false)
  }
  return (
    <div className='w-full md:w-auto'>
      <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
        <Button
          className='w-full!'
          onClick={() => setChangePass(true)}
        >
          <LockClosed24Regular />
          Change Password
        </Button>
      </motion.div>
      {changePass &&
        <AnimatePresence>
          <Modal
            title='Change Password'
            onClose={() => setChangePass(false)}
          >
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">

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
                        as={PasswordInput}
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
                        as={PasswordInput}
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
                        as={PasswordInput}
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

            </motion.div>
          </Modal>
        </AnimatePresence>
      }
    </div>
  )
}
