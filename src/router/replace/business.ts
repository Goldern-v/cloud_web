export const replaceBusinessPath = (path: string): string => {
  let result = ''
  switch (path) {
    // 我的工单
    case JumpEnum.MINE_WORK_ORDER_WAIT_DETAIL:
    case JumpEnum.MINE_WORK_ORDER_FINISHED_DETAIL:
      result = PathEnum.MINE_WORK_ORDER_LIST
      break
    // 我的订单
    case JumpEnum.MINE_ORDER_WAIT_DETAIL:
    case JumpEnum.MINE_ORDER_FINISHED_DETAIL:
      result = PathEnum.MINE_ORDER_LIST
      break
    // 历史订单
    case JumpEnum.HISTORY_ORDER_DETAIL:
      result = PathEnum.HISTORY_ORDER_LIST
      break
    // vdc管理
    case JumpEnum.VDC_MANAGE_DETAIL:
      result = PathEnum.VDC_MANAGE_LIST
      break
    // 项目管理
    case JumpEnum.PROJECT_MANAGE_DETAIL:
      result = PathEnum.PROJECT_MANAGE_LIST
      break
    // 用户管理
    case JumpEnum.USER_MANAGE_DETAIL:
      result = PathEnum.USER_MANAGE_LIST
      break
    // 子用户管理
    case JumpEnum.SUB_ACCOUNT_DETAIL:
      result = PathEnum.SUB_ACCOUNT_LIST
      break
    // 资源标签
    case JumpEnum.RESOURCE_TAG_CREATE:
      result = PathEnum.RESOURCE_TAG_LIST
      break
    // AD/LDAP
    case JumpEnum.AD_LDAP_CREATE:
      result = PathEnum.AD_LDAP_LIST
      break
    //角色管理
    case JumpEnum.ROLE_CREATE:
      result = PathEnum.ROLE_LIST
      break
    default:
      result = path
      break
  }
  return result
}

// 运维中心列表菜单
const PathEnum = {
  MINE_WORK_ORDER_LIST: '/business-center/work-order/mine/list', // 我的工单
  MINE_ORDER_LIST: '/business-center/order-manage/mine/list', // 我的订单
  HISTORY_ORDER_LIST: '/business-center/order-manage/history/list', // 历史订单
  VDC_MANAGE_LIST: '/business-center/organization-manage/vdc-manage/list', // vdc管理
  PROJECT_MANAGE_LIST:
    '/business-center/organization-manage/project-manage/list', // 项目管理
  USER_MANAGE_LIST: '/business-center/organization-manage/user-manage/list', // 用户管理
  SUB_ACCOUNT_LIST: '/business-center/organization-manage/sub-account-manage/list', // 子用户管理
  RESOURCE_TAG_LIST: '/business-center/tag-manage/resource-tag/index', // 资源标签
  AD_LDAP_LIST: '/business-center/system-config/ad-ldap/list', // AD/LDAP
  ROLE_LIST: '/business-center/organization-manage/role-manage/list' // 角色管理
}

// 运维中心跳转菜单
const JumpEnum = {
  MINE_WORK_ORDER_WAIT_DETAIL: '/business-center/work-order/mine/wait/detail', // 我的工单待办工单详情
  MINE_WORK_ORDER_FINISHED_DETAIL:
    '/business-center/work-order/mine/finished/detail', // 我的工单已办工单详情
  MINE_ORDER_WAIT_DETAIL: '/business-center/order-manage/mine/wait/detail', // 我的订单待办订单详情
  MINE_ORDER_FINISHED_DETAIL:
    '/business-center/order-manage/mine/finished/detail', // 我的订单已办订单详情
  HISTORY_ORDER_DETAIL: '/business-center/order-manage/history/detail', // 历史订单详情
  VDC_MANAGE_DETAIL: '/business-center/organization-manage/vdc-manage/detail', // vdc管理详情
  PROJECT_MANAGE_DETAIL:
    '/business-center/organization-manage/project-manage/detail', // 项目管理详情
  USER_MANAGE_DETAIL: '/business-center/organization-manage/user-manage/detail', // 用户管理详情
  SUB_ACCOUNT_DETAIL: '/business-center/organization-manage/sub-account-manage/detail', // 子用户管理详情
  RESOURCE_TAG_CREATE: '/business-center/tag-manage/resource-tag/create', // 新建资源标签
  AD_LDAP_CREATE: '/business-center/system-config/ad-ldap/create', // 新建AD/LDAP
  ROLE_CREATE: '/business-center/organization-manage/role-manage/create' // 新建角色
}
