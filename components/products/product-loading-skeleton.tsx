import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export default function ProductLoadingSkeleton() {
    return (
        <>
            {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <Card className="h-full py-0">
                        <CardContent className="p-0">
                            {/* Image Skeleton */}
                            <motion.div
                                className="w-full h-48 bg-muted rounded-t-lg"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />

                            {/* Content Skeleton */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-2">
                                        {/* Category */}
                                        <motion.div
                                            className="h-3 bg-muted rounded w-16"
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                        />
                                        {/* Name */}
                                        <motion.div
                                            className="h-5 bg-muted rounded w-3/4"
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                                        />
                                    </div>
                                    {/* Icon */}
                                    <motion.div
                                        className="h-5 w-5 bg-muted rounded"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                                    />
                                </div>

                                {/* Pricing */}
                                <div className="flex items-baseline gap-2">
                                    <motion.div
                                        className="h-6 bg-muted rounded w-24"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                                    />
                                </div>

                                {/* Date */}
                                <motion.div
                                    className="h-3 bg-muted rounded w-32"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                />

                                {/* Buttons Skeleton */}
                                <div className="flex gap-2 pt-2 border-t border-border">
                                    <motion.div
                                        className="flex-1 h-8 bg-muted rounded"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                                    />
                                    <motion.div
                                        className="flex-1 h-8 bg-muted rounded"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </>
    )
}
