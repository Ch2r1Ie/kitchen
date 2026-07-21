import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import scanService from '@/src/https/scan/scanService'
import { CreateOrderReq, CreateOrderResp } from '@/src/lib/api/types/scan'

export const useMutationScanCreateOrder = (
  restaurant: string,
  table: string,
  options?: Omit<
    UseMutationOptions<CreateOrderResp, Error, CreateOrderReq>,
    'mutationFn'
  >,
) => {
  return useMutation({
    mutationFn: async (req: CreateOrderReq) => {
      const resp = await scanService.createOrder(restaurant, table, req)
      return resp.data.data
    },
    ...options,
  })
}
