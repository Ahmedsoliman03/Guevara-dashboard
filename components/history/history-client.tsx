"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search24Regular } from "@fluentui/react-icons"
import StatusCards from "@/components/home/statusCards"
import useOrders from "@/hooks/use-orders"
import OrderCard from "@/components/dashboard/order-card"

export default function HistoryClient() {
    const router = useRouter()
    const { getAllOrders } = useOrders()
    const { data: orders, isLoading } = getAllOrders
    const [searchQuery, setSearchQuery] = useState("")

    // Filter to show only completed and rejected orders
    const historyOrders = useMemo(() => {
        if (!orders) return []
        return orders.filter((o) => o.status === "Delivered" || o.status === "Rejected")
    }, [orders])

    const filteredOrders = useMemo(() => {
        return historyOrders.filter((order) =>
            order.shippingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [historyOrders, searchQuery])

    if (isLoading) {
        return (
            <div className="flex-1 h-full flex items-center justify-center min-h-[500px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground animate-pulse">Loading History...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 p-8 space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold text-foreground">Order History</h1>
                <p className="text-muted-foreground mt-2">View completed and rejected orders</p>
            </motion.div>

            {/* Stats Grid */}
            <StatusCards type="history" />

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
                                onClick={() => router.push("/dashboard")}
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
                                    placeholder="Search by customer name or order ID..."
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
                                        <OrderCard
                                            key={order._id}
                                            order={order}
                                            index={idx}
                                        />
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
