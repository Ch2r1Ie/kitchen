import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import portalService from '@/src/https/portal/portalService'
import { UpdateMenuAvailabilityReq } from '@/src/lib/api/types/portal'

export const useMutationPortalUpdateMenuAvailability = (
  options?: Omit<
    UseMutationOptions<null, Error, UpdateMenuAvailabilityReq>,
    'mutationFn'
  >,
) => {
  return useMutation({
    mutationFn: async (req: UpdateMenuAvailabilityReq) => {
      const resp = await portalService.updateMenuAvailability(req)
      return resp.data.data
    },
    ...options,
  })
}
