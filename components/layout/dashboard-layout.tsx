"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Sidebar from "@/components/layout/sidebar"
import DashboardPage from "@/components/pages/dashboard-page"
import AddProductPage from "@/components/pages/add-product-page"
import AddCategoryPage from "@/components/pages/add-category-page"
import ProductsPage from "@/components/pages/products-page"
import HistoryPage from "@/components/pages/history-page"
import { mockOrders } from "@/lib/mock-data"
import type { Order } from "@/types"
import { Navigation24Regular, Dismiss24Regular } from "@fluentui/react-icons"

type PageType = "dashboard" | "add-product" | "add-category" | "products" | "history"

interface DashboardLayoutProps {
  initialPage?: PageType
}

export default function DashboardLayout({ initialPage }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<PageType>(initialPage || "dashboard")
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Sync current page with pathname
    if (pathname) {
      const pageMap: Record<string, PageType> = {
        "/dashboard": "dashboard",
        "/add-product": "add-product",
        "/add-category": "add-category",
        "/products": "products",
        "/history": "history",
      }
      const page = pageMap[pathname] || "dashboard"
      setCurrentPage(page)
    }
  }, [pathname])

  const handleAccept = (orderId: string) => {
    setOrders(
      orders.map((order) => (order.id === orderId ? { ...order, status: "in-progress", accepted: true } : order)),
    )
  }

  const handleComplete = (orderId: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "completed" } : order)))
  }

  const handleReject = (orderId: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "rejected", rejected: true } : order)))
  }

  const renderPage = () => {
    switch (currentPage) {
      case "add-product":
        return <AddProductPage />
      case "add-category":
        return <AddCategoryPage />
      case "products":
        return <ProductsPage />
      case "history":
        return (
          <HistoryPage
            orders={orders}
            onNavigateToDashboard={() => {
              setCurrentPage("dashboard")
              router.push("/dashboard")
            }}
          />
        )
      default:
        return (
          <DashboardPage
            orders={orders}
            onAccept={handleAccept}
            onComplete={handleComplete}
            onReject={handleReject}
            onNavigateToHistory={() => setCurrentPage("history")}
          />
        )
    }
  }

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page)
    setSidebarOpen(false)
    const routeMap: Record<PageType, string> = {
      dashboard: "/dashboard",
      "add-product": "/add-product",
      "add-category": "/add-category",
      products: "/products",
      history: "/history",
    }
    router.push(routeMap[page])
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar - Fixed (doesn't rebuild on route changes) */}
      <div className="hidden md:block fixed left-0 top-0 h-screen z-30">
        <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
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
        <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
      </motion.div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto flex flex-col md:ml-64"
      >
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
        {renderPage()}
      </motion.main>
    </div>
  )
}
