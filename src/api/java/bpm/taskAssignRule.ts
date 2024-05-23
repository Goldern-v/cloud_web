import service from '@/utils/request'
import { bpm } from '../prefix'

export type TaskAssignVO = {
  id: number
  modelId: string
  processDefinitionId: string
  taskDefinitionKey: string
  taskDefinitionName: string
  options: string[]
  type: number
}

export const getTaskAssignRuleList = bpm + `/task-assign-rule/list`

export const createTaskAssignRule = async (data: TaskAssignVO) => {
  return service.post(bpm + `/task-assign-rule/create`, data)
}

export const updateTaskAssignRule = async (data: TaskAssignVO) => {
  return service.put(bpm + `/task-assign-rule/update`, data)
}

// 查询角色（精简)列表
export const getSimpleRoleList = async () => {
  return service.get(`/iams/sys/role/list-all-simple`)
}

// 查询部门（精简)列表
export const getSimpleDeptList = async () => {
  return service.get(`/iams/vdc/list-all-simple`)
}

// 获取岗位精简信息列表
export const getSimplePostList = async () => {
  return service.get(`/iams/sys/post/list-all-simple`)
}

// 获取用户精简信息列表
export const getSimpleUserList = async () => {
  return service.get(`/iams/sys/user/list-all-simple`)
}

// 获取用户组精简信息列表
export const getSimpleUserGroupList = async () => {
  return service.get(bpm + `/user-group/list-all-simple`)
}

export const getVdcPage = async (params: any) => {
  return service.get(`/iams/vdc/page`, { params })
}
