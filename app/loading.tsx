"use client"

import { motion } from "framer-motion"

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
            <div className="text-center space-y-8">
                {/* Logo/Brand */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                >
                    <h1 className="text-6xl font-bold text-primary mb-2">Guevara</h1>
                    <p className="text-muted-foreground text-sm">Admin Dashboard</p>
                </motion.div>

                {/* Animated Spinner */}
                <div className="relative w-24 h-24 mx-auto">
                    {/* Outer Ring */}
                    <motion.div
                        className="absolute inset-0 border-4 border-primary/20 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Spinning Ring */}
                    <motion.div
                        className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Center Dot */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <div className="w-3 h-3 bg-primary rounded-full" />
                    </motion.div>
                </div>

                {/* Loading Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-muted-foreground text-sm">Loading your dashboard...</p>

                    {/* Animated Dots */}
                    <div className="flex justify-center gap-1 mt-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 bg-primary rounded-full"
                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
