import { SessionStorage } from '@/utils/storage'
export const replaceOperatePath = (path: string): string => {
  let result = ''
  switch (path) {
    // 云平台管理
    case JumpEnum.CLOUD_PLATFORM_MANAGE_CREATE:
    case JumpEnum.CLOUD_PLATFORM_MANAGE_DETAIL:
      result = PathEnum.CLOUD_PLATFORM_MANAGE_LIST
      break
    // 资源池管理
    case JumpEnum.RESOURCE_POOL_MANAGE_CREATE:
    case JumpEnum.RESOURCE_POOL_MANAGE_DETAIL:
      result = PathEnum.RESOURCE_POOL_MANAGE_LIST
      break
    // 定价模型
    case JumpEnum.PRICE_MODEL_CREATE:
      result = PathEnum.PRICE_MODEL_LIST
      break
    // 分摊规则
    case JumpEnum.ALLOCATION_RULE_CREATE:
      result = PathEnum.ALLOCATION_RULE_LIST
      break
    // 费用总览
    case JumpEnum.EXPENSE_SUMMARY_DETAIL:
      result = PathEnum.EXPENSE_SUMMARY_LIST
      break
    // 费用优化
    case JumpEnum.EXPENSE_OPTIMIZE_STRATEGY_CREATE:
    case JumpEnum.EXPENSE_OPTIMIZE_STRATEGY_EDIT:
      result = PathEnum.EXPENSE_OPTIMIZE_LIST
      break
    // 服务配置
    case JumpEnum.SERVICE_CONFIG_DETAIL:
      result = PathEnum.SERVICE_CONFIG_LIST
      break
    // 通知公告-公告管理
    case JumpEnum.ANNOUNCEMENT_MANAGE_HISTORY_DETAIL:
    case JumpEnum.ANNOUNCEMENT_MANAGE_PUBLICITY_DETAIL:
      result = PathEnum.ANNOUNCEMENT_MANAGE_LIST
      break
    case JumpEnum.SUPPLIER_MANAGE_INFORMATION_ENTRY:
    case JumpEnum.SUPPLIER_MANAGE_INFORMATION_DETAIL:
      result = SessionStorage.getItem('sidePath')
      break
    case JumpEnum.SUPPLIER_MANAGE_APPROVE_DETAIL:
      result = PathEnum.SUPPLIER_MANAGE_INFORMATION_LIST
      break
    // 国际公司云平台管理
    case JumpEnum.SUPPLIER_PLATFORM_CREATE:
    case JumpEnum.SUPPLIER_PLATFORM_DETAIL:
      result = PathEnum.SUPPLIER_PLATFORM_LIST
      break
    // 国际公司资源池管理
    case JumpEnum.SUPPLIER_POOL_CREATE:
    case JumpEnum.SUPPLIER_POOL_DETAIL:
      result = PathEnum.SUPPLIER_POOL_LIST
      break
    // 国际公司资源管理
    case JumpEnum.SUPPLIER_RESOURCE_ALIYUN_DETAIL:
    case JumpEnum.SUPPLIER_RESOURCE_AMAZON_DETAIL:
      result = PathEnum.SUPPLIER_RESOURCE_LIST
      break
    // 国际公司角色管理
    case JumpEnum.SUPPLIER_ACCOUNT_ROLE_AUTH:
      result = PathEnum.SUPPLIER_ACCOUNT_ROLE_LIST
      break
    default:
      result = path
      break
  }
  return result
}

// 运维中心列表菜单
const PathEnum = {
  CLOUD_PLATFORM_MANAGE_LIST:
    '/operate-center/basic-config/cloud-platform-manage/list', // 云平台管理
  RESOURCE_POOL_MANAGE_LIST:
    '/operate-center/basic-config/resource-pool-manage/list', // 资源池管理
  PRICE_MODEL_LIST: '/operate-center/billing-manage/price-model/list', // 定价模型
  ALLOCATION_RULE_LIST: '/operate-center/billing-manage/allocation-rule/list', // 分摊规则
  EXPENSE_SUMMARY_LIST: '/operate-center/expense-center/expense-summary/list', // 费用总览
  EXPENSE_OPTIMIZE_LIST: '/operate-center/expense-center/expense-optimize/list', // 费用优化
  SERVICE_CONFIG_LIST: '/operate-center/service-manage/service-config/list', // 服务配置
  ANNOUNCEMENT_MANAGE_LIST:
    '/operate-center/notice-announcement/announcement-manage/index', // 公告管理
  SUPPLIER_MANAGE_INFORMATION_LIST:
    '/operate-center/supplier/manage/information-manage/index', // 运营商管理 信息管理
  SUPPLIER_MANAGE_APPROVE_LIST:
    '/operate-center/supplier/manage/approve-manage/index', // 运营商管理 审批管理
  SUPPLIER_PLATFORM_LIST: '/operate-center/supplier/cloud/platform/list', // 国际公司云平台管理
  SUPPLIER_POOL_LIST: '/operate-center/supplier/cloud/pool/list', // 国际公司资源池管理
  SUPPLIER_RESOURCE_LIST: '/operate-center/supplier/cloud/resource/index', // 国际公司资源管理
  SUPPLIER_ACCOUNT_ROLE_LIST: '/operate-center/supplier/account/role/list' // 国际公司角色授权
}

// 运维中心跳转菜单
const JumpEnum = {
  CLOUD_PLATFORM_MANAGE_CREATE:
    '/operate-center/basic-config/cloud-platform-manage/create', // 云平台管理创建
  CLOUD_PLATFORM_MANAGE_DETAIL:
    '/operate-center/basic-config/cloud-platform-manage/detail', // 云平台管理详情
  RESOURCE_POOL_MANAGE_CREATE:
    '/operate-center/basic-config/resource-pool-manage/create', // 资源池管理创建
  RESOURCE_POOL_MANAGE_DETAIL:
    '/operate-center/basic-config/resource-pool-manage/detail', // 资源池管理详情
  PRICE_MODEL_CREATE: '/operate-center/billing-manage/price-model/create', // 定价模型创建
  ALLOCATION_RULE_CREATE:
    '/operate-center/billing-manage/allocation-rule/create', // 分摊规则创建
  EXPENSE_SUMMARY_DETAIL:
    '/operate-center/expense-center/expense-summary/detail', // 费用总览-单个费用详情
  EXPENSE_OPTIMIZE_STRATEGY_CREATE:
    '/operate-center/expense-center/expense-optimize/optimize-strategy/create', // 费用优化策略创建
  EXPENSE_OPTIMIZE_STRATEGY_EDIT:
    '/operate-center/expense-center/expense-optimize/optimize-strategy/edit', // 费用优化策略编辑
  SERVICE_CONFIG_DETAIL: '/operate-center/service-manage/service-config/detail', // 服务配置详情
  ANNOUNCEMENT_MANAGE_PUBLICITY_DETAIL:
    '/operate-center/notice-announcement/announcement-manage/publicity/detail', // 公告管理 已发布详情
  ANNOUNCEMENT_MANAGE_HISTORY_DETAIL:
    '/operate-center/notice-announcement/announcement-manage/history/detail', // 公告管理 历史详情
  SUPPLIER_MANAGE_INFORMATION_ENTRY:
    '/operate-center/supplier/manage/information-entry', //  运营商管理 信息录入
  SUPPLIER_MANAGE_INFORMATION_DETAIL:
    '/operate-center/supplier/manage/information-manage-detail', //  运营商管理 信息管理详情
  SUPPLIER_MANAGE_APPROVE_DETAIL:
    '/operate-center/supplier/manage/approve-manage-detail', //  运营商管理 审批管理详情
  SUPPLIER_PLATFORM_CREATE: '/operate-center/supplier/platform/create', // 国际公司创建云平台
  SUPPLIER_PLATFORM_DETAIL: '/operate-center/supplier/platform/detail', // 国际公司云平台详情
  SUPPLIER_POOL_CREATE: '/operate-center/supplier/pool/create', // 国际公司创建云平台
  SUPPLIER_POOL_DETAIL: '/operate-center/supplier/pool/detail', // 国际公司云平台详情
  SUPPLIER_RESOURCE_ALIYUN_DETAIL:
    '/operate-center/supplier/resource/aliyun/detail', // 国际公司阿里云资源详情
  SUPPLIER_RESOURCE_AMAZON_DETAIL:
    '/operate-center/supplier/resource/amazon/detail', // 国际公司亚马逊资源详情
  SUPPLIER_ACCOUNT_ROLE_AUTH: '/operate-center/supplier/account/role/auth' // 国际公司角色授权
}
