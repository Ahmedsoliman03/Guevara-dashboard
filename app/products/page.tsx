"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function ProductsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined" && !isAuthenticated()) {
      router.push("/")
    }
  }, [router])

  if (!mounted) return null

  return <DashboardLayout initialPage="products" />
}

