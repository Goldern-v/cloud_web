import service from '@/utils/request'
import { iams } from '../java/prefix'

export const useOrgListApi = () => {
  return service.get(iams + `/sys/org/list`)
}

export const useOrgApi = (id: Number) => {
  return service.get(iams + `/sys/org/` + id)
}

export const useOrgSubmitApi = (dataForm: any) => {
  if (dataForm.id) {
    return service.put(iams + `/sys/org`, dataForm)
  } else {
    return service.post(iams + `/sys/org`, dataForm)
  }
}
