import service from '@/utils/request'
import { iams } from '../java/prefix'

export const useDictTypeAllApi = () => {
  return service.get(iams + `/sys/dict/type/all`)
}

export const useDictTypeApi = (id: Number) => {
  return service.get(iams + `/sys/dict/type/` + id)
}

export const useDictTypeSubmitApi = (dataForm: any) => {
  if (dataForm.id) {
    return service.put(iams + `/sys/dict/type`, dataForm)
  } else {
    return service.post(iams + `/sys/dict/type`, dataForm)
  }
}

export const useDictDataApi = (id: Number) => {
  return service.get(iams + `/sys/dict/data/` + id)
}

export const useDictDataSubmitApi = (dataForm: any) => {
  if (dataForm.id) {
    return service.put(iams + `/sys/dict/data`, dataForm)
  } else {
    return service.post(iams + `/sys/dict/data`, dataForm)
  }
}
