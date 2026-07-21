import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import portalService from '@/src/https/portal/portalService'
import { GetSummaryReq, GetSummaryResp } from '@/src/lib/api/types/portal'

export const useQueryPortalSummary = (
  req: GetSummaryReq,
  options?: Omit<
    UseQueryOptions<GetSummaryResp, Error>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: ['portal', 'summary', req.from, req.to],
    queryFn: async () => {
      const resp = await portalService.getSummary(req)
      return resp.data.data
    },
    ...options,
  })
}
