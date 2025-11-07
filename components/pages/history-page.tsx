"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import type { Order } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckmarkCircle24Regular, DismissCircle24Regular, Search24Regular } from "@fluentui/react-icons"

interface HistoryPageProps {
  orders: Order[]
  onNavigateToDashboard?: () => void
}

export default function HistoryPage({ orders, onNavigateToDashboard }: HistoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter to show only completed and rejected orders
  const historyOrders = orders.filter((o) => o.status === "completed" || o.status === "rejected")

  const filteredOrders = historyOrders.filter((order) =>
    order.userName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = useMemo(
    () => ({
      completed: orders.filter((o) => o.status === "completed").length,
      rejected: orders.filter((o) => o.status === "rejected").length,
    }),
    [orders],
  )

  return (
    <div className="flex-1 p-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-foreground">Order History</h1>
        <p className="text-muted-foreground mt-2">View completed and rejected orders</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Completed Orders</p>
                  <p className="text-3xl font-bold mt-2">{stats.completed}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                  <CheckmarkCircle24Regular className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rejected Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Rejected Orders</p>
                  <p className="text-3xl font-bold mt-2">{stats.rejected}</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
                  <DismissCircle24Regular className="w-6 h-6 text-red-600 dark:text-red-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* History Orders Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Order History</CardTitle>
                <CardDescription>All completed and rejected orders</CardDescription>
              </div>
              <motion.button
                onClick={onNavigateToDashboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Back to Dashboard
              </motion.button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="relative">
                <Search24Regular className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {searchQuery ? "No orders found matching your search" : "No history orders yet"}
                  </p>
                ) : (
                  filteredOrders.map((order, idx) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        order.status === "rejected"
                          ? "bg-destructive/10 dark:bg-destructive/20 border-destructive/50 dark:border-destructive/40"
                          : "bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-700/50"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Order Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <p
                              className={`font-bold ${order.status === "completed" ? "text-green-700 dark:text-green-200" : "text-foreground"}`}
                            >
                              {order.code}
                            </p>
                            <p
                              className={`text-sm ${order.status === "completed" ? "text-green-600 dark:text-green-300" : "text-muted-foreground"}`}
                            >
                              {order.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "completed"
                                ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100"
                                : "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100"
                            }`}
                          >
                            {order.status === "completed" ? "Completed" : "Rejected"}
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p
                              className={`${order.status === "completed" ? "text-green-600 dark:text-green-300" : "text-muted-foreground"}`}
                            >
                              Customer
                            </p>
                            <p
                              className={`font-medium ${order.status === "completed" ? "text-green-900 dark:text-green-100" : "text-foreground"}`}
                            >
                              {order.userName}
                            </p>
                          </div>
                          <div>
                            <p
                              className={`${order.status === "completed" ? "text-green-600 dark:text-green-300" : "text-muted-foreground"}`}
                            >
                              Product
                            </p>
                            <p
                              className={`font-medium ${order.status === "completed" ? "text-green-900 dark:text-green-100" : "text-foreground"}`}
                            >
                              {order.productName}
                            </p>
                          </div>
                          <div>
                            <p
                              className={`${order.status === "completed" ? "text-green-600 dark:text-green-300" : "text-muted-foreground"}`}
                            >
                              Quantity
                            </p>
                            <p
                              className={`font-medium ${order.status === "completed" ? "text-green-900 dark:text-green-100" : "text-foreground"}`}
                            >
                              {order.quantity}
                            </p>
                          </div>
                          <div className="md:col-span-1">
                            <p
                              className={`${order.status === "completed" ? "text-green-600 dark:text-green-300" : "text-muted-foreground"}`}
                            >
                              Total Price
                            </p>
                            <p
                              className={`font-bold ${order.status === "completed" ? "text-green-700 dark:text-green-200" : "text-primary"}`}
                            >
                              ${order.totalPrice.toFixed(2)}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <p
                              className={`${order.status === "completed" ? "text-green-600 dark:text-green-300" : "text-muted-foreground"}`}
                            >
                              Address
                            </p>
                            <p
                              className={`font-medium text-xs ${order.status === "completed" ? "text-green-900 dark:text-green-100" : "text-foreground"}`}
                            >
                              {order.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
