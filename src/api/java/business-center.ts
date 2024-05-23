import service from '@/utils/request'
import { iams, api, bill, bpm } from './prefix'
/**
 * 业务中心
 */
type Api = (typeof Api)[keyof typeof Api]
const Api = {
  VDC_LIST: `${iams}/vdc/page`, // vdc列表
  VDC: `${iams}/vdc`, // get:vdc详情 post:新增vdc put:编辑vdc delete:删除vdc
  VDC_DETAIL_USER_BUDGET: `${bill}/vdc/user/budget`, // VDC详情-get查询用户预算 post新增/编辑用户预算
  VDC_DETAIL_USER_LIST: `${iams}/sys/user/page`, // VDC详情-用户列表
  VDC_DETAIL_USER: `${iams}/sys/user`, // VDC详情-post创建用户 put编辑用户
  VDC_DETAIL_USER_EVENT: `${iams}/vdc/user`, // VDC详情-post绑定用户 delete删除用户
  VDC_DETAIL_NAME_NORMS_LIST: `${api}/vdc/res/name/norms/page`, // VDC详情-命名规范列表
  VDC_DETAIL_NAME_NORMS_SUFFIX: `${api}/vdc/res/name/norms/suffix`, // VDC详情-get命名规范后缀列表 post创建命名规范后缀
  VDC_DETAIL_NAME_NORMS: `${api}/vdc/res/name/norms`, // VDC详情-post新增命名规范 put编辑命名规范 delete删除命名规范
  VDC_DETAIL_PARENT_BUDGET: `${bill}/vdc/budget/parent`, //  VDC详情-查询上级vdc预算
  VDC_DETAIL_BUDGET: `${bill}/vdc/budget`, // VDC详情-get查询当前vdc预算 post新增vdc预算 put编辑vdc预算
  VDC_DETAIL_QUOTA: `${api}/vdc/quota`, // VDC详情-get资源配额列表
  VDC_DETAIL_QUOTA_EDIT: `${api}/vdc/quota/opt`, // VDC详情-辑资源配额
  VDC_DETAIL_COST_LIST: `${iams}/vdc/cost`, // VDC详情-成本中心列表
  PROJECT_MANAGE_PAGE: `${iams}/vdc/project/page`, // 项目管理列表(分页)
  PROJECT_MANAGE_LIST: `${iams}/vdc/project`, // 项目管理列表
  PROJECT_MANAGE: `${iams}/vdc/project`, // post新增项目 put修改项目 delete删除项目 get项目详情 unbind后缀查询未绑定
  PROJECT_MANAGE_DETAIL_USER_LIST: `${iams}/vdc/project/user/page`, // 项目详情-用户列表
  PROJECT_MANAGE_DETAIL_USER: `${iams}/vdc/project/user`, // 项目详情-post绑定用户列表 delete删除用户列表
  PROJECT_BIND_RESOURCE: `${api}/resource/group/project/batch`, // 项目绑定资源
  PROJECT_UNBIND_RESOURCE: `${api}/resource/group/project`, // 项目解绑资源
  PROJECT_BIND_RESOURCE_GROUP: `${api}/resource/group/project`, // 项目绑定资源组列表
  VDC_USER_LIST: `${iams}/vdc/user`, //根据vdc筛选用户
  PROJECT_USER_LIST: `${iams}/vdc/project/user`, //根据项目筛选用户
  ORDER_LIST: `${api}/order/page/list`, //代办订单
  ORDER_DETAIL: `${api}/order/detail`, //代办订单
  ORDER_ITEMS: `${api}/order/items`, //订单子项列表
  CANCEL_ORDER: `${api}/order/status`, //取消订单
  AUDIT_ORDER: `${bpm}/process-instance/getProcessInstanceIdAndProcessDefinitionId`, // 待审批详情
  PAYMENT_ORDER: `${api}/order/commit`, //支付订单/订单提交
  MERGE_PAYMENTS: `${api}/order/batch-commit`, //合并支付
  RESOURCE_LABEL_PAGE: `${api}/infrastructure/label/page`, //资源标签列表(分页)
  RESOURCE_LABEL_LIST: `${api}/infrastructure/label/own/list`, //资源标签列表 (不分页)
  VDC_LABEL_LIST: `${api}/infrastructure/label/vdc/page`, //VDC标签列表
  RESOURCE_LABEL_CREATE: `${api}/infrastructure/label/addList`, //创建资源标签
  RESOURCE_LABEL_UPDATE: `${api}/infrastructure/label/update`, //修改资源标签
  RESOURCE_LABEL_DELETE: `${api}/infrastructure/label/delete`, //删除资源标签
  RESOURCE_LABEL_BATCH_DELETE: `${api}/infrastructure/label/list/delete`, //批量删除资源标签
  RESOURCE_LABEL_BIND_RESOURCE: `${api}/infrastructure/label/resource/bind`, //资源绑定标签
  RESOURCE_LABEL_UNBIND_RESOURCE: `${api}/infrastructure/label/resource/unbind`, //资源解绑标签
  RESOURCE_TYPE_LIST: `${api}/infrastructure/label/resource/type`, //查询区域下可绑定资源类型
  RESOURCE_LABEL_UNBIND_RESOURCE_LIST: `${api}/infrastructure/label/resource/unbind/list`, //可绑定资源(标签未关联的资源)
  RESOURCE_LABEL_BIND_RESOURCE_LIST: `${api}/infrastructure/label/resource/bind/list`, //查询标签相关联的资源
  EDIT_USER_PWD: `${iams}/sys/user/password/unlimited`, //修改用户密码
  USER_DISABLED: `${iams}/sys/user/disable`, //停用用户
  USER_ENABLED: `${iams}/sys/user/enable`, //启用用户
  USER_OPERATE: `${iams}/sys/user`, //用户操作
  USER_RELATED_PROJECT: `${iams}/vdc/project/user/project/page`, //用户关联项目列表
  USER_RELATED_ROLE: `${iams}/sys/role/page/user`, //用户关联角色列表
  USER_RELATED_VDC: `${iams}/vdc/page`, //用户关联vdc列表
  USER_RELATED_BUDGET_QUOTA: `${bill}/vdc/budget/list`, //用户关联预算配额列表
  ROLE_CLASSIFY: `${iams}/sys/role/type`, //角色类别
  ROLE_PAGE: `${iams}/sys/role/page`, //不同类别角色列表(分页)
  ROLE_LIST: `${iams}/sys/role/list`, //不同类别角色列表(不分页)
  ROLE_CONFIG_TEMPLATE: `${iams}/sys/role/menu/page`, //权限配置模版
  ROLE_INFO: `${iams}/sys/role`, //角色详情(get查询权限 post新增角色 put编辑角色 delete删除角色)
  ROLE_BIND: `${iams}/sys/role/page/user`, // 查询所有角色并标记当前用户绑定的角色
  ROLE_BIND_USER: `${iams}/sys/role/page/bind/user`, // 查询用户绑定的角色
  SUB_ACCOUNT: `${api}/sub/account`, // post:创建子账户 delete:删除子账户 get:查询子账户下的授权账户
  SUB_ACCOUNT_AUTH: `${api}/sub/account/auth` // 子用户授权用户
}
/**
 * vdc管理
 */
// vdc列表
export const getVdcListApi = Api.VDC_LIST
// vdc详情
export const getVdcDetail = (id: string) => {
  return service.get(`${Api.VDC}/${id}`)
}
// 新增vdc
export const addVdcApi = (data: any) => {
  return service.post(Api.VDC, data)
}
// vdc详情
export const vdcDetailApi = (id: any) => {
  return service.get(`${Api.VDC}/${id}`)
}
// 编辑vdc
export const editVpcApi = (data: any) => {
  return service.put(Api.VDC, data)
}
// 删除vdc
export const deleteVdcUrl = Api.VDC
export const deleteVdcApi = (id: any) => {
  return service.delete(`${deleteVdcUrl}/${id}`)
}
/**
 * 用户
 */
// VDC详情 查询用户预算
export const getVdcUserBudgetApi = (id: any) => {
  return service.get(`${Api.VDC_DETAIL_USER_BUDGET}?vdcId=${id}`)
}
// 查询用户列表
export const getUserListUrl = Api.VDC_DETAIL_USER_LIST
export const getUserList = (params: any) => {
  return service.get(getUserListUrl, { params })
}
// VDC详情 新增用户预算
export const addVdcUserBudgetApi = (data: any) => {
  return service.post(Api.VDC_DETAIL_USER_BUDGET, data)
}
// VDC详情 编辑用户预算
export const editVdcUserBudgetApi = (data: any) => {
  return service.post(Api.VDC_DETAIL_USER_BUDGET, data)
}
// VDC详情 创建用户
export const addVdcUserApi = (data: any) => {
  return service.post(Api.VDC_DETAIL_USER, data)
}
// VDC详情 编辑用户
export const editVdcUserApi = (data: any) => {
  return service.put(Api.VDC_DETAIL_USER, data)
}
// VDC详情 绑定用户
export const bindVdcUserApi = (data: any) => {
  return service.post(Api.VDC_DETAIL_USER_EVENT, data)
}
// VDC详情 删除用户
export const deleteVdcUserUrl = Api.VDC_DETAIL_USER_EVENT
export const deleteVdcUserApi = (data: any) => {
  return service.delete(
    `${deleteVdcUserUrl}?vdcId=${data.vdcId}&userIds=${data.userIds}`
  )
}
//根据vdc筛选用户
export const getUserBasedOnVdc = (id: any) => {
  return service.get(`${Api.VDC_USER_LIST}?vdcIds=${id}`)
}
//根据项目筛选用户
export const getUserBasedOnProject = (id: any) => {
  return service.get(`${Api.PROJECT_USER_LIST}?projectIds=${id}`)
}
/**
 * 命名规范
 */
// 命名规范列表查询
export const getNormsListApi = Api.VDC_DETAIL_NAME_NORMS_LIST
// VDC详情 命名规范后缀列表查询
export const getVdcSuffixApi = (id: any) => {
  return service.get(`${Api.VDC_DETAIL_NAME_NORMS_SUFFIX}?vdcId=${id}`)
}
// VDC详情 命名规范 新增命名规范
export const addVdcNameNormApi = (data: any) => {
  return service.post(Api.VDC_DETAIL_NAME_NORMS, data)
}
// VDC详情 命名规范 编辑命名规范
export const editVdcNameNormApi = (data: any) => {
  return service.put(Api.VDC_DETAIL_NAME_NORMS, data)
}
// VDC详情 命名规范 删除命名规范
export const deleVdcNameNormApi = (data: any) => {
  return service.delete(
    `${Api.VDC_DETAIL_NAME_NORMS}/${data.id}?vdcId=${data.vdc.id}&version=${data.version}`
  )
}
// VDC详情  命名规范创建后缀
export const addVdcSuffixApi = (data: any) => {
  return service.post(Api.VDC_DETAIL_NAME_NORMS_SUFFIX, data)
}
// VDC详情 查询上级vdc预算
export const getVdcParentBudgetApi = (id: any) => {
  return service.get(`${Api.VDC_DETAIL_PARENT_BUDGET}?vdcId=${id}`)
}
// VDC详情 查询当前vdc预算
export const getCurrentVdcBudgetApi = (params: any) => {
  return service.get(`${Api.VDC_DETAIL_BUDGET}`, { params })
}
// VDC详情 新增vdc预算
export const addVdcBudgetApi = (data: any) => {
  return service.post(Api.VDC_DETAIL_BUDGET, data)
}
// VDC详情 更新vdc预算
export const editVdcBudgetApi = (data: any) => {
  return service.put(Api.VDC_DETAIL_BUDGET, data)
}
/**
 * 资源配额
 */
// VDC详情 资源配额列表
export const getVdcQuotaApi = Api.VDC_DETAIL_QUOTA
// VDC详情 更新资源配额
export const editVdcQuotaApi = (data: any) => {
  return service.post(Api.VDC_DETAIL_QUOTA_EDIT, data)
}
/**
 * 成本中心
 */
// 成本中心列表
export const getCostListAPi = Api.VDC_DETAIL_COST_LIST
/**
 * 项目管理
 */
// 项目列表 分页
export const projectListApi = Api.PROJECT_MANAGE_PAGE
//项目列表  下拉
export const queryProjectListApi = (params: any = {}) => {
  return service.get(Api.PROJECT_MANAGE_LIST, { params })
}
// 新增项目
export const addProjectApi = (data: any) => {
  return service.post(Api.PROJECT_MANAGE, data)
}
// 修改项目
export const editProjectApi = (data: any) => {
  return service.put(Api.PROJECT_MANAGE, data)
}
// 删除项目
export const deleteProjectUrl = Api.PROJECT_MANAGE
export const deleteProjectApi = (id: any) => {
  return service.delete(`${deleteProjectUrl}/${id}`)
}
// 项目详情
export const projectDetailApi = (id: any) => {
  return service.get(`${Api.PROJECT_MANAGE}/${id}`)
}
// 项目详情  绑定用户列表
export const projectBindUserApi = (data: any) => {
  return service.post(Api.PROJECT_MANAGE_DETAIL_USER, data)
}

// 项目详情  绑定资源
export const projectBindResourceApi = (data: any) => {
  return service.post(Api.PROJECT_BIND_RESOURCE, data)
}
// 项目详情  解绑资源
export const projectUnbindResourceApi = (params: any) => {
  return service.delete(`${Api.PROJECT_UNBIND_RESOURCE}`, { params })
}
// 项目详情 绑定资源组
export const projectBindResourceGroup = (projectId: any) => {
  return service.get(`${Api.PROJECT_BIND_RESOURCE_GROUP}/${projectId}`)
}
// 项目详情  查询用户列表
export const getProjectUserListApi = Api.PROJECT_MANAGE_DETAIL_USER_LIST
// 项目详情  查询未绑定用户列表
export const getProjectUnbindUserListApi = Api.PROJECT_MANAGE
// 项目详情 删除用户列表
export const deleteProjectUserUrl = Api.PROJECT_MANAGE_DETAIL_USER
export const deleteProjectUserApi = (data: any) => {
  return service.delete(
    `${deleteProjectUserUrl}?id=${data.id}&userIds=${data.userIds}`
  )
}

/**
 * 订单管理
 */
//代办订单列表
export const getOrderList = Api.ORDER_LIST
//订单详情
export const queryOrderDetail = (params: any) => {
  return service.get(Api.ORDER_DETAIL, { params })
}
//订单子项列表
export const getOrderItemsList = Api.ORDER_ITEMS
// 取消订单
export const queryCancelOrder = (orderId: any) => {
  return service.put(Api.CANCEL_ORDER, orderId)
}
// 订单支付
export const queryPaymentOrder = (orderId: any) => {
  return service.post(Api.PAYMENT_ORDER, orderId)
}
// 待审批详情
export const getAuditOrder = (params: any) => {
  return service.get(Api.AUDIT_ORDER, { params })
}
// 合并支付
export const getMergePayments = (params: any) => {
  return service.post(Api.MERGE_PAYMENTS, params.orderIds)
}

/**
 * 标签管理
 */
//资源标签列表(分页)
export const getResourceLabelList = Api.RESOURCE_LABEL_PAGE
//资源标签列表(不分页)
export const queryResourceLabelList = () => {
  return service.get(Api.RESOURCE_LABEL_LIST)
}
//vdc标签列表
export const getVdcLabelList = Api.VDC_LABEL_LIST

//创建资源标签
export const createResourceLabel = (data: any) => {
  return service.post(Api.RESOURCE_LABEL_CREATE, data)
}
//修改资源标签
export const updateResourceLabel = (data: any) => {
  return service.put(Api.RESOURCE_LABEL_UPDATE, data)
}
//删除资源标签
export const deleteResourceLabel = Api.RESOURCE_LABEL_DELETE
//批量删除标签
export const batchDeleteResourceLabel = (ids: any) => {
  return service.delete(`${Api.RESOURCE_LABEL_BATCH_DELETE}?ids=${ids}`)
}
//查询选定区域下资源类型
export const queryResourceTypeList = () => {
  return service.get(Api.RESOURCE_TYPE_LIST)
}
//资源绑定标签
export const resourceLabelBind = (data: any) => {
  return service.post(Api.RESOURCE_LABEL_BIND_RESOURCE, data)
}
//资源解绑标签
export const resourceLabelUnbind = (data: any) => {
  return service.delete(Api.RESOURCE_LABEL_UNBIND_RESOURCE, { data })
}
//标签未关联的资源
export const queryUnbindResourceList = Api.RESOURCE_LABEL_UNBIND_RESOURCE_LIST
//标签关联的资源
export const queryBindResourceList = Api.RESOURCE_LABEL_BIND_RESOURCE_LIST

/**
 * 用户管理
 */
//post 创建用户  put修改用户
export const useUserSubmitApi = (dataForm: any) => {
  if (dataForm.id) {
    return service.put(`${Api.USER_OPERATE}`, dataForm)
  } else {
    return service.post(`${Api.USER_OPERATE}`, dataForm)
  }
}
//修改用户密码
export const editUserPwd = (data: any) => {
  return service.put(`${Api.EDIT_USER_PWD}`, data)
}
//禁用用户
export const forbiddenUser = (data: any) => {
  return service.put(`${Api.USER_DISABLED}`, data)
}
//启用用户
export const enabledUser = (data: any) => {
  return service.put(`${Api.USER_ENABLED}`, data)
}
//移除用户
export const removeUser = (data: any) => {
  return service.delete(`${Api.USER_OPERATE}`, { data })
}
//用户关联的角色列表
export const userRelatedRoleList = Api.USER_RELATED_ROLE
//用户关联预算配额列表
export const userRelatedBudgetQuota = Api.USER_RELATED_BUDGET_QUOTA
//用户关联的项目列表
export const userRelatedProject = Api.USER_RELATED_PROJECT
//用户绑定项目
export const userRelateProject = (userId: string, data: any) => {
  return service.post(`${Api.USER_OPERATE}/${userId}/project`, data)
}
//用户解绑项目操作
export const userRemoveProject = (userId: string, data: any) => {
  return service.delete(`${iams}/sys/user/${userId}/project`, { data })
}
//用户绑定Vdc操作
export const userRelateVdc = (userId: string, params: any) => {
  return service.get(`${Api.USER_OPERATE}/${userId}/vdc`, { params })
}
//用户绑定角色操作
export const userRelateRole = (userId: string, data: any) => {
  return service.post(`${Api.USER_OPERATE}/${userId}/role`, data)
}
//用户解绑角色操作
export const userRemoveRole = (userId: string, data: any) => {
  return service.delete(`${iams}/sys/user/${userId}/role`, { data })
}

/**
 * 角色管理
 */
//角色类别
export const queryRoleClassify = () => {
  return service.get(Api.ROLE_CLASSIFY)
}
//不同类别下角色列表
export const getRolePage = Api.ROLE_PAGE
export const queryRoleList = (params: any) => {
  return service.get(Api.ROLE_LIST, { params })
}
//权限配置模版
export const queryRoleConfigTemplate = Api.ROLE_CONFIG_TEMPLATE
//角色包含权限
export const queryRoleLimits = (params: any) => {
  return service.get(`${Api.ROLE_INFO}/${params.roleId}`)
}
//创建角色
export const createRole = (data: any) => {
  return service.post(`${Api.ROLE_INFO}`, data)
}
//删除角色包含权限
export const deleteRole = Api.ROLE_INFO
//编辑角色
export const editRole = (data: any) => {
  return service.put(`${Api.ROLE_INFO}`, data)
}
// 查询所有角色并标记当前用户绑定的角色
export const roleBindPageUrl = Api.ROLE_BIND
/**
 * 子账户管理
 */
// 创建子账户
export const subAccountCreate = (data: any) => {
  return service.post(Api.SUB_ACCOUNT, data)
}
// 删除子账户
export const subAccountDelete = Api.SUB_ACCOUNT
// 查询子账户下的授权账户
export const subAccountRoleList = (id: string) => {
  return service.get(`${Api.SUB_ACCOUNT}/${id}/auth`)
}
// 子账户授权用户
export const subAccountAuth = (data: any) => {
  return service.post(Api.SUB_ACCOUNT_AUTH, data)
}
// 查询子账户未绑定的云平台
export const subAccountUnbindPlatform = (id: string) => {
  return service.get(`${Api.SUB_ACCOUNT}/${id}/unbind/platform`)
}
// 查询用户绑定的角色（只返回绑定的角色）
export const roleBindUserUrl = Api.ROLE_BIND_USER

