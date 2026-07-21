import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import portalService from '@/src/https/portal/portalService'
import { AddMenuReq, AddMenuResp } from '@/src/lib/api/types/portal'

export const useMutationPortalAddMenu = (
  options?: Omit<
    UseMutationOptions<AddMenuResp, Error, AddMenuReq>,
    'mutationFn'
  >,
) => {
  return useMutation({
    mutationFn: async (req: AddMenuReq) => {
      const resp = await portalService.addMenu(req)
      return resp.data.data
    },
    ...options,
  })
}
