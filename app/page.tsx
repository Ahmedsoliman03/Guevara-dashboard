// app/page.tsx - updated
"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import LoginPage from "@/pages/login-page"

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Don't redirect if we're on auth pages
    if (typeof window !== "undefined" && 
        isAuthenticated() && 
        !pathname?.includes("/auth/")) {
      router.push("/dashboard")
    }
  }, [router, pathname])

  if (!mounted) return null

  // You might want to create a separate layout for auth pages
  return <LoginPage />
}