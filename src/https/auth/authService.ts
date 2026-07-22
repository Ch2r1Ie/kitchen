import { axiosService } from '../httpsService'
import { clearAccessToken, setAccessToken } from '../tokenStore'
import { AuthenReq, AuthResponse } from '@/src/lib/api/types/auth'

class AuthService {
  register = async (data: AuthenReq) => {
    const resp = await axiosService.post<{ data: AuthResponse }>(
      '/api/auth/register',
      data,
    )
    setAccessToken(resp.data.data.accessToken)
    return resp
  }

  refresh = async () => {
    const resp = await axiosService.post<{ data: AuthResponse }>(
      '/api/auth/refresh',
    )
    setAccessToken(resp.data.data.accessToken)
    return resp
  }

  signOut = async () => {
    const resp = await axiosService.post<{ data: null }>('/api/auth/signout')
    clearAccessToken()
    return resp
  }
}

const authService = new AuthService()
export default authService
