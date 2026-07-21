import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import portalService from '@/src/https/portal/portalService'
import { GetMenusByCategoryReq, MenuItem } from '@/src/lib/api/types/portal'

export const useQueryPortalMenusByCategory = (
  req: GetMenusByCategoryReq,
  options?: Omit<UseQueryOptions<MenuItem[], Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['portal', 'menu', 'category', req.category],
    queryFn: async () => {
      const resp = await portalService.getMenusByCategory(req)
      return resp.data.data
    },
    ...options,
  })
}
