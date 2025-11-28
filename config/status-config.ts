import {
    Alert24Regular,
    Clock24Regular,
    CheckmarkCircle24Regular,
    CalendarCancel24Color,
    Prohibited24Regular,
} from "@fluentui/react-icons"

export type OrderStatus = "In Progress" | "Delivered" | "Rejected" | "Canceled" | "Pending" | "Deleted"

export interface StatusConfig {
    label: string
    icon: React.ComponentType<{ className?: string }>
    badgeColor: string
    cardBgColor: string
    cardBorderColor: string
    iconBgColor: string
    iconTextColor: string
}

export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
    "Pending": {
        label: "Pending",
        icon: Alert24Regular,
        badgeColor: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
        cardBgColor: "bg-card",
        cardBorderColor: "border-border",
        iconBgColor: "bg-yellow-100 dark:bg-yellow-900",
        iconTextColor: "text-yellow-600 dark:text-yellow-300",
    },
    "In Progress": {
        label: "In Progress",
        icon: Clock24Regular,
        badgeColor: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
        cardBgColor: "bg-primary/10",
        cardBorderColor: "border-primary/50",
        iconBgColor: "bg-blue-100 dark:bg-blue-900",
        iconTextColor: "text-blue-600 dark:text-blue-300",
    },
    "Delivered": {
        label: "Delivered",
        icon: CheckmarkCircle24Regular,
        badgeColor: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
        cardBgColor: "bg-green-50 dark:bg-green-950",
        cardBorderColor: "border-green-200 dark:border-green-800",
        iconBgColor: "bg-green-100 dark:bg-green-900",
        iconTextColor: "text-green-600 dark:text-green-300",
    },
    "Rejected": {
        label: "Rejected",
        icon: Prohibited24Regular,
        badgeColor: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
        cardBgColor: "bg-destructive/10",
        cardBorderColor: "border-destructive/50",
        iconBgColor: "bg-red-100 dark:bg-red-900",
        iconTextColor: "text-red-600 dark:text-red-300",
    },
    "Canceled": {
        label: "Canceled",
        icon: CalendarCancel24Color,
        badgeColor: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
        cardBgColor: "bg-gray-50 dark:bg-gray-950",
        cardBorderColor: "border-gray-200 dark:border-gray-800",
        iconBgColor: "bg-gray-100 dark:bg-gray-800",
        iconTextColor: "text-gray-600 dark:text-gray-300",
    },
    "Deleted": {
        label: "Deleted",
        icon: CalendarCancel24Color,
        badgeColor: "bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-white",
        cardBgColor: "bg-yellow-50 dark:bg-yellow-950",
        cardBorderColor: "border-yellow-200 dark:border-yellow-800",
        iconBgColor: "bg-yellow-100 dark:bg-yellow-800",
        iconTextColor: "text-yellow-600 dark:text-yellow-300",
    }
}

// Helper function to get status config
export function getStatusConfig(status: string): StatusConfig {
    // Normalize status string to match our keys
    const normalizedStatus = status as OrderStatus
    return STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG["Pending"]
}

// Helper function to get all statuses
export function getAllStatuses(): OrderStatus[] {
    return Object.keys(STATUS_CONFIG) as OrderStatus[]
}
