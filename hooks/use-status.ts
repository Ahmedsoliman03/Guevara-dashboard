import axios from "axios"
import { useQuery } from "@tanstack/react-query"

const useStatus = () => {
  // Get status (no props needed, using useQuery directly)
  const getStatus = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      // TODO: Replace with actual endpoint
      const res = await axios.get("")
      return res.data
    },
    staleTime: 1000 * 10, // cache for 10s
  })

  return {
    getStatus,
  }
}

export default useStatus

