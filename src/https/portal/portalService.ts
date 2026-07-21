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
    return axiosService.post<{ data: OrderCard[] }>('/portal/orders', data)
  }

  addCategory = async (data: AddCategoryReq) => {
    return axiosService.post<{ data: AddCategoryResp }>('/portal/category', data)
  }

  deleteCategory = async (data: DeleteCategoryReq) => {
    return axiosService.post<{ data: null }>('/portal/category/delete', data)
  }

  addMenu = async (data: AddMenuReq) => {
    return axiosService.post<{ data: AddMenuResp }>('/portal/menu', data)
  }

  getMenusByCategory = async (data: GetMenusByCategoryReq) => {
    return axiosService.post<{ data: MenuItem[] }>('/portal/menu/category', data)
  }

  updateMenuAvailability = async (data: UpdateMenuAvailabilityReq) => {
    return axiosService.post<{ data: null }>('/portal/menu/availability', data)
  }

  deleteMenu = async (data: DeleteMenuReq) => {
    return axiosService.post<{ data: null }>('/portal/menu/delete', data)
  }

  getSummary = async (data: GetSummaryReq) => {
    return axiosService.post<{ data: GetSummaryResp }>('/portal/summary', data)
  }
}

const portalService = new PortalService()
export default portalService
