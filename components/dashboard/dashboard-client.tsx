"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useOrders } from "@/components/providers/orders-provider"
import {
    CheckmarkCircle24Regular,
    DismissCircle24Regular,
    Checkmark24Regular,
} from "@fluentui/react-icons"
import StatusCards from "@/components/home/statusCards"
import ChangPassModal from "@/components/home/ChangPassModal"

export default function DashboardClient() {
    const router = useRouter()
    const { orders, handleAccept, handleComplete, handleReject } = useOrders()

    const activeOrders = orders.filter((o) => o.status === "pending" || o.status === "in-progress")

    return (
        <div className="flex-1 p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center flex-col md:flex-row gap-2 w-full ">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Welcome to Guevara Admin Dashboard</p>
                </motion.div>
                {/* Change Password */}
                <ChangPassModal />
            </div>
            {/* Stats Grid */}
            <StatusCards type="dashboard" />

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
                                onClick={() => router.push("/history")}
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
                                        className={`p-4 rounded-lg border-2 transition-all ${order.rejected
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
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === "completed"
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
                                                    <p className="font-bold text-primary">{order.totalPrice.toFixed(2)} EGP</p>
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
                                                        <Button size="sm" className="cursor-pointer" onClick={() => handleAccept(order.id)}>
                                                            <CheckmarkCircle24Regular className="w-4 h-4 mr-2" />
                                                            Accept
                                                        </Button>
                                                    </motion.div>
                                                    <motion.div whileTap={{ scale: 0.95 }}>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="cursor-pointer"
                                                            onClick={() => handleReject(order.id)}
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
                                                            onClick={() => handleComplete(order.id)}
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
