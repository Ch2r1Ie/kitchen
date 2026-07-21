import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import websiteService from '@/src/https/website/websiteService'
import { GetStatsResp } from '@/src/lib/api/types/website'

export const useQueryWebsiteStats = (
  options?: Omit<UseQueryOptions<GetStatsResp, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['website', 'stats'],
    queryFn: async () => {
      const resp = await websiteService.getStats()
      return resp.data.data
    },
    ...options,
  })
}
