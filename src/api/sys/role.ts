import service from '@/utils/request'
import { iams } from '../java/prefix'

export const useRoleMenuApi = () => {
  return service.get(iams + `/sys/role/menu`)
}

export const useRoleApi = (id: number) => {
  return service.get(iams + `/sys/role/` + id)
}

export const useRoleListApi = () => {
  return service.get(iams + `/sys/role/list`)
}

export const useRoleSubmitApi = (dataForm: any) => {
  if (dataForm.id) {
    return service.put(iams + `/sys/role`, dataForm)
  } else {
    return service.post(iams + `/sys/role`, dataForm)
  }
}

export const useRoleDataScopeSubmitApi = (dataForm: any) => {
  return service.put(iams + `/sys/role/data-scope`, dataForm)
}

export const useRoleUserSubmitApi = (roleId: number, dataForm: any) => {
  return service.post(iams + `/sys/role/user/` + roleId, dataForm)
}
