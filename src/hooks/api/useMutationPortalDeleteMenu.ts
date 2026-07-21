import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import portalService from '@/src/https/portal/portalService'
import { DeleteMenuReq } from '@/src/lib/api/types/portal'

export const useMutationPortalDeleteMenu = (
  options?: Omit<UseMutationOptions<null, Error, DeleteMenuReq>, 'mutationFn'>,
) => {
  return useMutation({
    mutationFn: async (req: DeleteMenuReq) => {
      const resp = await portalService.deleteMenu(req)
      return resp.data.data
    },
    ...options,
  })
}
