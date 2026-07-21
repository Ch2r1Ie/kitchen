import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import scanService from '@/src/https/scan/scanService'
import { ScanQRResp } from '@/src/lib/api/types/scan'

export const useQueryScanQR = (
  restaurant: string,
  table: string,
  options?: Omit<
    UseQueryOptions<ScanQRResp, Error>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: ['scan', restaurant, table],
    queryFn: async () => {
      const resp = await scanService.scanQR(restaurant, table)
      return resp.data.data
    },
    ...options,
  })
}
