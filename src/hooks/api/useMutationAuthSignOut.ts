import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import authService from '@/src/https/auth/authService'

export const useMutationAuthSignOut = (
  options?: Omit<UseMutationOptions<null, Error, void>, 'mutationFn'>,
) => {
  return useMutation({
    mutationFn: async () => {
      const resp = await authService.signOut()
      return resp.data.data
    },
    ...options,
  })
}
