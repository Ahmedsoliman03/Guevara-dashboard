"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import OrderCard from "./order-card"
import { Order } from "@/types"

interface ActiveOrdersProps {
    orders: Order[] | undefined
    onAccept: (id: string) => Promise<void> | void
    onReject: (id: string, reason?: string) => Promise<void> | void
    onComplete: (id: string) => Promise<void> | void
    OnDelete: (id: string) => Promise<void> | void
}

export default function ActiveOrders({ orders, onAccept, onReject, onComplete, OnDelete }: ActiveOrdersProps) {
    const router = useRouter()

    return (
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
                        {!orders?.length ? (
                            <p className="text-center text-muted-foreground py-8">No active orders</p>
                        ) : (
                            orders.map((order, idx) => (
                                <OrderCard
                                    key={order._id}
                                    order={order}
                                    index={idx}
                                    onAccept={onAccept}
                                    onReject={onReject}
                                    onDelete={OnDelete}
                                    onComplete={onComplete}
                                />
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
