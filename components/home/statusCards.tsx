"use client"
import { motion } from "framer-motion"
import { Card, CardContent } from '../ui/card'
import useStatus from '@/hooks/use-status'
import { Alert24Regular, CheckmarkCircle24Regular, Clock24Regular, Prohibited24Regular } from '@fluentui/react-icons'

interface statusProp {
  type: "history" | "dashboard"
}
export default function StatusCards({ type }: statusProp) {
  const { getStatus } = useStatus()
  const { data: statusOfCards, isLoading, error } = getStatus
  const statusArr = type == "dashboard" ? statusOfCards?.filter((st) => st.status !== "canceled") :
    statusOfCards?.filter(st => st.status === "rejected" || st.status === "delivered")

  const statCards = statusArr ? type == "dashboard" ? [
    {
      title: statusArr[0].status,
      value: statusArr[0].count,
      icon: Alert24Regular,
      color: "bg-yellow-100 dark:bg-yellow-900",
      textColor: "text-yellow-600 dark:text-yellow-300",
    },
    {
      title: statusArr[1].status,
      value: statusArr[1].count,
      icon: Clock24Regular,
      color: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-600 dark:text-blue-300",
    },
    {
      title: statusArr[2].status,
      value: statusArr[2].count,
      icon: CheckmarkCircle24Regular,
      color: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-600 dark:text-green-300",
    },
    {
      title: statusArr[3].status,
      value: statusArr[3].count,
      icon: Prohibited24Regular,
      color: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-600 dark:text-red-300",
    },
  ] : [
    {
      title: statusArr[0].status,
      value: statusArr[0].count,
      icon: CheckmarkCircle24Regular,
      color: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-600 dark:text-green-300",
    },
    {
      title: statusArr[1].status,
      value: statusArr[1].count,
      icon: Prohibited24Regular,
      color: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-600 dark:text-red-300",
    },
  ] : []

  return (
    <div className={type == "dashboard" ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6` : `grid grid-cols-1 md:grid-cols-2 gap-6`}>
      {statCards.map((stat, idx) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xl text-muted-foreground font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
