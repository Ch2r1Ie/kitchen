import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import authService from '@/src/https/auth/authService'
import { AuthResponse } from '@/src/lib/api/types/auth'

export const useMutationAuthRefresh = (
  options?: Omit<UseMutationOptions<AuthResponse, Error, void>, 'mutationFn'>,
) => {
  return useMutation({
    mutationFn: async () => {
      const resp = await authService.refresh()
      return resp.data.data
    },
    ...options,
  })
}
