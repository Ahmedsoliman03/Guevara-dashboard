"use client"

import { motion } from "framer-motion"
import ChangPassModal from "@/components/home/ChangPassModal"

export default function DashboardHeader() {
    return (
        <div className="flex justify-between items-center flex-col md:flex-row gap-2 w-full">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-2">Welcome to Guevara Admin Dashboard</p>
            </motion.div>
            {/* Change Password */}
            <ChangPassModal />
        </div>
    )
}
