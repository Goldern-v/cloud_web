import cache from '@/utils/cache'
import constant from '@/utils/constant'
import { iams } from '../java/prefix'
// 文件导出
export const useLogLoginExportApi = () => {
  location.href =
    constant.apiUrl + `${iams}/sys/log/login/export?access_token=` + cache.getToken()
}
