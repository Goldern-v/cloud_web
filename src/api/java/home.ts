import service from '@/utils/request'
import { api, radar } from './prefix'
/**
 * 公共接口
 */
type Api = (typeof Api)[keyof typeof Api]
const Api = {
  HOME_MESSAGE_LIST: `${api}/index/message`, // 公告消息
  HOME_COST_OVERVIEW: `${api}/index/cost/overview`, // 费用概览
  HOME_COST_DISTRIBUTION: `${api}/index/cost/overview/distribution`, // 费用概览分布
  HOME_MINE_RESOURCE: `${api}/index/resource`, // 我的资源
  HOME_USER_COLLECT: `${api}/index/user/collect`, // 用户统计
  HOME_PLATFORM_OVERVIEW: `${api}/index/platform/overview`, // 平台概览
  HOME_COST_TREND: `${api}/index/cost/trend`, // 费用趋势
  HOME_OPTIMIZATION: `${api}/index/optimization/suggestion`, // 云主机优化建议
  HOME_VM_STATISTICS: `${radar}/monitor/vm/statistics`, // 主机资源统计
  HOME_ALARM_STATISTICS: `${radar}/alarm/alert/notify/message/statistics`, // 告警统计
  HOME_INSTANCE_STATISTICS: `${api}/index/instance/statistics` // 云服务器使用量趋势
}

// 首页公告消息
export const homeMessageList = (params: any = {}) => {
  return service.get(Api.HOME_MESSAGE_LIST, { params })
}
// 首页费用概览
export const homeCostOverview = () => {
  return service.get(Api.HOME_COST_OVERVIEW)
}
// 首页费用概览分布
export const homeCostDistribution = () => {
  return service.get(Api.HOME_COST_DISTRIBUTION)
}
// 首页我的资源
export const homeMineResource = () => {
  return service.get(Api.HOME_MINE_RESOURCE)
}
// 首页主机资源统计
export const homeVmStatistics = () => {
  return service.get(Api.HOME_VM_STATISTICS)
}
// 首页告警统计
export const homeAlarmStatistics = (params: any) => {
  return service.get(Api.HOME_ALARM_STATISTICS, { params })
}
// 首页用户统计
export const homeUserCollect = () => {
  return service.get(Api.HOME_USER_COLLECT)
}
// 首页平台概览
export const homePlatformOverview = () => {
  return service.get(Api.HOME_PLATFORM_OVERVIEW)
}
// 首页费用趋势
export const homeCostTrend = (params: any) => {
  return service.get(Api.HOME_COST_TREND, { params })
}
// 首页云主机优化建议
export const homeOptimization = () => {
  return service.get(Api.HOME_OPTIMIZATION)
}
// 云服务器使用量趋势
export const homeInstanceStatistics = (params: any) => {
  return service.get(Api.HOME_INSTANCE_STATISTICS, { params })
}
