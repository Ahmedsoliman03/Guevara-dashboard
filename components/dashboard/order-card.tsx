"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Modal from "@/components/ui/Modal"
import {
    CheckmarkCircle24Regular,
    DismissCircle24Regular,
    Checkmark24Regular,
} from "@fluentui/react-icons"
import { formatDate } from "@/utils/format"
import { getStatusConfig } from "@/config/status-config"
import { Order } from "@/types"

interface OrderCardProps {
    order: Order
    index: number
    onAccept?: (id: string) => Promise<void> | void
    onReject?: (id: string, reason?: string) => Promise<void> | void
    onComplete?: (id: string) => Promise<void> | void
}

export default function OrderCard({ order, index, onAccept, onReject, onComplete }: OrderCardProps) {
    const statusConfig = getStatusConfig(order.status)
    const [isAccepting, setIsAccepting] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)
    const [isCompleting, setIsCompleting] = useState(false)
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState("")

    const handleAcceptClick = async () => {
        if (!onAccept) return
        setIsAccepting(true)
        try {
            await onAccept(order._id)
        } finally {
            setIsAccepting(false)
        }
    }

    const handleRejectClick = () => {
        setIsRejectModalOpen(true)
    }

    const handleConfirmReject = async () => {
        if (!onReject) return
        setIsRejecting(true)
        try {
            await onReject(order._id, rejectReason)
            setIsRejectModalOpen(false)
            setRejectReason("")
        } finally {
            setIsRejecting(false)
        }
    }

    const handleCompleteClick = async () => {
        if (!onComplete) return
        setIsCompleting(true)
        try {
            await onComplete(order._id)
        } finally {
            setIsCompleting(false)
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`p-4 rounded-lg border-2 transition-all ${statusConfig.cardBgColor} ${statusConfig.cardBorderColor}`}
            >
                <div className="space-y-3">
                    {/* Order Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-bold text-foreground">ORD-{order.orderId}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badgeColor}`}>
                            {statusConfig.label}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-4 text-sm">
                        {/* Customer and Total Price Row */}
                        <div className="grid grid-cols-3 justify-between">
                            <div>
                                <p className="text-muted-foreground">Customer</p>
                                <p className="font-medium text-foreground">{order.shippingName}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Phone Number</p>
                                <p className="font-medium text-foreground">{order.phone}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total Price</p>
                                <p className="font-bold text-primary text-[12px] md:text-md">{order.finalPrice.toFixed(2)} EGP</p>
                            </div>

                        </div>

                        {/* Products List */}
                        <div>
                            <p className="text-muted-foreground mb-2">Products ({order.products.length})</p>
                            <div className="space-y-2">
                                {order.products.map((product, productIdx) => (
                                    <div
                                        key={productIdx}
                                        className="flex justify-between items-center p-2 rounded-md bg-muted/50"
                                    >
                                        <span className="font-medium text-foreground">{product.name}</span>
                                        <span className="text-muted-foreground">Qty: {product.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <p className="text-muted-foreground">Delivery Address</p>
                            <p className="font-medium text-foreground text-xs">{order.address}</p>
                        </div>

                        {/* Customer Rating */}
                        <div>
                            {order.userRating ? (
                                <p className="text-muted-foreground mb-1">Customer Rating</p>
                            ) : null}
                            {order.userRating ? (
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`text-lg ${star <= (order.userRating ? order.userRating : 0)
                                                ? "text-yellow-500"
                                                : "text-gray-300 dark:text-gray-600"
                                                }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                    <span className="ml-2 text-sm font-medium text-foreground">
                                        {order.userRating}/5
                                    </span>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">Not Rated Yet</p>
                            )}

                        </div>
                    </div>

                    {/* Action Buttons */}
                    {order.status === "Pending" && (
                        <div className="flex gap-2 pt-4 justify-end">
                            <motion.div whileTap={{ scale: 0.95 }}>
                                <Button
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={handleAcceptClick}
                                    disabled={isAccepting || isRejecting}
                                >
                                    {isAccepting ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                    ) : (
                                        <CheckmarkCircle24Regular className="w-4 h-4 mr-2" />
                                    )}
                                    Accept
                                </Button>
                            </motion.div>
                            <motion.div whileTap={{ scale: 0.95 }}>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="cursor-pointer"
                                    onClick={handleRejectClick}
                                    disabled={isAccepting || isRejecting}
                                >
                                    {isRejecting ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                    ) : (
                                        <DismissCircle24Regular className="w-4 h-4 mr-2" />
                                    )}
                                    Reject
                                </Button>
                            </motion.div>
                        </div>
                    )}

                    {order.status === "In Progress" && (
                        <div className="flex gap-2 pt-4 justify-end">
                            <motion.div whileTap={{ scale: 0.95 }}>
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                    onClick={handleCompleteClick}
                                    disabled={isCompleting}
                                >
                                    {isCompleting ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                    ) : (
                                        <Checkmark24Regular className="w-4 h-4 mr-2" />
                                    )}
                                    Mark Completed
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Reject Modal */}
            {isRejectModalOpen && (
                <Modal
                    title="Reject Order"
                    onClose={() => setIsRejectModalOpen(false)}
                >
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Please provide a reason for rejecting this order. This will be sent to the customer.
                        </p>
                        <textarea
                            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter rejection reason..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsRejectModalOpen(false)}
                                disabled={isRejecting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleConfirmReject}
                                disabled={!rejectReason.trim() || isRejecting}
                            >
                                {isRejecting ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                ) : null}
                                Confirm Reject
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}
