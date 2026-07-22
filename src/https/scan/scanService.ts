import { axiosService } from '../httpsService'
import {
  CreateOrderReq,
  CreateOrderResp,
  ScanQRResp,
} from '@/src/lib/api/types/scan'

class ScanService {
  scanQR = async (restaurant: string, table: string) => {
    return axiosService.get<{ data: ScanQRResp }>(
      `/api/scan/${restaurant}/${table}`,
    )
  }

  createOrder = async (
    restaurant: string,
    table: string,
    data: CreateOrderReq,
  ) => {
    return axiosService.post<{ data: CreateOrderResp }>(
      `/api/scan/${restaurant}/${table}/order`,
      data,
    )
  }
}

const scanService = new ScanService()
export default scanService
