import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import portalService from '@/src/https/portal/portalService'
import { AddCategoryReq, AddCategoryResp } from '@/src/lib/api/types/portal'

export const useMutationPortalAddCategory = (
  options?: Omit<
    UseMutationOptions<AddCategoryResp, Error, AddCategoryReq>,
    'mutationFn'
  >,
) => {
  return useMutation({
    mutationFn: async (req: AddCategoryReq) => {
      const resp = await portalService.addCategory(req)
      return resp.data.data
    },
    ...options,
  })
}
