import service from '@/utils/request'
import cache from '@/utils/cache'
import constant from '@/utils/constant'
import { iams } from '../java/prefix'

export const useUserInfoApi = () => {
  return service.get(iams + `/sys/user/info`)
}

export const updatePasswordApi = (data: any) => {
  return service.put(iams + `/sys/user/password`, data)
}

export const useUserApi = (id: number) => {
  return service.get(iams + `/sys/user/` + id)
}

export const useUserExportApi = () => {
  location.href =
    constant.apiUrl + iams + `/sys/user/export?access_token=` + cache.getToken()
}

export const useUserSubmitApi = (dataForm: any) => {
  if (dataForm.id) {
    return service.put(iams + `/sys/user`, dataForm)
  } else {
    return service.post(iams + `/sys/user`, dataForm)
  }
}
