import { axiosService } from '../httpsService'
import { CheckOutReq, CheckOutResp } from '@/src/lib/api/types/payment'

class PaymentService {
  checkOut = async (data: CheckOutReq) => {
    return axiosService.post<{ data: CheckOutResp }>('/payment/checkout', data)
  }
}

const paymentService = new PaymentService()
export default paymentService
