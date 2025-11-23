"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { motion } from "framer-motion"
import Sidebar from "@/components/layout/sidebar"
import { OrdersProvider } from "@/components/providers/orders-provider"
import { CategoriesProvider } from "@/components/providers/categories-provider"
import { ProductsProvider } from "@/components/providers/products-provider"
import { Navigation24Regular, Dismiss24Regular } from "@fluentui/react-icons"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined" && !isAuthenticated()) {
      router.push("/")
    }
  }, [router])

  if (!mounted) return null

  return (
    <OrdersProvider>
      <CategoriesProvider>
        <ProductsProvider>
          <div className="flex h-screen bg-background">
            {/* Desktop Sidebar - Fixed and persistent */}
            <div className="hidden md:block">
              <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
              />
            )}

            {/* Mobile Sidebar */}
            <motion.div
              className="fixed left-0 top-0 h-screen z-50 md:hidden"
              initial={{ x: -250 }}
              animate={{ x: sidebarOpen ? 0 : -250 }}
              transition={{ duration: 0.3 }}
            >
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </motion.div>

            {/* Main Content */}
            <main className="flex-1 overflow-auto flex flex-col md:ml-64">
              <div className="md:hidden p-4 border-b border-border bg-background flex items-center">
                <motion.button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors cursor-pointer"
                >
                  {sidebarOpen ? <Dismiss24Regular className="w-6 h-6" /> : <Navigation24Regular className="w-6 h-6" />}
                </motion.button>
              </div>
              {children}
            </main>
          </div>
        </ProductsProvider>
      </CategoriesProvider>
    </OrdersProvider>
  )
}

