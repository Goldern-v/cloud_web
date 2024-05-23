import service from '@/utils/request'
import { radar, iams, local } from './prefix'
/**
 * 运维中心
 */
type Api = (typeof Api)[keyof typeof Api]
const Api = {
  VM_MONITOR_LIST: `${radar}/monitor/vm/page`, //云主机监控列表
  VM_MONITOR_INFO: `${radar}/monitor/vm`, //云主机监控信息
  VM_MONITOR_INDICATORS: `${radar}/monitor/vm/items`, // get 查询云主机监控指标  put设置云主机监控项
  HOST_MACHINE_MONITOR: `${radar}/monitor/vm/host/page`, // 宿主机监控列表
  ALARM_RECORD: `${radar}/alarm/alert/notify/message/record/page`, // 告警记录(当前/历史)
  ALARM_RECORD_DETAIL: `${radar}/alarm/alert/notify/message/record/message/page`, // 告警记录详情
  ALARM_RECORD_OPERATE: `${radar}/alarm/alert/notify/message/record/status/check`, // 告警记录确认/删除
  ALARM_RECORD_OPERATE_BATCH: `${radar}/alarm/alert/notify/message/record/status/check/list`, // 告警记录确认/删除 批量
  ALARM_HISTORY: `${radar}`, //告警历史
  ALARM_CONTACT_GROUP: `${radar}/alarm/contact/group`, //告警联系组 get列表  post创建 put编辑 delete删除
  ALARM_CONTACT_GROUP_BATCH_DELETE: `${radar}/alarm/contact/group/batch`, //批量删除告警联系组
  ALARM_CONTACT_PERSON: `${radar}/alarm/contact`, // 告警联系人(已有)  post创建 put编辑 delete删除
  UNBIND_ALARM_CONTACT_PERSON: `${radar}/alarm/contact/group/unbinding/contact`, // 告警联系人(联系组未绑定)
  ALARM_CONTACT_PERSON_BATCH_DELETE: `${radar}/alarm/contact/batch`, //批量删除告警联系人
  ALARM_CONTACT_BIND_CONTACT_GROUP: `${radar}/alarm/contact/group/binding/contact`, //告警联系人添加到联系组
  ALARM_CONTACT_UNBIND_CONTACT_GROUP: `${radar}/alarm/contact/group/unbinding/contact`, //告警联系人移出联系组
  RESOURCE_TYPE_LIST: `${radar}/alarm/resource/support/type`, //创建告警规则 查询资源类型
  ASSOCIATED_INSTANCE_LIST: `${radar}/alarm/resource/support/type/resources`, // 创建告警规则 关联实例
  CONTACT_GROUP_LIST: `${radar}/alarm/contact/group`, //创建告警规则 告警联系组
  CONTACTS_LIST: `${radar}/alarm/contact/group/binding/contact`, //创建告警规则 告警联系人
  CREATE_RULES_MONITORING: `${radar}/alarm/alert/config/add`, //创建告警规则
  RULES_MONITORING_LIST: `${radar}/alarm/alert/config/page`, //告警规则列表
  EDIT_RULES_MONITORING: `${radar}/alarm/alert/config/update`, //编辑告警规则
  DEL_RULES_MONITORING: `${radar}/alarm/alert/config/delete`, // 删除告警规则
  ENABLE_RULES_MONITORING: `${radar}/alarm/alert/config/status/enable`, //启用告警规则
  DISABLED_RULES_MONITORING: `${radar}/alarm/alert/config/status/disable`, //禁用告警规则
  PLATFORM_USER_LIST: `${iams}/sys/user/name/like/list`, //告警规则 平台联系人
  ALARM_ASSIGN_RESOURCE: `${radar}/alarm/alert/config/assign/resource`, // 指定云主机后，查询对其 生效的配置文件
  ALARM_SHIELD_PAGE: `${radar}/alarm/shield/alert/config/page`, // 告警屏蔽分页
  ALARM_SHIELD_CREATE: `${radar}/alarm/shield/alert/config/add`, // 告警屏蔽创建
  ALARM_SHIELD_UPDATE: `${radar}/alarm/shield/alert/config/update`, // 告警屏蔽编辑
  ALARM_SHIELD_DELETE: `${radar}/alarm/shield/alert/config/delete`, // 告警屏蔽删除
  ALARM_SHIELD_ENABLE: `${radar}/alarm/shield/alert/config/status/enable/list`, // 告警屏蔽策略启用
  ALARM_SHIELD_DISABLE: `${radar}/alarm/shield/alert/config/status/disable/list`, // 告警屏蔽策略禁用
  ALARM_TEMPLATE_PAGE: `${radar}/alarm/alert/rule/template/page`, // 告警模版列表(分页)
  ALARM_TEMPLATE_LIST: `${radar}/alarm/alert/rule/template/list`, // 告警模版列表
  ALARM_TEMPLATE_CREATE: `${radar}/alarm/alert/rule/template/add`, // 自定义告警模版创建
  ALARM_TEMPLATE_UPDATE: `${radar}/alarm/alert/rule/template/update`, // 自定义告警模版修改
  ALARM_TEMPLATE_DELETE: `${radar}/alarm/alert/rule/template/delete`, // 自定义告警模版删除
  ALARM_TEMPLATE_COPY: `${radar}/alarm/alert/rule/template/copy`, // 告警模版复制
  ALARM_TEMPLATE_INFO: `${radar}/alarm/alert/rule/template/info` // 告警模版信息
}

/**
 * 主机监控
 */
//云主机监控列表
export const vmMonitorList = Api.VM_MONITOR_LIST
//云主机监控信息
export const queryVmMonitorInfo = (params: any = {}) => {
  return service.get(Api.VM_MONITOR_INFO, { params })
}
//查询云主机监控指标
export const vmMonitorIndicatorsUrl = Api.VM_MONITOR_INDICATORS
export const queryVmMonitorIndicators = (params: any = {}) => {
  return service.get(vmMonitorIndicatorsUrl, { params })
}
//设置云主机监控指标
export const setVmMonitorIndicators = (data: any = {}) => {
  return service.put(vmMonitorIndicatorsUrl, data)
}
//宿主机监控列表
export const hostMonitorList = Api.HOST_MACHINE_MONITOR
/**
 * 告警服务
 */
// 告警记录
export const alarmRecordPageUrl = Api.ALARM_RECORD
// 告警记录详情
export const alarmRecordDetailUrl = Api.ALARM_RECORD_DETAIL
// 告警记录确认/删除
export const alarmRecordOperate = (data: any) => {
  return service.put(
    `${Api.ALARM_RECORD_OPERATE}/?id=${data.id}&status=${data.status}`
  )
}
// 批量 告警记录确认/删除
export const alarmRecordBatchOperate = (data: any) => {
  return service.put(
    `${Api.ALARM_RECORD_OPERATE_BATCH}/?ids=${data.ids}&status=${data.status}`
  )
}
//删除当前告警记录
export const deleteAlarmRecord = Api.ALARM_RECORD
//删除当前告警历史
export const deleteAlarmHistory = Api.ALARM_HISTORY

//告警联系组列表
export const alarmContactGroupList = Api.ALARM_CONTACT_GROUP
//创建告警联系组
export const alarmContactGroupCreate = (data: any) => {
  return service.post(Api.ALARM_CONTACT_GROUP, data)
}
//编辑告警联系组
export const alarmContactGroupEdit = (data: any) => {
  return service.put(Api.ALARM_CONTACT_GROUP, data)
}
//删除告警联系组
export const alarmContactGroupDelete = Api.ALARM_CONTACT_GROUP
// 批量删告警联系组
export const alarmContactGroupBatchDelete = (data: any) => {
  return service.delete(Api.ALARM_CONTACT_GROUP_BATCH_DELETE, data)
}
//告警联系人列表
export const alarmContactPersonList = Api.ALARM_CONTACT_PERSON
//联系组未绑定联系人
export const queryUnbindAlarmContactPerson = (params: any = {}) => {
  return service.get(Api.UNBIND_ALARM_CONTACT_PERSON, { params })
}
//创建告警联系人
export const alarmContactPersonCreate = (data: any) => {
  return service.post(Api.ALARM_CONTACT_PERSON, data)
}
//编辑告警联系人
export const alarmContactPersonEdit = (data: any) => {
  return service.put(Api.ALARM_CONTACT_PERSON, data)
}
//删除告警联系人
export const alarmContactPersonDelete = Api.ALARM_CONTACT_PERSON
// 批量删告警联系人
export const alarmContactPersonBatchDelete = (data: any) => {
  return service.delete(Api.ALARM_CONTACT_PERSON_BATCH_DELETE, data)
}
//告警联系人添加到联系组
export const contactPersonBindContactGroup = (data: any) => {
  return service.put(Api.ALARM_CONTACT_BIND_CONTACT_GROUP, data)
}
//将告警联系人移出联系组
export const contactPersonUnbindContactGroup = (data: any) => {
  return service.put(Api.ALARM_CONTACT_UNBIND_CONTACT_GROUP, data)
}
//创建告警规则 查询资源类型
export const getResourceTypeList = () => {
  return service.get(Api.RESOURCE_TYPE_LIST)
}
//创建告警规则 关联实例
export const getAssociatedInstanceList = Api.ASSOCIATED_INSTANCE_LIST

//创建告警规则 告警联系组
export const getContactGroupList = (params: any) => {
  return service.get(Api.CONTACT_GROUP_LIST, { params })
}
//创建告警规则 告警联系人
export const getContactsList = (params: any) => {
  return service.get(Api.CONTACTS_LIST, params)
}
//创建告警规则
export const queryCreateRulesMonitoring = (data: any) => {
  return service.post(Api.CREATE_RULES_MONITORING, data)
}
// 查询告警规则列表
export const getAlarmRuleUrl = Api.RULES_MONITORING_LIST
//查询告警规则详情
export const getAlarmRuleList = (params: any) => {
  return service.get(getAlarmRuleUrl, { params })
}
//编辑告警规则
export const editCreateRulesMonitoring = (data: any) => {
  return service.put(Api.EDIT_RULES_MONITORING, data)
}
// 删除告警规则
export const alarmDeleteUrl = Api.DEL_RULES_MONITORING
export const deleteCreateRulesMonitoring = (id: any) => {
  return service.delete(`${alarmDeleteUrl}/${id}`)
}
//启用告警规则
export const alarmEnableUrl = Api.ENABLE_RULES_MONITORING
export const enableRulesMonitoring = (id: any) => {
  return service.put(`${alarmEnableUrl}/${id}`)
}
//禁用告警规则
export const alarmDisabledUrl = Api.DISABLED_RULES_MONITORING
export const disabledRulesMonitoring = (id: any) => {
  return service.put(`${alarmDisabledUrl}/${id}`)
}
//平台内用户
export const getPlatformUserList = () => {
  return service.get(Api.PLATFORM_USER_LIST)
}
//告警模版列表
export const alarmTemplateUrl = Api.ALARM_TEMPLATE_PAGE
export const getAlarmTemplateList = (params: any) => {
  return service.get(Api.ALARM_TEMPLATE_LIST, { params })
}
//自定义告警模版创建
export const alarmTemplateCreate = (data: any) => {
  return service.post(Api.ALARM_TEMPLATE_CREATE, data)
}
//自定义告警模版修改
export const alarmTemplateUpdate = (data: any) => {
  return service.put(Api.ALARM_TEMPLATE_UPDATE, data)
}
//自定义告警模版删除
export const alarmTemplateDelete = (id: string) => {
  return service.delete(`${Api.ALARM_TEMPLATE_DELETE}/${id}`)
}
//告警模版复制
export const alarmTemplateCopy = (params: any) => {
  return service.put(
    `${Api.ALARM_TEMPLATE_COPY}/${params.id}?name=${params.name}&remark=${params.remark}`
  )
}
//自定义告警模版详情信息
export const alarmTemplateInfo = (id: string) => {
  return service.get(`${Api.ALARM_TEMPLATE_INFO}/${id}`)
}

/**
 * 告警规则
 */
// 指定云主机后，查询对其 生效的配置文件
export const getAlarmAssignResource = (uuid: string, params: any) => {
  return service.get(`${Api.ALARM_ASSIGN_RESOURCE}/${uuid}`, { params })
}
/**
 * 告警屏蔽
 */
export const alarmShieldPageUrl = Api.ALARM_SHIELD_PAGE
// 告警屏蔽创建
export const alarmShieldCreate = (data: any) => {
  return service.post(Api.ALARM_SHIELD_CREATE, data)
}
// 告警屏蔽删除
export const alarmShieldDeleteUrl = Api.ALARM_SHIELD_DELETE
// 告警屏蔽策略启用
export const alarmShieldEnable = (ids: string) => {
  return service.put(`${Api.ALARM_SHIELD_ENABLE}?ids=${ids}`)
}
// 告警屏蔽策略禁用
export const alarmShieldDisable = (ids: string) => {
  return service.put(`${Api.ALARM_SHIELD_DISABLE}?ids=${ids}`)
}
// 告警屏蔽编辑
export const alarmShieldUpdate = (data: any) => {
  return service.put(Api.ALARM_SHIELD_UPDATE, data)
}
