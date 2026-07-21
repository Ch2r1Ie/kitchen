import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import portalService from '@/src/https/portal/portalService'
import { DeleteCategoryReq } from '@/src/lib/api/types/portal'

export const useMutationPortalDeleteCategory = (
  options?: Omit<
    UseMutationOptions<null, Error, DeleteCategoryReq>,
    'mutationFn'
  >,
) => {
  return useMutation({
    mutationFn: async (req: DeleteCategoryReq) => {
      const resp = await portalService.deleteCategory(req)
      return resp.data.data
    },
    ...options,
  })
}
