import service from '@/utils/request'
import { iams } from '../java/prefix'

export const usePostApi = (id: Number) => {
  return service.get(iams + `/sys/post/` + id)
}

export const usePostSubmitApi = (dataForm: any) => {
  if (dataForm.id) {
    return service.put(iams + `/sys/post`, dataForm)
  } else {
    return service.post(iams + `/sys/post`, dataForm)
  }
}

export const usePostListApi = () => {
  return service.get(iams + `/sys/post/list`)
}
