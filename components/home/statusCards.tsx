"use client"
import { motion } from "framer-motion"
import { Card, CardContent } from '../ui/card'
import useStatus from '@/hooks/use-status'
import { getStatusConfig, OrderStatus } from '@/config/status-config'

interface statusProp {
  type: "history" | "dashboard"
}
export default function StatusCards({ type }: statusProp) {
  const { getStatus } = useStatus()
  const { data: statusOfCards, isLoading, error } = getStatus
  console.log(statusOfCards);
  const statusArr = type == "dashboard" ? statusOfCards :
    statusOfCards?.filter(st => st.status === "Rejected" || st.status === "Delivered")

  const statCards = statusArr ? statusArr.map(statusData => {
    const config = getStatusConfig(statusData.status)
    return {
      title: statusData.status,
      value: statusData.count,
      icon: config.icon,
      color: config.iconBgColor,
      textColor: config.iconTextColor,
    }
  }) : []

  return (
    <div className={type == "dashboard" ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6` : `grid grid-cols-1 md:grid-cols-2 gap-6`}>
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
