"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as yup from "yup"
import { motion } from "framer-motion"
import { validateCredentials, setAuthToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthCredentials } from "@/types"
import UseAuth from "@/hooks/useAuth"
import toast from "react-hot-toast"

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
})

export default function LoginPage() {
  const router = useRouter()
const {Login} = UseAuth();
  const handleSubmit = async (values: AuthCredentials, { setSubmitting, setFieldError }: any) => {
try {
    const {data} = await Login(values);
    
    if (data) {
      setAuthToken(data?.token?.accessToken);
          toast.success("Login successful");

    }
    router.push("/dashboard")
} catch (error) {
    setFieldError("general", "Invalid email or password")
    toast.error("Login failed: Invalid email or password");
}

    setSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2">
          <CardHeader className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
              <h1 className="text-4xl font-bold text-primary mb-2">Guevara</h1>
            </motion.div>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Cosmetics Management System</CardDescription>
          </CardHeader>

          <CardContent>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      placeholder="admin@guevara.com"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="email" component="div" className="text-sm text-destructive" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Field
                      as={Input}
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="password" component="div" className="text-sm text-destructive" />
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Signing in..." : "Sign In"}
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
