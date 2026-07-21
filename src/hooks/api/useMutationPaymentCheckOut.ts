import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import paymentService from '@/src/https/payment/paymentService'
import { CheckOutReq, CheckOutResp } from '@/src/lib/api/types/payment'

export const useMutationPaymentCheckOut = (
  options?: Omit<
    UseMutationOptions<CheckOutResp, Error, CheckOutReq>,
    'mutationFn'
  >,
) => {
  return useMutation({
    mutationFn: async (req: CheckOutReq) => {
      const resp = await paymentService.checkOut(req)
      return resp.data.data
    },
    ...options,
  })
}
