"use client"

import { motion } from "framer-motion"

export default function DashboardLoading() {
    return (
        <div className="flex-1 p-8 space-y-8">
            {/* Header Skeleton */}
            <div className="space-y-4">
                <motion.div
                    className="h-10 bg-muted rounded-lg w-64"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                    className="h-4 bg-muted rounded w-96"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="h-32 bg-muted rounded-lg"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    />
                ))}
            </div>

            {/* Main Content Skeleton */}
            <motion.div
                className="h-96 bg-muted rounded-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />

            {/* Loading Indicator */}
            <div className="flex justify-center items-center py-8">
                <div className="flex gap-2 items-center">
                    <motion.div
                        className="w-3 h-3 bg-primary rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                    />
                    <motion.div
                        className="w-3 h-3 bg-primary rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                        className="w-3 h-3 bg-primary rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                </div>
            </div>
        </div>
    )
}
