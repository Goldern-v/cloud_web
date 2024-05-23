import service from '@/utils/request'
import { api, bill, adapter } from './prefix'

/**
 * 存储模块
 */
type Api = (typeof Api)[keyof typeof Api]
const Api = {
  CLOUD_DISK_LIST: `${api}/volume/list`, // 磁盘列表不分页
  CLOUD_DISK_PAGE: `${api}/volume/page`, // 云硬盘列表分页查询
  CLOUD_DISK_CREATE: `${api}/volume/provision`, // 云硬盘创建
  CLOUD_DISK_COMMIT: `${api}/order/commit`, // 云硬盘提交订单
  CLOUD_DISK_UNSUBSCRIBE: `${api}/volume/unsubscribe`, // 云硬盘退订
  CLOUD_DISK_DELETE: `${api}/volume/recycle`, // 云硬盘删除
  CLOUD_DISK_ATTACH: `${api}/volume/attach`, // 云硬盘挂载
  CLOUD_DISK_DETACH: `${api}/volume/detach`, // 云硬盘卸载
  CLOUD_DISK_RENAME: `${api}/volume/rename`, // 云硬盘修改名称
  CLOUD_DISK_EXPAND: `${api}/volume/resize`, // 云硬盘扩容
  CLOUD_DISK_RENEW: `${api}/volume/renew`, // 云硬盘续订
  CLOUD_DISK_RECYCLE_RECOVER: `${api}/volume/recover`, // 云硬盘回收站中恢复
  CLOUD_DISK_RECYCLE_DELETE: `${api}/volume/delete`, // 云硬盘回收站删除
  CLOUD_DISK_DETAIL: `${api}/volume/detail` // 云硬盘详情
}

// 磁盘列表不分页
export const cloudDiskListUrl = Api.CLOUD_DISK_LIST
export const cloudDiskList = (params: any) => {
  return service.get(cloudDiskListUrl, { params })
}
// 云硬盘列表分页
export const cloudDiskPageUrl = Api.CLOUD_DISK_PAGE
// 云硬盘创建
export const cloudDiskCreate = (data: any) => {
  return service.post(Api.CLOUD_DISK_CREATE, data)
}
// 云硬盘提交订单
export const cloudDiskCommit = (data: any) => {
  return service.post(Api.CLOUD_DISK_COMMIT, data)
}
// 云硬盘退订
export const cloudDiskUnsubscribeUrl = Api.CLOUD_DISK_UNSUBSCRIBE
export const cloudDiskUnsubscribe = (data: any) => {
  return service.delete(cloudDiskUnsubscribeUrl, { data })
}
// 云硬盘删除
export const cloudDiskDeleteUrl = Api.CLOUD_DISK_DELETE
export const cloudDiskDelete = (data: any) => {
  return service.put(cloudDiskDeleteUrl, data)
}
// 云硬盘挂载
export const cloudDiskAttach = (data: any) => {
  return service.post(Api.CLOUD_DISK_ATTACH, data)
}
// 云硬盘卸载
export const cloudDiskDetach = (data: any) => {
  return service.post(Api.CLOUD_DISK_DETACH, data)
}
// 云硬盘扩容 
export const cloudDiskExpand = (data: any) => {
  return service.put(Api.CLOUD_DISK_EXPAND, data)
}
// 云硬盘续订
export const cloudDiskRenew = (data: any) => {
  return service.post(Api.CLOUD_DISK_RENEW, data)
}
// 云硬盘修改名称
export const cloudDiskRename = (data: any) => {
  return service.put(Api.CLOUD_DISK_RENAME, data)
}
// 云硬盘回收站中恢复
export const cloudDiskRecycleRecover = (data: any) => {
  return service.put(Api.CLOUD_DISK_RECYCLE_RECOVER, data)
}
// 云硬盘回收站删除
export const cloudDiskRecycleDelete = (data: any) => {
  return service.put(Api.CLOUD_DISK_RECYCLE_DELETE, data)
}
// 云硬盘详情 
export const cloudDiskDetail = (params: any) => {
  return service.get(Api.CLOUD_DISK_DETAIL, { params })
}
