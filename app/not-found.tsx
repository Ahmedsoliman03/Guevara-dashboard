"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home24Regular, ArrowLeft24Regular } from "@fluentui/react-icons"

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6 max-w-md"
            >
                {/* 404 Number */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                    <h1 className="text-9xl font-bold text-primary">404</h1>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                >
                    <h2 className="text-3xl font-bold text-foreground">Page Not Found</h2>
                    <p className="text-muted-foreground">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                </motion.div>

                {/* Illustration or Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="py-8"
                >
                    <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <Home24Regular className="w-16 h-16 text-primary" />
                    </div>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={() => router.push("/dashboard")}
                            size="lg"
                            className="gap-2 w-full sm:w-auto"
                        >
                            <Home24Regular className="w-5 h-5" />
                            Go to Dashboard
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            size="lg"
                            className="gap-2 w-full sm:w-auto"
                        >
                            <ArrowLeft24Regular className="w-5 h-5" />
                            Go Back
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Additional Help Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-sm text-muted-foreground pt-4"
                >
                    If you believe this is an error, please contact support.
                </motion.p>
            </motion.div>
        </div>
    )
}
