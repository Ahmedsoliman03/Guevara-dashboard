"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Sidebar from "@/components/layout/sidebar"
import DashboardPage from "@/components/pages/dashboard-page"
import AddProductPage from "@/components/pages/add-product-page"
import ProductsPage from "@/components/pages/products-page"
import HistoryPage from "@/components/pages/history-page"
import { mockOrders } from "@/lib/mock-data"
import type { Order } from "@/types"
import { Menu, X } from "lucide-react"

type PageType = "dashboard" | "add-product" | "products" | "history"

export default function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      case "products":
        return <ProductsPage />
      case "history":
        return <HistoryPage orders={orders} onNavigateToDashboard={() => setCurrentPage("dashboard")} />
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
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
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
        className="flex-1 overflow-auto flex flex-col"
      >
        <div className="md:hidden p-4 border-b border-border bg-background flex items-center">
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors cursor-pointer"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
        {renderPage()}
      </motion.main>
    </div>
  )
}
