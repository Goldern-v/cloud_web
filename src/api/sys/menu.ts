import service from '@/utils/request'
import { iams } from '../java/prefix'

export const useMenuNavApi = () => {
  return service.get(iams + `/sys/menu/nav`)
}
export const useAllMenuNavApi = (params: any) => {
  return service.get(iams + `/sys/menu/list`, { params })
}
export const useAuthorityListApi = () => {
  return service.get(iams + `/sys/menu/authority`)
}

export const useMenuListApi = (type: Number) => {
  // 菜单类型 0:菜单  1:按钮  2:接口
  const menuType = type === 2 ? 2 : 0

  return service.get(iams + `/sys/menu/list?type=` + menuType)
}

export const useMenuApi = (id: Number) => {
  return service.get(iams + `/sys/menu/` + id)
}

export const useMenuSubmitApi = (dataForm: any) => {
  if (dataForm.id) {
    return service.put(iams + `/sys/menu`, dataForm)
  } else {
    return service.post(iams + `/sys/menu`, dataForm)
  }
}
