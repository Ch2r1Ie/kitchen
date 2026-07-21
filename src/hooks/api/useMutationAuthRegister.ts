import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import authService from '@/src/https/auth/authService'
import { AuthenReq, AuthResponse } from '@/src/lib/api/types/auth'

export const useMutationAuthRegister = (
  options?: Omit<
    UseMutationOptions<AuthResponse, Error, AuthenReq>,
    'mutationFn'
  >,
) => {
  return useMutation({
    mutationFn: async (req: AuthenReq) => {
      const resp = await authService.register(req)
      return resp.data.data
    },
    ...options,
  })
}
