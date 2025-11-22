"use client"

import { useState, useEffect } from "react"
import Modal from "@/components/ui/Modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import UseAuth from "@/hooks/useAuth"
import toast from "react-hot-toast"
import * as yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik"

interface ForgotPasswordModalProps {
    isOpen: boolean
    onClose: () => void
}

const emailSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
})

const resetSchema = yup.object({
    otp: yup.string().required("OTP is required").matches(/^[0-9]{6}$/, "OTP must be 6 digits"),
    newPassword: yup.string().required("Password is required")
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters and contain: uppercase letter, lowercase letter, number, and special character (@$!%*?&)")
})

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const [step, setStep] = useState<1 | 2>(1)
    const [email, setEmail] = useState("")
    const { ForgotPassword, ResetPassword } = UseAuth()

    useEffect(() => {
        if (isOpen) {
            setStep(1)
        }
    }, [isOpen])

    const handleEmailSubmit = async (values: { email: string }, { setSubmitting }: any) => {

        try {
            const req = await ForgotPassword(values.email)
            setEmail(values.email)
            setStep(2)
            toast.success(req.message)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send OTP")
        } finally {
            setSubmitting(false)
        }
    }

    const handleResetSubmit = async (values: { otp: string, newPassword: string }, { setSubmitting }: any) => {
        try {
            await ResetPassword({ email, otp: values.otp, newPassword: values.newPassword })
            toast.success("Password reset successfully")
            onClose()
            setStep(1)
        } catch (error: any) {
            console.log(error);

            toast.error(error.response?.data?.message || "Failed to reset password")
        } finally {
            setSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <Modal title={step === 1 ? "Forgot Password" : "Reset Password"} onClose={onClose}>
            {step === 1 ? (
                <Formik
                    initialValues={{ email: "" }}
                    validationSchema={emailSchema}
                    onSubmit={handleEmailSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Field name="email">
                                    {({ field }: any) => (
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="Enter your email"
                                            disabled={isSubmitting}
                                            value={field.value || ""}
                                        />
                                    )}
                                </Field>
                                <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send OTP"}
                            </Button>
                        </Form>
                    )}
                </Formik>
            ) : (
                <Formik
                    initialValues={{ otp: "", newPassword: "" }}
                    validationSchema={resetSchema}
                    onSubmit={handleResetSubmit}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className="space-y-4" autoComplete="off">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">OTP</label>
                                <Field name="otp">
                                    {({ field }: any) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            autoComplete="one-time-code"
                                            placeholder="Enter OTP"
                                            disabled={isSubmitting}
                                            value={field.value || ""}
                                        />
                                    )}
                                </Field>
                                {touched.otp && errors.otp && (
                                    <div className="text-sm text-red-500">{errors.otp}</div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">New Password</label>
                                <Field name="newPassword">
                                    {({ field }: any) => (
                                        <PasswordInput
                                            {...field}
                                            autoComplete="new-password"
                                            placeholder="Enter new password"
                                            disabled={isSubmitting}
                                            value={field.value || ""}
                                        />
                                    )}
                                </Field>
                                {touched.newPassword && errors.newPassword && (
                                    <div className="text-sm text-red-500">{errors.newPassword}</div>
                                )}
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Reset Password.." : "Confirm"}
                            </Button>
                        </Form>
                    )}
                </Formik>
            )}
        </Modal>
    )
}
