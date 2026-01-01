"use client"

import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search24Regular, ArrowDownload24Regular } from "@fluentui/react-icons"
import StatusCards from "@/components/home/statusCards"
import useOrders from "@/hooks/use-orders"
import OrderCard from "@/components/dashboard/order-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Order } from "@/types"
import useStatus from "@/hooks/use-status"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import toast from "react-hot-toast"

export default function HistoryClient() {
    const router = useRouter()
    const { getAllOrders } = useOrders()
    const { data: orders, isLoading: orderLoading } = getAllOrders
    const { getStatus } = useStatus()
    const { isLoading: statusLoading } = getStatus
    const [searchQuery, setSearchQuery] = useState("")
    const [displayCount, setDisplayCount] = useState(10)

    // Filter to show only completed and rejected orders
    const historyOrders = useMemo<Order[]>(() => {
        if (!orders) return []
        return orders.filter((o) => o.status === "Delivered" || o.status === "Rejected"
            || o.status === "Deleted"
        )
    }, [orders])

    const filteredOrders = useMemo<Order[]>(() => {
        return historyOrders.filter((order) =>
            order.shippingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [historyOrders, searchQuery])

    const displayedOrders = useMemo(() => {
        return [...filteredOrders].reverse().slice(0, displayCount)
    }, [filteredOrders, displayCount])

    // Helper to remove non-ASCII characters (Arabic, etc.) that break jsPDF
    const cleanText = (text: string) => {
        if (!text) return ""
        // Keep only English letters, numbers, and common symbols
        return text.replace(/[^\x00-\x7F]/g, "").replace(/\s+/g, " ").trim()
    }

    const exportToPDF = (customOrders?: Order[], fileNamePrefix: string = "order-history") => {
        const doc = new jsPDF()
        const targetOrders = customOrders || filteredOrders

        // Add title
        doc.setFontSize(22)
        doc.setTextColor(40)
        doc.text("Guevara Dashboard", 14, 22)

        doc.setFontSize(16)
        doc.text(customOrders ? "Monthly Order Report" : "Order History Report", 14, 32)

        doc.setFontSize(11)
        doc.setTextColor(100)
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 40)
        doc.text(`Total Orders: ${targetOrders.length}`, 14, 46)

        // Define columns
        const columns = [
            { header: "Order ID", dataKey: "orderId" },
            { header: "Customer", dataKey: "shippingName" },
            { header: "Date", dataKey: "date" },
            { header: "Products", dataKey: "products" },
            { header: "Status", dataKey: "status" },
            { header: "Total", dataKey: "total" }
        ]

        // Map data
        const rows = targetOrders.map(order => ({
            orderId: order.orderId,
            shippingName: cleanText(order.shippingName),
            date: new Date(order.createdAt).toLocaleDateString(),
            status: order.status,
            products: order.products.map(p => `${cleanText(p.name)} (x${p.quantity})`).join('\n'),
            total: `${order.finalPrice} EGP`
        }))

        // Generate table
        autoTable(doc, {
            columns: columns,
            body: rows,
            startY: 55,
            margin: { top: 55 },
            styles: { fontSize: 8, cellPadding: 3, valign: 'middle' },
            columnStyles: {
                products: { cellWidth: 50 },
                orderId: { cellWidth: 25 }
            },
            headStyles: {
                fillColor: [66, 66, 66],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        })

        doc.save(`guevara-${fileNamePrefix}-${new Date().toISOString().split('T')[0]}.pdf`)

        // If it was a custom export (monthly), mark it as done
        if (customOrders) {
            const now = new Date()
            const monthKey = `${now.getMonth() + 1}-${now.getFullYear()}`
            localStorage.setItem("last_monthly_report", monthKey)
        }
    }

    // Effect for automatic monthly report prompt
    useEffect(() => {
        if (orderLoading || !historyOrders.length) return

        const now = new Date()
        const currentMonthYear = `${now.getMonth() + 1}-${now.getFullYear()}`
        const lastDownloaded = localStorage.getItem("last_monthly_report")

        if (lastDownloaded !== currentMonthYear) {
            // Get last month's name
            const lastMonth = new Date()
            lastMonth.setMonth(now.getMonth() - 1)
            const monthName = lastMonth.toLocaleString('default', { month: 'long' })
            const previousMonthIndex = lastMonth.getMonth()
            const previousYear = lastMonth.getFullYear()

            // Filter orders from previous month
            const lastMonthOrders = historyOrders.filter(order => {
                const orderDate = new Date(order.createdAt)
                return orderDate.getMonth() === previousMonthIndex && orderDate.getFullYear() === previousYear
            })

            if (lastMonthOrders.length > 0) {
                toast((t) => (
                    <div className="flex flex-col gap-2">
                        <p className="font-semibold text-sm">
                            A complete report for {monthName} is available ({lastMonthOrders.length} orders)
                        </p>
                        <div className="flex gap-2 mt-1">
                            <Button
                                size="sm"
                                variant="default"
                                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => {
                                    exportToPDF(lastMonthOrders, `report-${monthName.toLowerCase()}-${previousYear}`)
                                    toast.dismiss(t.id)
                                }}
                            >
                                Download Report
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs font-medium border-slate-600 text-slate-200 hover:bg-slate-700"
                                onClick={() => {
                                    localStorage.setItem("last_monthly_report", currentMonthYear)
                                    toast.dismiss(t.id)
                                }}
                            >
                                Later
                            </Button>
                        </div>
                    </div>
                ), {
                    duration: 10000,
                    position: "bottom-right",
                    style: {
                        background: '#1f2937',
                        color: '#fff',
                        borderRadius: '12px',
                        padding: '12px',
                        border: '1px solid #374151'
                    }
                })
            }
        }
    }, [orderLoading, historyOrders])

    if (orderLoading || statusLoading) {
        return (
            <div className="flex-1 h-full flex items-center justify-center min-h-[500px]">
                <div className="flex flex-col items-center gap-4">
                    <Spinner className="h-12 w-12" />
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
                            <div className="flex items-center gap-3">
                                <motion.button
                                    onClick={() => exportToPDF()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer flex items-center gap-2"
                                    disabled={filteredOrders.length === 0}
                                >
                                    <ArrowDownload24Regular className="w-4 h-4" />
                                    Download PDF
                                </motion.button>
                                <motion.button
                                    onClick={() => router.push("/dashboard")}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                                >
                                    Back to Dashboard
                                </motion.button>
                            </div>
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
                                {displayedOrders.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        {searchQuery ? "No orders found matching your search" : "No history orders yet"}
                                    </p>
                                ) : (
                                    displayedOrders.map((order, idx) => (
                                        <OrderCard key={order._id} order={order} index={idx} />
                                    ))
                                )}
                                {filteredOrders.length > displayCount && (
                                    <div className="flex justify-center mt-4">
                                        <Button
                                            onClick={() => setDisplayCount(displayCount + 10)}
                                        >
                                            See More
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
