import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import portalService from '@/src/https/portal/portalService'
import { GetOrdersReq, OrderCard } from '@/src/lib/api/types/portal'

export const useQueryPortalOrders = (
  req: GetOrdersReq,
  options?: Omit<UseQueryOptions<OrderCard[], Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['portal', 'orders', req.page, req.pageSize],
    queryFn: async () => {
      const resp = await portalService.getOrders(req)
      return resp.data.data
    },
    ...options,
  })
}
