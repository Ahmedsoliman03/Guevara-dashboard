import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export default function CategoryLoadingSkeleton() {
    return (
        <>
            {[0, 1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
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
                                    <motion.div
                                        className="h-6 bg-muted rounded w-32"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                    />
                                    <motion.div
                                        className="h-5 bg-muted rounded w-20"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                                    />
                                </div>

                                <motion.div
                                    className="h-4 bg-muted rounded w-24"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                                />

                                {/* Buttons Skeleton */}
                                <div className="flex gap-2 pt-2 border-t border-border">
                                    <motion.div
                                        className="flex-1 h-9 bg-muted rounded"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                    />
                                    <motion.div
                                        className="flex-1 h-9 bg-muted rounded"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
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
