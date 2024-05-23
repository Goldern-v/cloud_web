import service from '@/utils/request'
import { api, adapter, iams, bill, bpm, info, radar } from './prefix'
/**
 * 公共接口
 */
type Api = (typeof Api)[keyof typeof Api]
const Api = {
  RESOURCE_POOL_LIST: `${api}/infrastructure/resource/bundle/toggle/info`, // 资源池
  CURRENCY_LIST: `${api}/infrastructure/cloud/account/currency`, // 货币单位
  CLOUD_ENTRANCE: `${api}/infrastructure/cloud/account/list`, // 云平台入口
  CLOUD_REGION: `${api}/infrastructure/sync/region/list`, // 云平台区域
  CLOUD_PLATFORM_TYPE: `${api}/infrastructure/platform/cloud/account/nav/`, // 云平台类型
  VDC_TREE_LIST: `${iams}/vdc/grade`, // VDC(树形图)
  AVAILABLE_AREA: `${api}/infrastructure/sync/zone/list`, // 可用区
  PROJECT_INFORMATION: `${iams}/vdc/project/user/project`, // 项目信息
  PROJECT_INFORMATION_ORIGIN: `${adapter}/project/list`, // 底层项目信息
  PRICE_INQUIRY: `${bill}/prices/inquiry`, // 询价接口
  CHECK_IP_ADDRESS: `${api}/instance/check/ipaddress`, // 校验IPv4地址是否可用
  VOLUME_TYPE: `${api}/volume/type`, // 磁盘类型
  VDC_QUOTA: `${api}/vdc/quota`, // 查询vdc配额
  CLOUD_RESOURCE: `${api}/servicecategory/resource/items`, // 资源页面-选择资源池下拉框
  VDC_APPROVAL_PROCESS: `${bpm}/feign/config/vdc/vdcRelationProcess`, //获取vdc对应审批流程
  UPLOAD_BASE64DATA: `${api}/upload/base64Data`, // 上传base64Data格式图片
  RESOURCE_POOL_GRADE: `${api}/resource/pool/grade`, // 资源池、云类型、云类别的三级列表
  REGION_LIST: `${api}/region`, // 查询云平台的区域列表
  REGION_AZ_LIST: `${api}/region/az`, // 查询云平台或资源池的区域和可用区的分级列表
  RESOURCE_GROUP_LIST: `${api}/resource/group/project/list`, // 查询项目绑定的资源组列表
  RESOURCE_GROUP_PROJECT: `${api}/resource/group/project`, // 查询绑定的资源组信息 (包含项目信息)
  EVENT_PROGRESS_PAGE: `${api}/eventlog/page`, // 事件任务进度分页列表
  EVENT_PROGRESS_DETAIL: `${api}/eventlog/detail`, // 事件任务进度详情
  MESSAGE_LIST: `${info}/message/list`, // 导航栏-消息列表
  RESOURCE_POOL_REGION_LIST: `${api}/resource/pool/region`, // 查询资源池的区域列表
  RESOURCE_POOL_TYPE_LIST: `${api}/resource/pool/resource/category`, // 资源类型列表(列: ECS云主机 EBS云硬盘)
  PLATFORM_CATEGORY_TYPE: `${api}/platform/category/type` // 云平台类别、云平台类型
}
// 资源池
export const queryResourcePool = () => {
  return service.get(Api.RESOURCE_POOL_LIST)
}
// 货币单位
export const queryCurrency = () => {
  return service.get(Api.CURRENCY_LIST)
}
// 云平台入口
export const cloudEntrance = (vendorCode: string) => {
  return service.get(`${Api.CLOUD_ENTRANCE}?vendorCode=${vendorCode}`)
}
// 云平台(区域)
export const cloudSyncRegion = (vendorCode: string) => {
  return service.get(`${Api.CLOUD_REGION}?vendorCode=${vendorCode}`)
}
// 查询云平台类型
export const cloudPlatformTypeInfo = () => {
  return service.get(Api.CLOUD_PLATFORM_TYPE)
}
// 查询VDC(树形图)
export const vdcTreeList = () => {
  return service.get(Api.VDC_TREE_LIST)
}
// 可用区
export const queryZoneList = (params: any) => {
  return service.get(`${Api.AVAILABLE_AREA}?region=${params.region}`)
}
// 项目信息
export const queryUserProject = (params: any) => {
  return service.get(`${Api.PROJECT_INFORMATION}`, { params })
}
// 底层项目信息
export const queryUnderlyProject = (params: any) => {
  return service.get(Api.PROJECT_INFORMATION_ORIGIN, { params })
}
// 询价接口
export const queryInquiry = (data: any) => {
  return service.put(Api.PRICE_INQUIRY, data)
}
// 校验IPv4地址
export const checkIpAddress = (params: any) => {
  return service.get(Api.CHECK_IP_ADDRESS, { params })
}
// 磁盘类型
export const queryVolumeType = (params: any) => {
  return service.get(Api.VOLUME_TYPE, { params })
}
// 查询vdc配额
export const queryVdcQuota = (params: any) => {
  return service.get(Api.VDC_QUOTA, { params })
}
// 资源页面-选择资源池下拉框
export const getCloudResource = (params: any) => {
  return service.get(Api.CLOUD_RESOURCE, { params })
}
// 获取vdc对应审批流程
export const getVdcApprovalProcess = (data: any) => {
  return service.post(Api.VDC_APPROVAL_PROCESS, data)
}
// 上传base64Data格式图片
export const uploadBase64Data = (data: any) => {
  return service.put(Api.UPLOAD_BASE64DATA, data)
}
// 资源池、云类型、云类别的三级列表
export const resourcePoolGrade = (params: any = {}) => {
  return service.get(Api.RESOURCE_POOL_GRADE, { params })
}
// 查询云平台的区域列表
export const cloudPlatformRegion = (params: any = {}) => {
  return service.get(Api.REGION_LIST, { params })
}
// 查询云平台或资源池的区域和可用区的分级列表
export const cloudPlatformRegionAz = (params: any = {}) => {
  return service.get(Api.REGION_AZ_LIST, { params })
}
// 查询资源组列表
export const getResourceGroupList = (params: any) => {
  return service.get(Api.RESOURCE_GROUP_LIST, { params })
} // 查询绑定的资源组信息 (包含项目信息)
export const resourceGroupProject = (params: any = {}) => {
  return service.get(Api.RESOURCE_GROUP_PROJECT, { params })
}
// 事件任务进度
export const eventProgressDetail = (params: any = {}) => {
  return service.get(Api.EVENT_PROGRESS_DETAIL, { params })
}
// 事件任务进度分页列表
export const eventProgressPageUrl = Api.EVENT_PROGRESS_PAGE
// 导航栏-消息列表
export const messageList = (params: any = {}) => {
  return service.get(Api.MESSAGE_LIST, { params })
}
// 查询资源池的区域列表
export const resourcePoolRegionList = (params: any = {}) => {
  return service.get(Api.RESOURCE_POOL_REGION_LIST, { params })
}
// 资源类型列表
export const resourcePoolTypeList = (params: any = {}) => {
  return service.get(Api.RESOURCE_POOL_TYPE_LIST, { params })
}
// 云平台类别、云平台类型
export const platformCategoryType = () => {
  return service.get(Api.PLATFORM_CATEGORY_TYPE)
}
