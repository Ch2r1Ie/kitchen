import { axiosService } from '../httpsService'
import {
  AddCategoryReq,
  AddCategoryResp,
  AddMenuReq,
  AddMenuResp,
  DeleteCategoryReq,
  DeleteMenuReq,
  GetMenusByCategoryReq,
  GetOrdersReq,
  GetSummaryReq,
  GetSummaryResp,
  MenuItem,
  OrderCard,
  UpdateMenuAvailabilityReq,
} from '@/src/lib/api/types/portal'

class PortalService {
  getOrders = async (data: GetOrdersReq) => {
    return axiosService.post<{ data: OrderCard[] }>('/api/portal/orders', data)
  }

  addCategory = async (data: AddCategoryReq) => {
    return axiosService.post<{ data: AddCategoryResp }>(
      '/api/portal/category',
      data,
    )
  }

  deleteCategory = async (data: DeleteCategoryReq) => {
    return axiosService.post<{ data: null }>(
      '/api/portal/category/delete',
      data,
    )
  }

  addMenu = async (data: AddMenuReq) => {
    return axiosService.post<{ data: AddMenuResp }>('/api/portal/menu', data)
  }

  getMenusByCategory = async (data: GetMenusByCategoryReq) => {
    return axiosService.post<{ data: MenuItem[] }>(
      '/api/portal/menu/category',
      data,
    )
  }

  updateMenuAvailability = async (data: UpdateMenuAvailabilityReq) => {
    return axiosService.post<{ data: null }>(
      '/api/portal/menu/availability',
      data,
    )
  }

  deleteMenu = async (data: DeleteMenuReq) => {
    return axiosService.post<{ data: null }>('/api/portal/menu/delete', data)
  }

  getSummary = async (data: GetSummaryReq) => {
    return axiosService.post<{ data: GetSummaryResp }>(
      '/api/portal/summary',
      data,
    )
  }
}

const portalService = new PortalService()
export default portalService
