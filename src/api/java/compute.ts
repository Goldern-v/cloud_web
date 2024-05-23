import service from '@/utils/request'
import { api, bill } from './prefix'

/**
 * 计算模块
 */
type Api = (typeof Api)[keyof typeof Api]
const Api = {
  SPEC_LIST: `${api}/flavor/list`, // 规格列表
  NETWORK_LIST: `${api}/vpc/list`, // 网络列表(下拉框)
  SUBNET_LIST: `${api}/subnet/list`, // 子网列表(下拉框)
  SAFE_GROUP_LIST: `${api}/securitygroup/list`, // 安全组列表(下拉框)
  SAFE_GROUP_RULE_LIST: `${api}/securitygroup/rule/list`, // 安全组规则列表
  EIP_LIST: `${api}/eip/list`, // 弹性IP列表(下拉框)
  CLOUD_BACKUP_REPOSITORY: `${api}/instance/reserved/list`, // 云备份存储库列表(下拉框)
  CLOUD_BACKUP_POLICY: `${api}/instance/reserved/policy/list`, // 云备份策略列表(下拉框)
  KEY_PAIR_LIST: `${api}/keypair/list`, // 密钥对列表(下拉框)
  BAND_WIDTH_LIST: `${api}/bandwidth/list`, // 带宽列表(下拉框)
  CLOUD_HOST_GROUP_LIST: `${api}/instance/group/list`, // 云主机组列表(下拉框)
  CLOUD_HOST_CREATE: `${api}/instance/create`, // 创建云主机
  CLOUD_HOST_COMMIT: `${api}/instance/commit`, // 提交云主机订单
  CLOUD_HOST_PAGE: `${api}/instance/page`, // 云主机列表
  CLOUD_HOST_LIST: `${api}/instance`, // 云主机列表不分页
  CLOUD_HOST_DELETE: `${api}/instance/delete`, // 云主机彻底删除 (按需从回收站销毁)
  CLOUD_HOST_UNSUBSCRIBE: `${api}/instance/unsubscribe`, // 云主机退订 (包年包月)
  CLOUD_HOST_RECYCLE: `${api}/instance/recycle`, // 云主机入回收站
  CLOUD_HOST_RECOVER: `${api}/instance/recover`, // 云主机从回收站恢复
  CLOUD_HOST_RESIZE: `${api}/instance/resize`, // 云主机变更
  CLOUD_HOST_SPEC_TYPE: `${api}/flavor/specs/type`, // 升配降配 查询规格类型
  CLOUD_HOST_SPEC_UPGRADE: `${api}/flavor/rise/list`, // 云主机升级规格列表
  CLOUD_HOST_SPEC_REDUCE: `${api}/flavor/decline/list`, // 云主机降配规格列表
  CLOUD_HOST_VARIATION: `${api}/instance/resize`, // 云主机变配(升降)
  CLOUD_HOST_ORDER_SUBMIT: `${bill}/prices/direct/payment`, // 云主机提交订单(变配、退订)
  CLOUD_HOST_RENEW: `${api}/instance/renew`, // 云主机续订
  CLOUD_HOST_START: `${api}/instance/boot`, // 云主机开机
  CLOUD_HOST_RESTART: `${api}/instance/reboot `, // 云主机重启
  CLOUD_HOST_SHUTDOWN: `${api}/instance/shutdown`, // 云主机关机
  CLOUD_HOST_DETAIL: `${api}/instance/details`, // 云主机详情
  CLOUD_HOST_EDIT: `${api}/instance/edit`, // 更改云主机信息
  CLOUD_HOST_EIP_DETAIL: `${api}/eip/detail/bindinstance`, // 云主机绑定弹性ip详情查询
  CLOUD_HOST_NIC_DETAIL: `${api}/nic/detail/bindinstance`, // 云主机绑定弹性网卡详细查询
  CLOUD_HOST_SECURITY_GROUP_DETAIL: `${api}/securitygroup/detail/bindinstance`, // 云主机绑定安全组详情查询
  CLOUD_HOST_RESET_PASSWORD: `${api}/instance/pwd`, // 重置云主机密码
  CLOUD_HOST_REMOTE_LOGIN: `${api}/instance/remote/login`, // 云主机远程登录
  IMAGE_PAGE: `${api}/image/page`, // 镜像分页列表
  IMAGE_PUBLIC_LIST: `${api}/image/list`, // 公有镜像列表(下拉框)
  IMAGE_PRIVATE_LIST: `${api}/image/private/list`, // 私有镜像列表
  MIRROR: `${api}/image`, // 镜像-delete:删除 put:编辑 get:镜像详情
  PRIVATE_MIRROR_CREATE: `${api}/image/system`, // 私有镜像创建
  MIRROR_SHARE: `${api}/image/share`, // 共享镜像
  MIRROR_BATCH_DELETE: `${api}/image/batch`, // 镜像批量删除
  MIRROR_SHARE_RELATION: `${api}/image/share/relation`, // 查询私有镜像的共享关系
  MIRROR_SHARE_CANCEL: `${api}/image/share/cancel`, // 取消共享镜像
  MIRROR_SHARE_OPERATION: `/api/image/share/operation`, // 接受或拒绝共享镜像
  FLAVOR_VALIDATION: `${api}/flavor/validation`, // 根据区域和计费模式校验规格实例
  KEY_PAIR_PAGE: `${api}/keypair/list/page`, // 密钥对分页列表查询
  KEY_PAIR_CREATE: `${api}/keypair/createKeypair`, // 密钥对创建
  KEY_PAIR_DELETE: `${api}/keypair/deleteKeypair`, // 删除密钥对
  INSTANCE_GROUP_PAGE: `${api}/instance/group/page/list`, // 云主机组分页列表查询
  INSTANCE_GROUP_CREATE: `${api}/instance/group/create`, // 云主机组创建
  INSTANCE_GROUP_DELETE: `${api}/instance/group/delete`, // 删除云主机组
  INSTANCE_GROUP_DETAIL: `${api}/instance/group/detail`, // 云主机组详情查询
  INSTANCE_GROUP_AVAILABLE_INSTANCE: `${api}/instance/group/availableInstance`, // 查询可绑定云主机组的云主机
  INSTANCE_GROUP_Add_SERVER_GROUP: `${api}/instance/group/addServerGroupMember`, // 云主机组添加云主机
  INSTANCE_GROUP_REMOVE_SERVER_GROUP: `${api}/instance/group/removeServerGroupMember` // 云主机移除云主机
}

/**
 * 云主机
 */
// 规格列表
export const specListUrl = Api.SPEC_LIST
export const querySpecList = (params: any) => {
  return service.get(specListUrl, { params })
}
// 公有镜像列表(下拉框)
export const queryImageList = (params: any) => {
  return service.get(Api.IMAGE_PUBLIC_LIST, { params })
}
// 网络列表(下拉框)
export const queryNetworkList = (params: any) => {
  return service.get(Api.NETWORK_LIST, { params })
}
// 创建云主机
export const cloudHostCreate = (data: any) => {
  return service.post(Api.CLOUD_HOST_CREATE, data)
}
// 提交云主机订单
export const cloudHostCommit = (orderId: string) => {
  return service.post(`${Api.CLOUD_HOST_COMMIT}?orderId=${orderId}`)
}
// 云主机列表
export const cloudHostUrl = Api.CLOUD_HOST_PAGE
export const queryCloudHostPage = (params: any) => {
  return service.get(cloudHostUrl, { params })
}
// 云主机列表不分页
export const cloudHostListUrl = Api.CLOUD_HOST_LIST
export const queryCloudHostList = (params: any) => {
  return service.get(cloudHostListUrl, { params })
}
// 云主机删除(按需)
export const deleteCloudHostUrl = Api.CLOUD_HOST_DELETE
export const deleteCloudHost = (data: any) => {
  return service.put(`${deleteCloudHostUrl}`, data)
}
//云主机退订(包年包月)
export const unsubscribeCloudHost = (data: any) => {
  return service.delete(`${Api.CLOUD_HOST_UNSUBSCRIBE}`, { data })
}
//云主机进回收站
export const recycleCloudHostUrl = Api.CLOUD_HOST_RECYCLE
export const recycleCloudHost = (data: any) => {
  return service.put(`${recycleCloudHostUrl}`, data)
}
//从回收站恢复云主机
export const recoverCloudHost = (data: any) => {
  return service.put(`${Api.CLOUD_HOST_RECOVER}`, data)
}
// 云主机变更
export const upgradeCloudHost = (data: any) => {
  return service.post(
    `${Api.CLOUD_HOST_RESIZE}?uuid=${data.uuid}&flavor=${data.flavor}`
  )
}
// 云主机续订
export const renewCloudHost = (data: any) => {
  return service.put(Api.CLOUD_HOST_RENEW, data)
}
// 子网
export const querySubnet = (params: any) => {
  return service.get(Api.SUBNET_LIST, { params })
}
// 安全组列表(下拉框)
export const querySafeGroupList = (params: any) => {
  return service.get(Api.SAFE_GROUP_LIST, { params })
}
// 安全组规则列表
export const safeGroupRuleUrl = Api.SAFE_GROUP_RULE_LIST
export const querySafeGroupRule = (params: any) => {
  return service.get(safeGroupRuleUrl, { params })
}
// 弹性IP列表(下拉框)
export const eipListUrl = Api.EIP_LIST
export const queryEipList = (params: any) => {
  return service.get(eipListUrl, { params })
}
// 带宽列表(下拉框)
export const queryBandWidth = (params: any) => {
  return service.get(Api.BAND_WIDTH_LIST, { params })
}
// 密钥对(下拉框)
export const queryKeyPair = (params: any) => {
  return service.get(Api.KEY_PAIR_LIST, { params })
}
// 云备份存储库(下拉框)
export const queryCloudBackupRepository = (params: any) => {
  return service.get(Api.CLOUD_BACKUP_REPOSITORY, { params })
}
// 云备份策略(下拉框)
export const queryCloudBackupPolicy = (params: any) => {
  return service.get(Api.CLOUD_BACKUP_POLICY, { params })
}
// 云主机组(下拉框)
export const queryCloudHostGroup = (params: any) => {
  return service.get(Api.CLOUD_HOST_GROUP_LIST, { params })
}
// 升配降配 查询规格类型
export const queryCloudHostSpecType = (params: any) => {
  return service.get(Api.CLOUD_HOST_SPEC_TYPE, { params })
}
// 云主机升级规格列表
export const hostSpecUpgradeUrl = Api.CLOUD_HOST_SPEC_UPGRADE
// 云主机降配规格列表
export const hostSpecReduceUrl = Api.CLOUD_HOST_SPEC_REDUCE
// 云主机变配
export const cloudHostVariation = (data: any) => {
  return service.put(`${Api.CLOUD_HOST_VARIATION}`, data)
}
// 云主机变配提交订单
export const submitCloudHostOrder = (data: any) => {
  return service.put(Api.CLOUD_HOST_ORDER_SUBMIT, data)
}
// 云主机开机
export const cloudHostStart = (data: any) => {
  return service.put(`${Api.CLOUD_HOST_START}`, data)
}
// 云主机重启
export const cloudHostRestart = (data: any) => {
  return service.put(`${Api.CLOUD_HOST_RESTART}`, data)
}
// 云主机关机
export const cloudHostShutdown = (data: any) => {
  return service.put(`${Api.CLOUD_HOST_SHUTDOWN}`, data)
}
// 重置云主机密码
export const cloudHostResetPwd = (data: any) => {
  return service.put(`${Api.CLOUD_HOST_RESET_PASSWORD}`, data)
}
//云主机远程登录
export const cloudHostRemoteLogin = (data: any) => {
  return service.put(`${Api.CLOUD_HOST_REMOTE_LOGIN}`, data)
}
//云主机详情
export const queryCloudHostDetail = (params: any) => {
  return service.get(Api.CLOUD_HOST_DETAIL, { params })
}
// 更改云主机信息
export const cloudHostEdit = (data: any) => {
  return service.put(`${Api.CLOUD_HOST_EDIT}`, data)
}
// 云主机绑定弹性ip详情
export const cloudHostEipDetail = (params: any) => {
  return service.get(Api.CLOUD_HOST_EIP_DETAIL, { params })
}
// 云主机绑定安全组详情查询
export const cloudHostSecurityDetail = (params: any) => {
  return service.get(Api.CLOUD_HOST_SECURITY_GROUP_DETAIL, { params })
}
// 云主机绑定弹性网卡详细查询
export const cloudHostNicDetail = (params: any) => {
  return service.get(Api.CLOUD_HOST_NIC_DETAIL, { params })
}
// 实例规格校验
export const validateFlavor = (data: any) => {
  return service.post(Api.FLAVOR_VALIDATION, data)
}
/**
 * 镜像服务
 */
// 镜像分页列表
export const mirrorPageUrl = Api.IMAGE_PAGE
export const mirrorPage = (params: any) => {
  return service.get(mirrorPageUrl, { params })
}
// 私有镜像创建
export const privateMirrorCreate = (data: any) => {
  return service.post(`${Api.PRIVATE_MIRROR_CREATE}`, data)
}
// 私有镜像列表(下拉框)
export const queryPrivateImageList = (params: any) => {
  return service.get(Api.IMAGE_PRIVATE_LIST, { params })
}
// 私有镜像
export const privateMirrorUrl = Api.MIRROR
// put:编辑
export const privateMirrorEdit = (data: any) => {
  return service.put(privateMirrorUrl, data)
}
// 镜像详情
export const privateMirrorDetail = (params: any) => {
  return service.get(`${privateMirrorUrl}/${params.id}`)
}
// 共享镜像
export const mirrorShare = (data: any) => {
  return service.put(Api.MIRROR_SHARE, data)
}
// 取消共享镜像
export const mirrorShareCancel = (data: any) => {
  return service.put(Api.MIRROR_SHARE_CANCEL, data)
}
// 镜像批量删除
export const mirrorBatchDelete = (data: any) => {
  return service.delete(`${Api.MIRROR_BATCH_DELETE}?ids=${data.ids}`)
}
// 查询私有镜像的共享关系
export const mirrorShareRelationUrl = Api.MIRROR_SHARE_RELATION
// 接受或拒绝共享镜像
export const mirrorShareOperation = (data: any) => {
  return service.put(Api.MIRROR_SHARE_OPERATION, data)
}
/**
 * 密钥对
*/
// 密钥对分页列表查询
export const keyPairPageUrl = Api.KEY_PAIR_PAGE
// 密钥对创建
export const keyPairCreate = (data: any) => {
  return service.post(Api.KEY_PAIR_CREATE, data)
}
// 删除密钥对
export const keyPairDelete = (data: any) => {
  return service.delete(Api.KEY_PAIR_DELETE, { data })
}
/**
 * 云主机组
*/
// 云主机组分页列表查询
export const instanceGroupPageUrl = Api.INSTANCE_GROUP_PAGE
// 云主机组创建
export const instanceGroupCreate = (data: any) => {
  return service.post(Api.INSTANCE_GROUP_CREATE, data)
}
// 删除云主机组
export const instanceGroupDelete = (data: any) => {
  return service.delete(Api.INSTANCE_GROUP_DELETE, { data })
}
// 云主机组详情查询
export const instanceGroupDetail = (params: any) => {
  return service.get(Api.INSTANCE_GROUP_DETAIL, { params })
}
// 查询可绑定云主机组的云主机
export const instanceGroupAvailableInstanceUrl = Api.INSTANCE_GROUP_AVAILABLE_INSTANCE
// 云主机组添加云主机
export const instanceGroupAddServerGroup = (data: any) => {
  return service.post(Api.INSTANCE_GROUP_Add_SERVER_GROUP, data)
}
// 云主机组移除云主机
export const instanceGroupRemoveServerGroup = (data: any) => {
  return service.post(Api.INSTANCE_GROUP_REMOVE_SERVER_GROUP, data)
}
