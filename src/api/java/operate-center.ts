import service from '@/utils/request'
import { api, adapter, iams, bill, log, info } from './prefix'
/**
 * 运营中心
 */
type Api = (typeof Api)[keyof typeof Api]
const Api = {
  CLOUD_PLATFORM_CATEGORY: `${api}/platform/category`, // 云平台类别类型分级列表
  CLOUD_PLATFORM_TYPE_LIST: `${api}/infrastructure/cloud/platform/type/list`, // 云平台类别
  CLOUD_PLATFORM_VENDOR_LIST: `${api}/infrastructure/cloud/platform/type/vendor/list`, // 云平台类型
  CLOUD_PLATFORM_MANAGE: `${api}/platform`, // 云平台管理 post:创建 put:编辑 delete:删除 get:详情或下拉列表
  CLOUD_PLATFORM_PAGE: `${api}/platform/page`, // 云平台管理列表(分页接口)
  CLOUD_PLATFORM_BATCH_DELETE: `/api/platform/batch`, // 批量删除云平台
  CLOUD_PLATFORM_LIST: `${api}/platform`, // 云平台管理列表(不分页)
  CLOUD_PLATFORM_UPDATE_STATUS: `${api}/infrastructure/cloud/account/information/update`, // 云平台管理修改只读状态
  CLOUD_PLATFORM_DOMAIN: `${api}/domain/address`, // 域名 post:新增 get:查询 delete:删除
  CLOUD_PLATFORM_AUTH_LIST: `${api}/platform/auth/account`, // 查询云平台授权账户列表
  CLOUD_PLATFORM_AUTH_ADD: `${api}/platform/auth/account`, // 新增授权账户
  CLOUD_PLATFORM_AUTH_BIND: `${api}/platform/auth/account/bind/user`, // 云平台的授权账户绑定的云管用户列表
  CLOUD_PLATFORM_AUTH_UNBIND: `${api}/platform/auth/account/unbind/user`, // 查询未绑定授权账户的云管用户列表
  CLOUD_PLATFORM_AUTH_RELATION: `${api}/platform/auth/account/relation`, // post:云管用户绑定云平台的授权账户 delete:解绑云平台的授权账户
  CLOUD_PLATFORM_CONFIG: `${api}/platform/config`, // get:查询云平台设置 put:设置云平台
  RESOURCE_POOL_PAGE: `${api}/resource/pool/page`, // 资源池管理列表
  RESOURCE_POOL: `${api}/resource/pool`, // 资源池管理 post:创建 put:编辑 delete:删除 get: 详情或下拉列表
  RESOURCE_POOL_LIST: `${api}/resource/pool`, // 资源池下拉框列表
  RESOURCE_POOL_EDIT: `${api}/infrastructure/resource/bundle/updateDetail`, // 资源池管理编辑
  RESOURCE_POOL_DETAIL: `${api}/infrastructure/resource/bundle/info`, // 资源池管理详情
  RESOURCE_POOL_DETAIL_SYNC_OPEN: `${api}/sync/policy/open`, // 资源池管理详情-资源同步-同步开关开启
  RESOURCE_POOL_DETAIL_SYNC_CLOSE: `${api}/sync/policy/close`, // 资源池管理详情-资源同步-同步开关关闭
  PROJECT_LIST: `${iams}/vdc/project`, // 项目列表
  SYNC_POLICY_PAGE: `${api}/sync/policy/page`, // 同步配置列表
  SYNC_POLICY: `${api}/sync/policy`, // 资源同步 post:创建 put:编辑 delete:删除
  SYNC_POLICY_MANUAL: `${api}/sync/policy/manual`, // 同步配置手动同步
  SYNC_CONFIG_CREATE: `${api}/sync/create`, // 同步配置创建
  SYNC_CONFIG_EDIT: `${api}/sync/update`, // 同步配置编辑
  SYNC_BILL_RECORD_PAGE: `${bill}/syn/records/page`, // 账单同步记录
  RESOURCE_SPEC_PAGE: `${api}/flavor/page`, // 资源规格列表
  RESOURCE_SPEC_CREATE: `${api}/flavor/create`, // 资源规格创建
  RESOURCE_SPEC_DELETE: `${api}/flavor/delete`, // 资源规格删除
  RESOURCE_SPEC_EDIT: `${api}/flavor/update`, // 资源规格编辑
  RESOURCE_SPEC_SYNC: `${adapter}/sync/flavor`, // 资源规格同步
  RESOURCE_SPEC_STATUS: `${api}/flavor/status/set`, // 资源规格状态
  RESOURCE_SPEC_ARCHITECTURE: `${api}/flavor/type/list`, // 资源规格架构
  EXPENSE_TYPE_GRADE: `${bill}/expense/type/grade`, // 费用类型分级列表
  EXPENSE_TYPE: `${bill}/expense/type`, // get费用类型下拉框列表 post添加费用类型 put编辑费用类型 delete删除费用类型
  BILLING_ITEM: `${bill}/items`, // get计费项列表 post新增计费项 put编辑计费项 delete删除计费项
  PRICE_MODEL_PAGE: `${bill}/price/model/page`, // 定价模型分页列表
  PRICE_MODEL: `${bill}/price/model`, // post新增定价模型 put编辑定价模型 delete删除定价模型
  PRICE_MODEL_ENABLED: `${bill}/price/model/status`, // 启用定价模型
  ALLOC_RULE_PAGE: `${bill}/allocationRules/page`, // 分摊规则列表
  ALLOC_RULE: `${bill}/allocationRules`, // post新增分摊规则 put编辑分摊规则 delete删除分摊规则
  ALLOC_RULE_ENABLED: `${bill}/allocationRules/status`, // 启用分摊规则
  COST_CENTER_PAGE_PAGE: `${bill}/cost/page`, // 成本中心列表 分页
  COST_CENTER_LIST: `${bill}/cost`, // get成本中心列表 不分页 post新增成本中心 put编辑成本中心 delete删除成本中心
  EXPENSE_OPTIMIZE_CHECK_LIST: `${bill}/optimizingStrategy/log/page`, // 费用优化检查历史列表
  EXPENSE_OPTIMIZE_STRATEGY: `${bill}/optimizingStrategy/page`, // 优化策略分页列表
  EXPENSE_OPTIMIZE_STRATEGY_OPERATE: `${bill}/optimizingStrategy`, // 优化策略 post新增优化策略 put编辑优化策略 delete删除优化策略
  EXECUTE_EXPENSE_OPTIMIZE_STRATEGY_RULE: `${bill}/optimizingStrategy/enabled`, // 更新策略状态并执行状态规则
  EXPENSE_BREAKDOWN_PAGE: `${bill}/payAccount/page`, // 账单明细列表
  EXPENSE_SYNC_PAGE: `${bill}/syn/page`, // 查询同步账单
  Billing_BREAKDOWN_LIST: `${bill}/payAccount/billPage`, // 计费单明细列表
  EXPENSE_SUMMARY_SORT: `${bill}/payAccount/overviewGroup`, // 费用总览分类
  EXPENSE_SUMMARY_DATA: `${bill}/payAccount/billOverview`, // 费用总览数据
  EXPENSE_SUMMARY_DETAIL: `${bill}/payAccount/billOverviewSkipItem`, // 费用详情页明细列表
  SERVICE_CATEGORY_PAGE: `${api}/servicecategory/definition/page`, // 服务类别分页
  SERVICE_CATEGORY: `${api}/servicecategory/definition`, // post新增服务类别 put更新服务类别
  SERVICE_CATEGORY_LIST: `${api}/servicecategory/definition/list`, // 服务类别列表
  SERVICE_CONFIG_PAGE: `${api}/servicecategory/page`, // 服务配置分页
  SERVICE_CONFIG_LIST: `${api}/servicecategory/list`, // 服务配置列表
  SERVICE_CONFIG_BATCH_MODIFY: `${api}/servicecategory/batch`, // 服务配置批量变更发布状态
  SERVICE_CONFIG_RESOURCE_PAGE: `${api}/servicecategoryitems/page`, // 服务配置-底层资源绑定-分页查询
  SERVICE_CONFIG_RESOURCE: `${api}/servicecategoryitems`, // 服务配置-底层资源绑定- post新增 put更新
  SERVICE_CONFIG_PRODUCT: `${api}/servicecategory/nav`, // 服务配置创建-关联产品
  SERVICE_CONFIG: `${api}/servicecategory`, // get新增服务配置
  SERVICE_CONFIG_BATCH_DELETE: `${api}/servicecategoryitems/batch`, // 服务配置-底层资源绑定-批量资源删除
  SERVICE_CONFIG_BATCH_STATUS: `${api}/servicecategoryitems/batch/status`, // 服务配置-底层资源绑定-批量状态变更
  SERVICE_CATEGORY_TAG_LIST: `${api}/servicecategory/definition/tag`, // 服务录标签列表
  SERVICE_CATALOG: `${api}/servicecategory/resource`, // 服务目录-资源申请-展示列表
  OPERATE_LOG_LIST: `${log}/system`, // 操作日志 (get列表查询 put更改日志存储时间 )
  OPERATE_LOG_CUSTOM_SAVE_TIME: `${log}/system/info`, // 自定义操作日志存储周期
  STATION_MESSAGE_PAGE: `${info}/message/page`, // 站内消息分页
  STATION_MESSAGE_UNREAD: `${info}/message/get-unread-count`, // 站内消息未读
  STATION_MESSAGE_READ: `${info}/message/get-read-count`, // 站内消息已读
  STATION_MESSAGE: `${info}/message`, // 站内消息 put: 已读 delete: 删除 get:详情
  STATION_MESSAGE_BATCH_DELETE: `${info}/message/batch`, // 站内消息批量删除
  MESSAGE_RECEIVE_CONFIG_PAGE: `${info}/message/reception/page`, // 消息接收配置分页
  MESSAGE_RECEIVE_CONFIG: `${info}/message/reception`, // 消息接收配置 put:状态更新 post: 新增接收人
  MESSAGE_RECEIVE_CONFIG_BATCH: `${info}/message/reception/batch`, // 消息接收配置批量 post:新增接收人 delete:删除
  MESSAGE_RECEIVE_CONFIG_TEMPLATE: `${info}/message/template/list`, // 消息接收配置查询模版配置
  MESSAGE_RECEIVE_CONFIG_TEMPLATE_RESET: `${info}/message/template/reset`, // 消息接收配置重置模板
  MESSAGE_RECEIVE_CONFIG_TEMPLATE_UPDATE: `${info}/message/template`, // 更新模板配置
  RECEIVER_MANAGE_PAGE: `${info}/message/reception/person/page`, // 接收人管理分页
  RECEIVER_MANAGE_LIST: `${info}/message/reception/person/list`, // 接收人管理列表
  RECEIVER_MANAGE: `${info}/message/reception/person`, // 接收人管理 post:添加 put:编辑
  ANNOUNCEMENT_TYPE_PAGE: `${info}/announcement/type/page`, // 公告类型分页
  ANNOUNCEMENT_TYPE_LIST: `${info}/announcement/type/list`, // 公告类型列表
  ANNOUNCEMENT_TYPE: `${info}/announcement/type`, // 公告类型 post:新增 put:编辑 delete:删除
  ANNOUNCEMENT_MANAGE_PAGE: `${info}/announcement/page`, // 公告管理分页
  ANNOUNCEMENT_OPERATE: `${info}/announcement`, // post:公告新增 put:编辑 delete:删除 get:详情
  ANNOUNCEMENT_PUBLISH: `${info}/announcement/publish`, // 发布公告
  ANNOUNCEMENT_BATCH: `${info}/announcement/batch`, // put:批量下架 delete:批量删除
  SUPPLIER_LIST: `${iams}/sys/user/suppliers`, // 供应商用户列表
  NODE_PAGE: `${api}/supplier/node/inner/page`, // 供应商管理节点信息列表
  NODE_LIST: `${api}/supplier/node/query`, // 供应商管理节点信息（不分页）供应商ID获取
  NODE_OPERATE: `${api}/supplier/node`, //post添加节点 delete删除节点 put编辑
  EQUIPMENT_PAGE: `${api}/supplier/equipment/inner/page`, //供应商管理设备列表
  EQUIPMENT_LIST: `${api}/supplier/equipment/query`, //供应商管理节点设备列表（不分页）节点ID获取
  EQUIPMENT_OPERATE: `${api}/supplier/equipment`, //post添加设备 delete删除节点 put编辑
  PORT_PAGE: `${api}/supplier/port/inner/page`, //供应商管理端口列表
  PORT_LIST: `${api}/supplier/port/inner/list`, //供应商管理端口列表不分页
  PORT_APPLYCLOUDPORT: `${api}/supplier/port/applyCloudPort`, //供应商管理端口列表不分页
  PORT_LIST_UNDER_EQUIPMENT: `${api}/supplier/port/query`, //端口列表不分页
  REGION_AREAS: `${api}/region/areas`, //获取区域列表(弃用)
  REGION_COUNTIES: `${api}/region/countries`, //获取国家列表(弃用)
  REGION_CITIES: `${api}/region/cities`, //获取城市列表(弃用)
  REGION_LIST: `${api}/supplier/tp/regions`, //获取国家、区域、城市列表
  CABINET_LIST: `${api}/supplier/cabinet`, //获取机柜列表
  PORT_OPERATE: `${api}/supplier/port`, //添加端口
  AZURE_PORT_OPERATE: `${api}/supplier/port/azure`, //post 添加azure端口  put编辑azure端口 get详情
  GOOGLE_PORT_OPERATE: `${api}/supplier/port`, //post 添加google端口  put编辑google端口
  INFORMATION_ENTRY: `${api}/supplier/approval/record`, //供应商管理信息录入
  INFORMATION_UPDATE: `${api}/supplier/approval/update`, //修改供应商管理录入信息
  SUPPLIER_INFORMATION_LIST: `${api}/supplier/approval/list`, //供应商信息录入列表
  SUPPLIER_INFORMATION_QUERY_LIST: `${api}/supplier/approval/query`, //供应商信息录入列表(用于搜索过滤的查询接口)
  PORT_GROUP: `${api}/supplier/port/portGroups`, //随机生成的端口组序号(用于azure端口成组录入)
  SUPPLIER_DETAIL: `${api}/supplier/approval/detail`, //供应商详情
  SUPPLIER_OFF_SHELVES: `${api}/supplier/approval/offShelves`, //下架供应商
  SUPPLIER_CONTACT: `${api}/supplier/contact`, //联系人列表
  SUPPLIER_DELETE: `${api}/supplier/approval/delete`, //删除供应商
  BUSINESS_CLOUD_DATA_LIST: `${api}/business/manage/cloud/port/list`, //云端口信息录入列表
  BUSINESS_CLOUD_SEARCH_LIST: `${api}/business/manage/cloud/port/query`, //云端口信息录入搜索查询
  BUSINESS_CLOUD_DATA_ENTRY: `${api}/business/manage/cloud/port/add`, //云端口信息录入
  BUSINESS_CLOUD_DATA_UPDATE: `${api}/business/manage/cloud/port/update`, //云端口信息编辑
  BUSINESS_CLOUD_DATA_DELETE: `${api}/business/manage/cloud/port/delete`, //云端口信息删除
  DCI_LIST: `${api}/business/manage/dataCenterInternet/list/page`, //DCI数据录入列表
  DCI_SEARCH_LIST: `${api}/business/manage/dataCenterInternet/query`, //DCI数据录入搜索过滤接口
  DCI_ENTRY: `${api}/business/manage/dataCenterInternet/add`, //DCI数据录入
  DCI_UPDATE: `${api}/business/manage/dataCenterInternet/update`, //DCI数据编辑
  DCI_DELETE: `${api}/business/manage/dataCenterInternet/delete`, //DCI数据删除
  DCI_NODE_LIST: `${api}/supplier/node/list`, //DCI数据录入节点列表
  DCI_EQUIPMENT_LIST: `${api}/supplier/equipment/batchQuery`, //DCI数据录入节点下设备列表
  DCI_PORT_LIST: `${api}/supplier/port/batchQuery`, //DCI数据录入设备下端口列表
  APPROVE_AGAIN: `${api}/supplier/approval/approvalAgain`, //再次审批
  APPROVE_DELETE: `${api}/supplier/approval/delete`, //再次审批
  SUPPLIER_REGISTER: `${api}/supplier`, // 供应商注册信息
  SUPPLIER_TYPE_LIST: `${api}/supplier/type`, // 供应商类型下拉列表
  SUPPLIER_WORKORDER_LIST: `${api}/supplier/workorder/page`, // 工单管理列表
  SUPPLIER_WORKORDER_DELIVERY: `${api}/supplier/workorder`, // 工单管理交付
  SUPPLIER_EXCEL_IMPORT: `${api}/supplier/excel/import`, // 商务管理、供应商信息管理-批量导入
  SUPPLIER_PEND_APPROVE_PASS: `${api}/supplier/approval/pass`, // 商务管理、供应商审批管理、待审批-通过
  SUPPLIER_PEND_APPROVE_REJEST: `${api}/supplier/approval/reject`, // 商务管理、供应商审批管理、待审批-驳回
  SUPPLIER_PEND_APPROVE_ALL_PASS: `${api}/supplier/approval/pass/batch`, // 商务管理、供应商审批管理、待审批-批量通过
  SUPPLIER_PEND_APPROVE_ALL_REJEST: `${api}/supplier/approval/reject/batch`, // 商务管理、供应商审批管理、待审批-批量驳回
  SUPPLIER_WORKORDER_DETAIL: `${api}/supplier/workorder/detail`, // 工单管理详情
  SUPPLIER_WORKORDER_APPROVED: `${api}/supplier/workorder/approved`, // 工单详情审批通过
  SUPPLIER_WORKORDER_REJECTED: `${api}/supplier/workorder/rejected`, // 工单详情审批驳回
  CXORDER_SDWANORDER_LIST: `${api}/supplier/order/page`, // 订单SDWAN列表
  CXORDER_SDWANORDER_PROCESSQUERY: `${api}/supplier/order/flow`, // 订单SDWAN流程
  CLOUD_RESOURCE_LIST: `${api}/public-cloud/management/physical-connections/page`, // 资源管理列表
  CLOUD_RESOURCE_DETAIL: `${api}/public-cloud/management/physical-connection/detail`, // 资源管理详情
  CLOUD_RESOURCE_UPDATE: `${api}/public-cloud/management/physical-connections/update`, // 资源管理修改
  CLOUD_RESOURCE_SHARE_LIST: `${api}/public-cloud/management/share-connections/page` // 资源管理共享连接
}

/**
 * 云平台管理
 */
// 云平台类别类型分级列表
export const cloudPlatformCategory = (params: any = {}) => {
  return service.get(encodeURI(Api.CLOUD_PLATFORM_CATEGORY), { params })
}
// 云平台列表-云平台类别
export const cloudPlatformCategoryList = () => {
  return service.get(Api.CLOUD_PLATFORM_TYPE_LIST)
}
// 云平台列表-云平台类型(联动云平台类别)
export const cloudPlatformTypeList = (params: any = {}) => {
  return service.get(Api.CLOUD_PLATFORM_VENDOR_LIST, { params })
}
// 创建云平台
export const cloudPlatformCreate = (data: any) => {
  return service.post(Api.CLOUD_PLATFORM_MANAGE, data)
}
// 编辑云平台
export const cloudPlatformEdit = (data: any) => {
  return service.put(Api.CLOUD_PLATFORM_MANAGE, data)
}
// 云平台管理列表url(列表采用hooks请求)
export const cloudPlatformPageUrl = Api.CLOUD_PLATFORM_PAGE
// 云平台(下拉列表)
export const cloudPlatformList = (params: any = {}) => {
  return service.get(Api.CLOUD_PLATFORM_MANAGE, { params })
}
// 云平台详情
export const cloudPlatformDetail = (params: any = {}) => {
  return service.get(`${Api.CLOUD_PLATFORM_MANAGE}/${params.id}`)
}
// 云平台管理删除
export const cloudPlatformDelete = Api.CLOUD_PLATFORM_MANAGE
// 云平台(下拉列表)
export const queryCloudPlatformList = (params: any = {}) => {
  return service.get(Api.CLOUD_PLATFORM_LIST, { params })
}
// 云平台管理修改只读状态
export const cloudPlatformUpdateReadOnly = (data: any) => {
  return service.post(Api.CLOUD_PLATFORM_UPDATE_STATUS, data)
}
// 批量删除云平台
export const cloudPlatformBatchDelete = (data: any) => {
  return service.delete(`${Api.CLOUD_PLATFORM_BATCH_DELETE}?ids=${data.ids}`)
}
// 账单同步记录
export const syncBillRecordUrl = Api.SYNC_BILL_RECORD_PAGE
// 查询域名
export const cloudPlatformDomainUrl = Api.CLOUD_PLATFORM_DOMAIN
// 新增域名
export const cloudPlatformDomainAdd = (data: any) => {
  return service.post(Api.CLOUD_PLATFORM_DOMAIN, data)
}
// 查询云平台的授权账户绑定的云管用户
export const cloudPlatformAuthListUrl = Api.CLOUD_PLATFORM_AUTH_LIST
// 新增授权账户
export const cloudPlatformAuthAdd = (data: any) => {
  return service.post(Api.CLOUD_PLATFORM_AUTH_ADD, data)
}
// 查询云平台的授权账户绑定的云管用户
export const cloudPlatformAuthBindUrl = Api.CLOUD_PLATFORM_AUTH_BIND
// 云平台的授权账户绑定的云管用户列表
export const cloudPlatformAuthUnbindUrl = Api.CLOUD_PLATFORM_AUTH_UNBIND
// 云管用户绑定云平台的授权账户
export const cloudPlatformAuthBindAccount = (data: any) => {
  return service.post(Api.CLOUD_PLATFORM_AUTH_RELATION, data)
}
// 解绑云平台的授权账户
export const cloudPlatformAuthUnbindAccountUrl =
  Api.CLOUD_PLATFORM_AUTH_RELATION
// 查询云平台设置
export const cloudPlatformConfig = (params: any = {}) => {
  return service.get(Api.CLOUD_PLATFORM_CONFIG, { params })
}
// 设置云平台
export const cloudPlatformConfigSet = (data: any) => {
  return service.put(Api.CLOUD_PLATFORM_CONFIG, data)
}
// 连接校验
export const cloudPlatformConnectCheck = (params: any = {}) => {
  return service.get(`${Api.CLOUD_PLATFORM_MANAGE}/${params?.id}/connect/check`)
}
/**
 * 资源池管理
 */
// 资源池创建
export const resourcePoolCreate = (data: any) => {
  return service.post(Api.RESOURCE_POOL, data)
}
// 资源池管理列表
export const resourcePoolList = Api.RESOURCE_POOL_PAGE
// 资源池列表(选择下拉框数据)
export const resourcePoolSelect = (params: any = {}) => {
  return service.get(Api.RESOURCE_POOL_LIST, { params })
}
// 资源池删除
export const resourcePoolDeleteUrl = Api.RESOURCE_POOL
// 资源池管理编辑
export const resourcePoolEdit = (data: any) => {
  return service.put(Api.RESOURCE_POOL, data)
}
// 资源池管理-查询详情
export const resourcePoolItemInfo = (params: any) => {
  return service.get(`${Api.RESOURCE_POOL_DETAIL}?id=${params.id}`)
}
// 资源池详情
export const resourcePoolDetail = (params: any) => {
  return service.get(`${Api.RESOURCE_POOL}/${params.id}`)
}
/**
 * 资源同步
 */
// 查询同步配置列表
export const getResourceConfigApi = Api.SYNC_POLICY_PAGE
// 删除同步配置列表
export const deleteResourceConfigApi = Api.SYNC_POLICY
// 新增同步配置
export const addResourceConfigApi = (data: any) => {
  return service.post(Api.SYNC_POLICY, data)
}
// 编辑同步配置
export const editResourceConfigApi = (data: any) => {
  return service.put(Api.SYNC_POLICY, data)
}
// 立即同步(手动)
export const immediatelySyncApi = (data: any) => {
  return service.post(Api.SYNC_POLICY_MANUAL, data)
}
// 资源开关(开启)
export const startResourceSyncApi = (data: any) => {
  return service.put(Api.RESOURCE_POOL_DETAIL_SYNC_OPEN, data)
}
// 资源开关(关闭)
export const stopResourceSyncApi = (data: any) => {
  return service.put(Api.RESOURCE_POOL_DETAIL_SYNC_CLOSE, data)
}
/**
 * 资源规格
 */
// 资源规格列表查询
export const resourceSpecPage = Api.RESOURCE_SPEC_PAGE
// 资源规格创建
export const resourceSpecCreate = (data: any) => {
  return service.post(Api.RESOURCE_SPEC_CREATE, data)
}
// 资源规格删除
export const resourceSpecDelete = Api.RESOURCE_SPEC_DELETE
// 资源规格编辑
export const resourceSpecEdit = (data: any) => {
  return service.put(Api.RESOURCE_SPEC_EDIT, data)
}
// 资源规格同步
export const resourceSpecSync = (data: any) => {
  return service.post(Api.RESOURCE_SPEC_SYNC, data)
}
// 更新规格状态
export const updateSpecStatus = (id: string, params: any) => {
  return service.get(`${Api.RESOURCE_SPEC_STATUS}/${id}`, { params })
}
// 资源架构和规格类型
export const querySpecTypeList = (params: any) => {
  return service.get(Api.RESOURCE_SPEC_ARCHITECTURE, { params })
}

/**
 * 计费管理
 */
// 费用类型分级列表
export const expenseTypeGrade = (params: any) => {
  return service.get(Api.EXPENSE_TYPE_GRADE, { params })
}
// 费用类型列表(下拉框查询)
export const expenseTypeList = (params: any = {}) => {
  return service.get(Api.EXPENSE_TYPE, { params })
}
// 添加费用类型
export const addExpenseType = (data: any) => {
  return service.post(Api.EXPENSE_TYPE, data)
}
// 编辑费用类型
export const editExpenseType = (data: any) => {
  return service.put(Api.EXPENSE_TYPE, data)
}
// 删除费用类型
export const deleteExpenseType = (data: any, params: any) => {
  return service.delete(`${Api.EXPENSE_TYPE}/${params.id}`, data)
}
// 计费项列表
export const billItems = Api.BILLING_ITEM
// 计费项列表(下拉框查询)
export const queryBillItems = (params: any = {}) => {
  return service.get(billItems, { params })
}
// 新增计费项
export const addBillItem = (data: any) => {
  return service.post(Api.BILLING_ITEM, data)
}
// 编辑计费项
export const editBillItem = (data: any) => {
  return service.put(Api.BILLING_ITEM, data)
}
// 删除计费项
export const deleteBillItem = Api.BILLING_ITEM
// 定价模型分页列表
export const billPriceModel = Api.PRICE_MODEL_PAGE
// 新增定价模型
export const addBillPrice = (data: any) => {
  return service.post(Api.PRICE_MODEL, data)
}
// 编辑定价模型
export const editBillPrice = (data: any) => {
  return service.put(Api.PRICE_MODEL, data)
}
// 删除定价模型
export const deleteBillPrice = (data: any, params: any) => {
  return service.delete(`${Api.PRICE_MODEL}/${params.id}`, data)
}
// 启用定价模型
export const enabledBillPrice = (data: any) => {
  return service.put(Api.PRICE_MODEL_ENABLED, data)
}
// 分摊规则分页列表
export const allocationRulesPage = Api.ALLOC_RULE_PAGE
// 新增分摊规则
export const addAllocationRule = (data: any) => {
  return service.post(Api.ALLOC_RULE, data)
}
// 编辑分摊规则
export const editAllocationRule = (data: any) => {
  return service.put(Api.ALLOC_RULE, data)
}
// 启用分摊规则
export const enabledAllocationRule = (data: any) => {
  return service.put(Api.ALLOC_RULE_ENABLED, data)
}
// 删除分摊规则
export const deleteAllocationRule = Api.ALLOC_RULE
// 成本中心列表
export const billCostPage = Api.COST_CENTER_PAGE_PAGE // 分页接口
export const billCost = Api.COST_CENTER_LIST // 不分页
// 成本中心查询（下拉框接口）
export const queryBillCostPage = (params: any = {}) => {
  return service.get(billCost, { params })
}
// 新增成本中心
export const addBillCost = (data: any) => {
  return service.post(Api.COST_CENTER_LIST, data)
}
// 删除成本中心
export const deleteBillCostCenter = (params: any, data: any) => {
  return service.delete(`${Api.COST_CENTER_LIST}/${data.id}`, { params })
}
// 编辑成本中心
export const editBillCost = (data: any) => {
  return service.put(Api.COST_CENTER_LIST, data)
}
// 检查日志列表
export const billOptimizeLogPage = Api.EXPENSE_OPTIMIZE_CHECK_LIST
// 检查日志详情
export const billOptimizeLogDetail = (params: any) => {
  return service.get(`${Api.EXPENSE_OPTIMIZE_CHECK_LIST}/${params.id}`, {
    params
  })
}
// 优化策略列表
export const billOptimizeStrategyPage = Api.EXPENSE_OPTIMIZE_STRATEGY
// 新增优化策略
export const addOptimizeStrategy = (data: any) => {
  return service.post(Api.EXPENSE_OPTIMIZE_STRATEGY_OPERATE, data)
}
// 编辑优化策略
export const editOptimizeStrategy = (data: any) => {
  return service.put(Api.EXPENSE_OPTIMIZE_STRATEGY_OPERATE, data)
}
//删除优化策略
export const deleteOptimizeStrategy = (data: any) => {
  return service.delete(`${Api.EXPENSE_OPTIMIZE_STRATEGY_OPERATE}/${data.id}`)
}
//更新策略状态执行策略规则
export const executeOptimizeStrategyRule = (params: any = {}) => {
  return service.get(Api.EXECUTE_EXPENSE_OPTIMIZE_STRATEGY_RULE, { params })
}
// 账单明细列表
export const queryPayAccountPage = Api.EXPENSE_BREAKDOWN_PAGE
// 查询同步账单
export const expenseSyncPageUrl = Api.EXPENSE_SYNC_PAGE
//计费单明细
export const queryBillingPage = Api.Billing_BREAKDOWN_LIST
//费用总览分类
export const queryPaySummarySort = (params: any = {}) => {
  return service.get(Api.EXPENSE_SUMMARY_SORT, { params })
}
//费用总览数据
export const queryPaySummaryData = (data: any = {}) => {
  return service.put(Api.EXPENSE_SUMMARY_DATA, data)
}
export const queryPaySummaryDetail = (data: any = {}) => {
  return service.put(Api.EXPENSE_SUMMARY_DETAIL, data)
}
/**
 * 服务管理类别
 */
// 服务类别分页
export const serviceCategoryPageUrl = Api.SERVICE_CATEGORY_PAGE
// 服务类别新增、更新、删除接口url
export const serviceCategoryUrl = Api.SERVICE_CATEGORY
// 新增服务类别
export const serviceCategoryCreate = (data: any) => {
  return service.post(serviceCategoryUrl, data)
}
// 更新服务类别
export const serviceCategoryUpdate = (data: any) => {
  return service.put(serviceCategoryUrl, data)
}
// 服务类别列表(下拉框)
export const serviceCategoryList = (params: any = {}) => {
  return service.get(Api.SERVICE_CATEGORY_LIST, { params })
}
/**
 * 服务配置
 */
// 服务配置分页
export const serviceConfigPageUrl = Api.SERVICE_CONFIG_PAGE
// 服务配置创建-关联产品
export const serviceConfigProduct = (params: any = {}) => {
  return service.get(Api.SERVICE_CONFIG_PRODUCT, { params })
}
// 服务配置创建、更新、删除接口url
export const serviceConfigUrl = Api.SERVICE_CONFIG
// 服务配置创建
export const serviceConfigCreate = (data: any) => {
  return service.post(serviceConfigUrl, data)
}
// 服务配置更新
export const serviceConfigUpdate = (data: any) => {
  return service.put(serviceConfigUrl, data)
}
// 服务配置批量变更发布状态
export const serviceConfigBatch = (params: any) => {
  return service.get(Api.SERVICE_CONFIG_BATCH_MODIFY, { params })
}
// 服务配置-底层资源绑定-分页查询
export const serviceConfigResourcePageUrl = Api.SERVICE_CONFIG_RESOURCE_PAGE
export const serviceConfigResourceUrl = Api.SERVICE_CONFIG_RESOURCE
// 服务配置-底层资源绑定-新增
export const serviceConfigResourceCreate = (data: any) => {
  return service.post(serviceConfigResourceUrl, data)
}
// 服务配置-底层资源绑定-更新
export const serviceConfigResourceUpdate = (data: any) => {
  return service.put(serviceConfigResourceUrl, data)
}
// 服务配置-底层资源绑定-批量状态变更
export const serviceConfigResourceBatch = (params: any) => {
  return service.get(Api.SERVICE_CONFIG_BATCH_STATUS, { params })
}
// 服务配置-底层资源绑定-批量资源删除
export const serviceConfigResourceBatchDelete = (data: any) => {
  return service.delete(`${Api.SERVICE_CONFIG_BATCH_DELETE}?ids=${data.ids}`)
}

/**
 * 服务目录
 */
// 服务目录标签列表
export const serviceCategoryTagList = (params: any = {}) => {
  return service.get(Api.SERVICE_CATEGORY_TAG_LIST, { params })
}
// 服务目录列表
export const serviceConfigList = (params: any = {}) => {
  return service.get(Api.SERVICE_CATALOG, { params })
}

/**
 * 操作日志
 */
//操作日志列表
export const operateLogList = Api.OPERATE_LOG_LIST
//查询自定义日志存储周期
export const queryLogSaveTime = () => {
  return service.get(Api.OPERATE_LOG_CUSTOM_SAVE_TIME)
}
//设置自定义日志存储周期
export const setLogSaveTime = (data: any) => {
  return service.put(Api.OPERATE_LOG_LIST, data)
}

/**
 * 通知公告-站内消息
 */
// 站内消息分页
export const stationMessageUrl = Api.STATION_MESSAGE_PAGE
// 站内消息已读
export const stationMessageRead = (data: any) => {
  return service.put(Api.STATION_MESSAGE, data)
}
// 站内消息详情
export const stationMessageDetail = (id: string) => {
  return service.get(`${Api.STATION_MESSAGE}/${id}`)
}
// 站内消息删除
export const stationMessageDeleteUrl = Api.STATION_MESSAGE
// 站内消息批量删除
export const stationMessageBatchDelete = (data: any) => {
  return service.delete(Api.STATION_MESSAGE_BATCH_DELETE, { data })
}
// 站内消息未读
export const stationUnread = (params: any) => {
  return service.get(Api.STATION_MESSAGE_UNREAD, { params })
}
// 站内消息已读
export const stationRead = (params: any) => {
  return service.get(Api.STATION_MESSAGE_READ, { params })
}
/**
 * 通知公告-消息接收配置
 */
// 消息接收配置分页
export const messageReceiveConfigUrl = Api.MESSAGE_RECEIVE_CONFIG_PAGE
// 接收配置状态更新
export const messageReceiveConfigStatusUpdate = (data: any) => {
  return service.put(Api.MESSAGE_RECEIVE_CONFIG, data)
}
// 消息接收配置新增接收人
export const messageReceiveConfigAdd = (data: any, id: string) => {
  return service.post(`${Api.MESSAGE_RECEIVE_CONFIG}/${id}`, data)
}
// 消息接收配置批量新增接收人
export const messageReceiveConfigAddBatch = (data: any) => {
  return service.post(Api.MESSAGE_RECEIVE_CONFIG_BATCH, data)
}
// 消息接收配置删除接收人
export const messageReceiveConfigDelete = (data: any, id: string) => {
  return service.delete(`${Api.MESSAGE_RECEIVE_CONFIG}/${id}`, data)
}
// 消息接收配置批量删除接收人
export const messageReceiveConfigDeleteBatch = (data: any) => {
  return service.delete(Api.MESSAGE_RECEIVE_CONFIG_BATCH, { data })
}
// 消息接收配置查询模版配置
export const receiverReceiveTemplate = (params: any) => {
  return service.get(Api.MESSAGE_RECEIVE_CONFIG_TEMPLATE, { params })
}
// 重置模板
export const receiverReceiveTemplateReset = (params: any) => {
  return service.get(Api.MESSAGE_RECEIVE_CONFIG_TEMPLATE_RESET, { params })
}
// 更新模板配置
export const receiverReceiveTemplateUpdate = (data: any) => {
  return service.put(Api.MESSAGE_RECEIVE_CONFIG_TEMPLATE_UPDATE, data)
}
/**
 * 通知公告-接收人管理
 */
// 接收人管理分页
export const receiverManagePageUrl = Api.RECEIVER_MANAGE_PAGE
// 接收人管理列表
export const receiverManageList = () => {
  return service.get(Api.RECEIVER_MANAGE_LIST)
}
// 删除
export const receiverManageUrl = Api.RECEIVER_MANAGE
// 添加接收人
export const receiverManageAdd = (data: any) => {
  return service.post(receiverManageUrl, data)
}
// 编辑接收人
export const receiverManageEdit = (data: any) => {
  return service.put(receiverManageUrl, data)
}
/**
 * 通知公告-公告类型
 */
// 公告类型分页
export const announcementTypePageUrl = Api.ANNOUNCEMENT_TYPE_PAGE
export const announcementTypeDeleteUrl = Api.ANNOUNCEMENT_TYPE
// 公告类型新增
export const announcementTypeAdd = (data: any) => {
  return service.post(Api.ANNOUNCEMENT_TYPE, data)
}
// 公告类型编辑
export const announcementTypeEdit = (data: any) => {
  return service.put(Api.ANNOUNCEMENT_TYPE, data)
}
// 公告类型列表
export const announcementTypeList = () => {
  return service.get(Api.ANNOUNCEMENT_TYPE_LIST)
}
/**
 * 通知公告-公告管理
 */
// 公告管理分页
export const announcementManagePageUrl = Api.ANNOUNCEMENT_MANAGE_PAGE
// 公告管理删除
export const announcementManageDeleteUrl = Api.ANNOUNCEMENT_OPERATE
export const announcementManageDelete = (id: string) => {
  return service.delete(`${Api.ANNOUNCEMENT_OPERATE}/${id}`)
}
// 公告新增
export const announcementManageAdd = (data: any) => {
  return service.post(Api.ANNOUNCEMENT_OPERATE, data)
}
// 公告编辑
export const announcementManageEdit = (data: any) => {
  return service.put(Api.ANNOUNCEMENT_OPERATE, data)
}
// 发布公告
export const announcementPublish = (data: any) => {
  return service.put(Api.ANNOUNCEMENT_PUBLISH, data)
}
// 公告详情
export const announcementDetail = (id: string) => {
  return service.get(`${Api.ANNOUNCEMENT_OPERATE}/${id}`)
}
// 批量下架
export const announcementBatchOut = (data: any) => {
  return service.put(Api.ANNOUNCEMENT_BATCH, data)
}
// 批量删除
export const announcementBatchDelete = (data: any) => {
  return service.delete(Api.ANNOUNCEMENT_BATCH, { data })
}

/**
 * 供应商管理
 */

export const getSupplierList = () => {
  return service.get(Api.SUPPLIER_LIST)
}
//节点信息
export const nodePageUrl = Api.NODE_PAGE
export const getNodeList = (params: any) => {
  return service.get(Api.NODE_LIST, { params })
}
//添加节点
export const nodeAdd = (data: any) => {
  return service.post(Api.NODE_OPERATE, data)
}
//编辑节点
export const nodeEdit = (data: any) => {
  return service.put(Api.NODE_OPERATE, data)
}
//删除节点
export const nodeDelete = Api.NODE_OPERATE
//获取区域列表
export const getRegionAreas = () => {
  return service.get(Api.REGION_AREAS)
}
//获取国家列表
export const getRegionCountries = (params: any) => {
  return service.get(Api.REGION_COUNTIES, { params })
}
//获取城市列表
export const getRegionCities = (params: any) => {
  return service.get(Api.REGION_CITIES, { params })
}
//获取区域、国家、城市列表
export const getRegionList = (params: any) => {
  return service.get(Api.REGION_LIST, { params })
}

//获取机柜/机架列表
export const getCabinetList = (params: any) => {
  return service.get(Api.CABINET_LIST, { params })
}
//设备信息
export const equipmentPageUrl = Api.EQUIPMENT_PAGE
export const getEquipmentList = (params: any) => {
  return service.get(Api.EQUIPMENT_LIST, { params })
}
//添加设备
export const equipmentAdd = (data: any) => {
  return service.post(Api.EQUIPMENT_OPERATE, data)
}
//编辑设备
export const equipmentEdit = (data: any) => {
  return service.put(Api.EQUIPMENT_OPERATE, data)
}
//删除设备
export const equipmentDelete = Api.EQUIPMENT_OPERATE
//端口列表
export const portPageUrl = Api.PORT_PAGE
//设备下端口列表
export const portUnderEquipmentList = (params: any) => {
  return service.get(Api.PORT_LIST_UNDER_EQUIPMENT, { params })
}
//端口列表不分页
export const getPortList = (params: any) => {
  return service.get(Api.PORT_LIST, { params })
}
//端口信息专线申请
export const portApplyCloudPort = (data: any) => {
  return service.postForm(Api.PORT_APPLYCLOUDPORT, data)
}
//添加端口
export const portAdd = (data: any) => {
  return service.post(Api.PORT_OPERATE, data)
}
//添加azure端口
export const azurePortAdd = (data: any) => {
  return service.post(Api.AZURE_PORT_OPERATE, data)
}
//编辑端口
export const portEdit = (data: any) => {
  return service.put(Api.PORT_OPERATE, data)
}
//azure端口详情
export const getAzurePortDetail = (id: any) => {
  return service.get(`${Api.AZURE_PORT_OPERATE}/${id}`)
}
//删除端口
export const portDelete = Api.PORT_OPERATE
//添加google端口
export const googlePortAdd = (data: any) => {
  return service.post(Api.GOOGLE_PORT_OPERATE, data)
}

//供应商信息录入
export const informationEntry = (data: any) => {
  return service.post(Api.INFORMATION_ENTRY, data)
}
//修改供应商录入信息
export const informationUpdate = (data: any) => {
  return service.post(Api.INFORMATION_UPDATE, data)
}

//供应商列表
export const supplierInfoList = Api.SUPPLIER_INFORMATION_LIST
export const supplierInfoQueryList = Api.SUPPLIER_INFORMATION_QUERY_LIST
//供应商详情
export const supplierInfoDetail = (id: string) => {
  return service.get(`${Api.SUPPLIER_DETAIL}/${id}`)
}
//删除供应商
export const supplierDelete = (data: any) => {
  return service.post(Api.SUPPLIER_DELETE, data)
}
//再次审批
export const approveAgain = (data: any) => {
  return service.post(Api.APPROVE_AGAIN, data)
}
//删除已下架或已驳回的审批记录
export const approveDelete = (data: any) => {
  return service.post(Api.APPROVE_DELETE, data)
}
//随机生成的端口组序号(用于azure端口录入)
export const getPortGroup = () => {
  return service.get(Api.PORT_GROUP)
}
//联系人
export const getContact = () => {
  return service.get(Api.SUPPLIER_CONTACT)
}
//下架供应商
export const supplierOffShelves = (data: any) => {
  return service.post(Api.SUPPLIER_OFF_SHELVES, data)
}
//云端口信息录入列表
export const businessCloudDataList = Api.BUSINESS_CLOUD_DATA_LIST
export const businessCloudSearchList = Api.BUSINESS_CLOUD_SEARCH_LIST
//云端口信息录入
export const cloudDataEntry = (data: any) => {
  return service.post(Api.BUSINESS_CLOUD_DATA_ENTRY, data)
}
//云端口数据编辑
export const cloudDataUpdate = (data: any) => {
  return service.post(Api.BUSINESS_CLOUD_DATA_UPDATE, data)
}
//云端口数据删除
export const cloudDataDelete = (data: any) => {
  return service.post(Api.BUSINESS_CLOUD_DATA_DELETE, data)
}
//DCI数据列表
export const dciDataList = Api.DCI_LIST
export const dciDataSearchList = Api.DCI_SEARCH_LIST
//DCI数据录入
export const dciDataEntry = (data: any) => {
  return service.post(Api.DCI_ENTRY, data)
}
//DCI数据编辑
export const dciDataUpdate = (data: any) => {
  return service.post(Api.DCI_UPDATE, data)
}
//DCI数据删除
export const dciDataDelete = (data: any) => {
  return service.post(Api.DCI_DELETE, data)
}
//DCI数据录入节点列表
export const dciNodeList = () => {
  return service.get(Api.DCI_NODE_LIST)
}
//DCI数据录入节点下设备列表
export const dciEquipmentList = (data: any) => {
  return service.post(Api.DCI_EQUIPMENT_LIST, data)
}
//DCI数据录入设备下端口列表
export const dciPortList = (data: any) => {
  return service.post(Api.DCI_PORT_LIST, data)
}
//sdwan流程
export const sdwanProcess = (params: any) => {
  return service.get(Api.CXORDER_SDWANORDER_PROCESSQUERY, { params })
}
//订单SDWAN列表
export const corderSdwanList = Api.CXORDER_SDWANORDER_LIST
// 供应商注册信息分页查询
export const supplierRegisterPageUrl = `${Api.SUPPLIER_REGISTER}/page`
// 新增供应商注册信息
export const supplierRegisterCreate = (data: any) => {
  return service.post(Api.SUPPLIER_REGISTER, data)
}
// 编辑供应商注册信息
export const supplierRegisterUpdate = (data: any) => {
  return service.put(Api.SUPPLIER_REGISTER, data)
}
// 供应商类型下拉列表
export const supplierTypeList = () => {
  return service.get(Api.SUPPLIER_TYPE_LIST)
}
// 工单管理列表
export const supplierWorkorderList = Api.SUPPLIER_WORKORDER_LIST
// 工单管理详情
export const supplierWorkorderDetail = (params: any) => {
  return service.get(Api.SUPPLIER_WORKORDER_DETAIL, { params })
}
// 工单管理交付
export const supplierWokkorderDelivery = (data: any) => {
  return service.put(Api.SUPPLIER_WORKORDER_DELIVERY, data)
}
// 工单详情审批通过
export const supplierWokkorderApproved = (data: any) => {
  return service.put(Api.SUPPLIER_WORKORDER_APPROVED, data)
}
// 工单详情审批驳回
export const supplierWokkorderRejected = (data: any) => {
  return service.put(Api.SUPPLIER_WORKORDER_REJECTED, data)
}
// 批量导入
export const supplierExcelImport = (data: any) => {
  return service.postForm(Api.SUPPLIER_EXCEL_IMPORT, data)
}
// 供应商管理 待审批 通过
export const supplierPaendApprovePass = (data: any) => {
  return service.post(Api.SUPPLIER_PEND_APPROVE_PASS, data)
}
// 供应商管理 待审批 批量通过
export const supplierPaendApproveAllPass = (data: any) => {
  return service.put(Api.SUPPLIER_PEND_APPROVE_ALL_PASS, data)
}
// 供应商管理 待审批 驳回
export const supplierPaendApproveReject = (data: any) => {
  return service.post(Api.SUPPLIER_PEND_APPROVE_REJEST, data)
}
// 供应商管理 待审批 批量驳回
export const supplierPaendApproveAllReject = (data: any) => {
  return service.put(Api.SUPPLIER_PEND_APPROVE_ALL_REJEST, data)
}
// 资源管理列表
export const cloudResourceList = (params: any) => {
  return service.get(Api.CLOUD_RESOURCE_LIST, { params })
}
// 资源管理详情
export const cloudResourceDetail = (params: any) => {
  return service.get(Api.CLOUD_RESOURCE_DETAIL, { params })
}
// 资源管理编辑
export const cloudResourceUpdate = (data: any) => {
  return service.post(Api.CLOUD_RESOURCE_UPDATE, data)
}
// 资源管理-共享连接列表
export const cloudResourceShareList = (params: any) => {
  return service.get(Api.CLOUD_RESOURCE_SHARE_LIST, { params })
}
