"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import LoginPage from "@/components/pages/login-page"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check auth status
  const authenticated = typeof window !== "undefined" && isAuthenticated()

  if (!mounted) return null

  return <>{authenticated ? <DashboardLayout /> : <LoginPage />}</>
}
