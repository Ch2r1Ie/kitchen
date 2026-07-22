import { axiosService } from '../httpsService'
import { GetStatsResp } from '@/src/lib/api/types/website'

class WebsiteService {
  getStats = async () => {
    return axiosService.get<{ data: GetStatsResp }>('/api/website/stats')
  }
}

const websiteService = new WebsiteService()
export default websiteService
