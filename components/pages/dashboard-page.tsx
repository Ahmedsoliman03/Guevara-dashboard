"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { Order, DashboardStats } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckmarkCircle24Regular,
  DismissCircle24Regular,
  Clock24Regular,
  Alert24Regular,
  Checkmark24Regular,
  Prohibited24Regular,
} from "@fluentui/react-icons"

interface DashboardPageProps {
  orders: Order[]
  onAccept: (orderId: string) => void
  onComplete: (orderId: string) => void
  onReject: (orderId: string) => void
  onNavigateToHistory?: () => void
}

export default function DashboardPage({
  orders,
  onAccept,
  onComplete,
  onReject,
  onNavigateToHistory,
}: DashboardPageProps) {
  const router = useRouter()
  const stats = useMemo<DashboardStats>(
    () => ({
      pending: orders.filter((o) => o.status === "pending").length,
      inProgress: orders.filter((o) => o.status === "in-progress").length,
      completed: orders.filter((o) => o.status === "completed").length,
      rejected: orders.filter((o) => o.status === "rejected").length,
    }),
    [orders],
  )

  const activeOrders = orders.filter((o) => o.status === "pending" || o.status === "in-progress")

  const statCards = [
    {
      title: "Pending",
      value: stats.pending,
      icon: Alert24Regular,
      color: "bg-yellow-100 dark:bg-yellow-900",
      textColor: "text-yellow-600 dark:text-yellow-300",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock24Regular,
      color: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-600 dark:text-blue-300",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckmarkCircle24Regular,
      color: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-600 dark:text-green-300",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: Prohibited24Regular,
      color: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-600 dark:text-red-300",
    },
  ]

  return (
    <div className="flex-1 p-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to Guevara Admin Dashboard</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Orders Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Orders</CardTitle>
                <CardDescription>Manage your pending and in-progress orders</CardDescription>
              </div>
              <motion.button
                onClick={() => {
                  if (onNavigateToHistory) {
                    onNavigateToHistory()
                  } else {
                    router.push("/history")
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
              >
                View History
              </motion.button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No active orders</p>
              ) : (
                activeOrders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      order.rejected
                        ? "bg-destructive/10 border-destructive/50"
                        : order.accepted
                          ? "bg-primary/10 border-primary/50"
                          : "bg-card border-border"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Order Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-foreground">{order.code}</p>
                          <p className="text-sm text-muted-foreground">{order.createdAt.toLocaleDateString()}</p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "completed"
                              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                              : order.status === "in-progress"
                                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("-", " ")}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Customer</p>
                          <p className="font-medium text-foreground">{order.userName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Product</p>
                          <p className="font-medium text-foreground">{order.productName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium text-foreground">{order.quantity}</p>
                        </div>
                        <div className="md:col-span-1">
                          <p className="text-muted-foreground">Total Price</p>
                          <p className="font-bold text-primary">${order.totalPrice.toFixed(2)}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-muted-foreground">Address</p>
                          <p className="font-medium text-foreground text-xs">{order.address}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {order.status === "pending" && !order.rejected && (
                        <div className="flex gap-2 pt-4 justify-end">
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button size="sm" className="cursor-pointer" onClick={() => onAccept(order.id)}>
                              <CheckmarkCircle24Regular className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                          </motion.div>
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="cursor-pointer"
                              onClick={() => onReject(order.id)}
                            >
                              <DismissCircle24Regular className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </motion.div>
                        </div>
                      )}

                      {order.status === "in-progress" && !order.rejected && (
                        <div className="flex gap-2 pt-4 justify-end">
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 cursor-pointer"
                              onClick={() => onComplete(order.id)}
                            >
                              <Checkmark24Regular className="w-4 h-4 mr-2" />
                              Mark Completed
                            </Button>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
