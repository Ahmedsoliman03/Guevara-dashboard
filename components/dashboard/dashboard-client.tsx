"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import StatusCards from "@/components/home/statusCards"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import useOrders from "@/hooks/use-orders"
import useStatus from "@/hooks/use-status"
import DashboardHeader from "./dashboard-header"
import ActiveOrders from "./active-orders"
import { Order } from "@/types"

export default function DashboardClient() {
    const router = useRouter()
    const { getAllOrders, acceptOrder, rejectOrder, confirmOrder, deleteOrder } = useOrders()
    const { data: ordersData, isLoading: isOrdersLoading, isError } = getAllOrders
    const { getStatus } = useStatus()
    const { isLoading: isStatusLoading } = getStatus

    const isLoading = isOrdersLoading || isStatusLoading

    // Filter orders to show only those that are NOT Delivered and NOT Rejected
    const activeOrders = ordersData?.filter(
        (order) => order.status !== "Delivered" && order.status !== "Rejected"
    )

    // Pagination state for active orders
    const [displayCount, setDisplayCount] = useState(10)
    const displayedActiveOrders = activeOrders?.slice(0, displayCount)

    const handleAccept = async (orderId: string) => {
        const order = ordersData?.find((o) => o._id === orderId)
        if (order) {
            await acceptOrder.mutateAsync(order)
        }
    }
    const handleDelete = async (orderId: string) => {
        const order = ordersData?.find((o) => o._id === orderId)
        if (order) {
            await deleteOrder.mutateAsync(order)
        }
    }

    const handleReject = async (orderId: string, reason?: string) => {
        const order = ordersData?.find((o) => o._id === orderId)
        if (order) {
            await rejectOrder.mutateAsync({ order, reason })
        }
    }

    const handleComplete = async (orderId: string) => {
        confirmOrder.mutate(orderId)
    }

    if (isLoading) {
        return (
            <div className="flex-1 h-full flex items-center justify-center min-h-[500px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground animate-pulse">Loading Dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 p-8 space-y-8">
            {/* Header */}
            <DashboardHeader />

            {/* Stats Grid */}
            <StatusCards type="dashboard" />

            {/* Orders Section */}
            <ActiveOrders
                orders={displayedActiveOrders}
                onAccept={handleAccept}
                onReject={handleReject}
                OnDelete={handleDelete}
                onComplete={handleComplete}
            />
            {activeOrders && activeOrders.length > displayCount && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setDisplayCount(displayCount + 10)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        See More
                    </button>
                </div>
            )}
        </div>
    )
}
