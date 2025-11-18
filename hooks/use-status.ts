"use client"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { OrderStatus } from "@/types"

const useStatus = () => {
  // Get status (no props needed, using useQuery directly)
  const getStatus = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      // TODO: Replace with actual endpoint
      const res = await api.get("/order/status-of-each-order")
      return res.data as OrderStatus[]
    },
    staleTime: 1000 * 10, // cache for 10s
  })

  return {
    getStatus,
  }
}

export default useStatus

