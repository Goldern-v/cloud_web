import service from '@/utils/request'
import { api } from './prefix'
/**
 * 网络模块
 */
type Api = (typeof Api)[keyof typeof Api]
const Api = {
  EXTERNAL_LIST: `${api}/vpc/external`, //外部网络列表
  VPC_PAGE: `${api}/vpc/page/list`, //vpc列表(分页)
  VPC_LIST: `${api}/vpc/list`, //vpc(下拉框)
  VPC_DETAIL: `${api}/vpc/detail`, //vpc详情信息
  VPC_OPERATE: `${api}/vpc`, //vpc(post创建 delete删除 put详情)
  SUBNET_PAGE: `${api}/subnet/page/list`, //子网列表(分页)
  SUBNET_LIST: `${api}/subnet/list`, //子网列表(下拉框)
  SUBNET_OPERATE: `${api}/subnet`, //子网(post创建 delete删除 put更新)
  SUBNET_DETAIL: `${api}/subnet/detail`, //子网详情信息
  EIP_PAGE: `${api}/eip/page/list`, //弹性IP列表(分页)
  EIP_LIST: `${api}/eip/list`, //弹性IP列表(不分页)
  EIP_CREATE: `${api}/eip/provision`, //弹性IP创建
  EIP_DETAIL: `${api}/eip/detail`, //弹性IP详情信息
  EIP_EDIT: `${api}/eip`, //修改弹性IP详情信息
  EIP_RENEW: `${api}/eip/renew`, //弹性IP续订
  EIP_BIND_INSTANCE: `${api}/eip/attachdefaultnic`, //弹性Ip绑定云主机操作
  EIP_BIND_INSTANCE_LIST: `${api}/eip/list/bindinstance`, //弹性Ip绑定云主机信息
  EIP_UNBIND_INSTANCE: `${api}/eip/detachdefaultnic`, //弹性Ip解绑云主机
  EIP_DELETE: `${api}/eip`, //删除弹性IP(按需)
  EIP_UNSUBSCRIBE: `${api}/eip/unsubscribe`, //退订弹性IP(包年包月)
  EIP_RESIZE: `${api}/eip/resize`, //修改带宽(弹性IP)
  SECURITY_GROUP_PAGE: `${api}/securitygroup/page/list`, //安全组列表(分页)
  SECURITY_GROUP_LIST: `${api}/securitygroup/list`, //安全组列表(不分页)
  SECURITY_GROUP_LIST_BY_INSTANCE: `${api}/securitygroup/list/bindflag`, //查询安全组绑定情况
  SECURITY_GROUP_CREATE: `${api}/securitygroup`, //安全组创建 /编辑
  SECURITY_GROUP_DELETE: `${api}/securitygroup/delete`, //安全组删除
  SECURITY_GROUP_DETAIL: `${api}/securitygroup/detail`, //安全组详情
  SECURITY_GROUP_RULE: `${api}/securitygroup/rule`, //安全组规则(post 创建 delete 删除)
  SECURITY_GROUP_RULE_LIST: `${api}/securitygroup/rule/page/list`, //安全组规则列表
  SECURITY_GROUP_MODEL_RULE: `${api}/securitygroup/rule/model`, //安全组模板规则列表
  SECURITY_GROUP_RELEVANCE_INSTANCE: `${api}/securitygroup/bindsecuritygrouptoinstances`, //安全组关联云主机
  SECURITY_GROUP_REMOVE_INSTANCE: `${api}/securitygroup/unbindsecuritygrouptoinstances`, //安全组解绑云主机
  SECURITY_GROUP_RELEVANCE_INSTANCE_LIST: `${api}/securitygroup/list/bindinstance`, //安全组已关联云主机列表
  SECURITY_GROUP_RELEVANCE_ASSIST_NIC: `${api}//securitygroup/bindnic`, //安全组关联辅助网卡
  SECURITY_GROUP_BIND_INSTANCE_GROUPS: `${api}/securitygroup/bindinstancetosecuritygroups`, // 云主机详情界面更改安全组
  SECURITY_GROUP_BIND_ASSIST_NIC_LIST: `${api}/securitygroup/list/bindNic`, // 安全组绑定的辅助网卡列表
  UNBIND_NET_CARD_LIST: `${api}/nic/details`, //未被弹性IP绑定的网卡(下拉框)
  ROUTE_TABLE_PAGE: `${api}/routetable/page`, //路由表列表(分页)
  ROUTE_TABLE_LIST: `${api}/routetable/list`, //路由表列表(不分页)
  ROUTE_TABLE_OPERATE: `${api}/routetable`, //路由表(post创建 put修改 delete删除)
  ROUTE_TABLE_DETAIL: `${api}/routetable/detail`, //路由表详情
  ROUTE_TABLE_ROUTE: `${api}/routetable/route`, //路由表路由(post 新增 delete 删除 put修改)
  ROUTE_TABLE_BIND_SUBNET: `${api}/routetable/bindsubnet`, //路由表绑定子网
  SUBNET_CHANGE_ROUTE_TABLE: `${api}/routetable/subnetbindroutetable`, //子网更换路由表
  NET_CARD_LIST: `${api}/nic/list`, //网卡(下拉框)
  NET_CARD_PAGE: `${api}/nic/page/list`, //弹性网卡列表(分页)
  ELASTIC_NIC: `${api}/nic`, //弹性网卡(post 创建 delete 删除 put 更新)
  ELASTIC_NIC_BATCH: `${api}/nic/batch`, //弹性网卡(批量操作)
  ELASTIC_NIC_DETAIL: `${api}/nic/detail`, //弹性网卡详情
  MAIN_NIC_BIND_ASSIST_NIC: `${api}/nic/detail/bindnic` //弹性网卡绑定的辅助网卡信息
}
/**
 * VPC
 */
//外部网络列表
export const queryExternalNetList = (params: any) => {
  return service.get(Api.EXTERNAL_LIST, { params })
}
//vpc列表(分页)
export const queryVpcPage = Api.VPC_PAGE
//vpc(下拉框)
export const queryVpcList = (params: any) => {
  return service.get(Api.VPC_LIST, { params })
}
//vpc详情
export const queryVpcDetail = (params: any = {}) => {
  return service.get(Api.VPC_DETAIL, { params })
}
//vpc创建
export const vpcCreate = (data: any) => {
  return service.post(Api.VPC_OPERATE, data)
}
//vpc删除
export const vpcDelete = (data: any) => {
  return service.delete(Api.VPC_OPERATE, { data })
}
//vpc修改
export const vpcEdit = (data: any) => {
  return service.put(Api.VPC_OPERATE, data)
}

/**
 * 子网
 */
//子网列表(分页)
export const querySubnetPage = Api.SUBNET_PAGE
//子网(下拉框)
export const subnetListUrl = Api.SUBNET_LIST
export const querySubnetList = (params: any) => {
  return service.get(Api.SUBNET_LIST, { params })
}
//子网创建
export const subnetCreate = (data: any) => {
  return service.post(Api.SUBNET_OPERATE, data)
}
//子网删除
export const subnetDelete = (data: any) => {
  return service.delete(Api.SUBNET_OPERATE, { data })
}
//更新子网
export const subnetEdit = (data: any) => {
  return service.put(Api.SUBNET_OPERATE, data)
}
//子网详情
export const querySubnetDetail = (params: any = {}) => {
  return service.get(Api.SUBNET_DETAIL, { params })
}

/**
 * 弹性IP
 */
//弹性IP列表(分页)
export const queryEipPage = Api.EIP_PAGE
export const queryEipList = Api.EIP_LIST
//弹性IP创建
export const eipCreate = (data: any) => {
  return service.post(Api.EIP_CREATE, data)
}
//弹性IP关联云主机操作
export const eipRelevanceInstance = (data: any) => {
  return service.put(Api.EIP_BIND_INSTANCE, data)
}
//弹性IP关联云主机信息
export const queryEipRelevanceInstanceInfo = (params: any) => {
  return service.get(Api.EIP_BIND_INSTANCE_LIST, { params })
}
//弹性IP解绑实例操作
export const eipUnbindInstance = (data: any) => {
  return service.put(Api.EIP_UNBIND_INSTANCE, data)
}
//弹性IP详情信息
export const queryEipDetail = (params: any) => {
  return service.get(Api.EIP_DETAIL, { params })
}
//修改弹性IP详情信息
export const editEip = (data: any) => {
  return service.put(Api.EIP_EDIT, data)
}
//弹性ip续订
export const renewEip = (data: any) => {
  return service.post(Api.EIP_RENEW, data)
}
//删除按需计费弹性IP
export const deleteOnDemandEip = (data: any) => {
  return service.delete(Api.EIP_DELETE, { data })
}
//退订包年包月弹性IP
export const unsubscribeEip = (data: any) => {
  return service.delete(Api.EIP_UNSUBSCRIBE, { data })
}
//修改带宽
export const eipResize = (data: any) => {
  return service.post(Api.EIP_RESIZE, data)
}

/**
 * 安全组
 */
// 安全组列表分页
export const querySafeGroupPage = Api.SECURITY_GROUP_PAGE
// 安全组列表不分页
export const safeGroupListUrl = Api.SECURITY_GROUP_LIST
export const querySafeGroupList = (params: any) => {
  return service.get(Api.SECURITY_GROUP_LIST, { params })
}
//通过实例id查询安全组列表
export const safeGroupListByInstanceUrl = Api.SECURITY_GROUP_LIST_BY_INSTANCE
export const querySafeGroupListByInstance = (params: any) => {
  return service.get(safeGroupListByInstanceUrl, { params })
}
//安全组创建
export const safeGroupCreate = (data: any) => {
  return service.post(Api.SECURITY_GROUP_CREATE, data)
}
//安全组编辑
export const safeGroupEdit = (data: any) => {
  return service.put(Api.SECURITY_GROUP_CREATE, data)
}
//删除安全组
export const safeGroupDelete = (data: any) => {
  return service.delete(Api.SECURITY_GROUP_DELETE, { data })
}
//安全组详情
export const querySafeGroupDetail = (params: any) => {
  return service.get(Api.SECURITY_GROUP_DETAIL, { params })
}
//安全组规则列表(分页)
export const querySafeGroupRule = Api.SECURITY_GROUP_RULE_LIST
//安全组模板规则
export const querySafeGroupModelRule = Api.SECURITY_GROUP_MODEL_RULE
//安全组规则创建
export const safeGroupRuleCreate = (data: any) => {
  return service.post(Api.SECURITY_GROUP_RULE, data)
}
//删除安全组规则
export const safeGroupRuleDelete = (data: any) => {
  return service.delete(Api.SECURITY_GROUP_RULE, { data })
}
//安全组关联实例
export const safeGroupRelevanceInstance = (data: any) => {
  return service.put(Api.SECURITY_GROUP_RELEVANCE_INSTANCE, data)
}
//安全组解绑实例
export const safeGroupRemoveInstance = (data: any) => {
  return service.put(Api.SECURITY_GROUP_REMOVE_INSTANCE, data)
}
//安全组关联实例列表
export const queryRelevanceInstanceList =
  Api.SECURITY_GROUP_RELEVANCE_INSTANCE_LIST
// 云主机详情界面更改安全组
export const safeGroupBindGroups = (data: any) => {
  return service.put(Api.SECURITY_GROUP_BIND_INSTANCE_GROUPS, data)
}
//安全组关联辅助网卡列表
export const queryRelevanceAssistNicList =
  Api.SECURITY_GROUP_BIND_ASSIST_NIC_LIST
//安全组关联实例
export const safeGroupRelevanceAssistNIc = (data: any) => {
  return service.put(Api.SECURITY_GROUP_RELEVANCE_ASSIST_NIC, data)
}

/**
 * 网卡
 */
//查询网卡(不分页)
export const netCardListURL = Api.NET_CARD_LIST
export const queryNetCardList = (params: any) => {
  return service.get(Api.NET_CARD_LIST, { params })
}
//查询辅助弹性网卡列表(分页)
export const queryNetCardPage = Api.NET_CARD_PAGE
//查询网卡详情
export const queryNetCardDetail = (params: any) => {
  return service.get(Api.ELASTIC_NIC_DETAIL, { params })
}
//查询主网卡绑定的辅助网卡
export const queryMainNicDetail = (params: any) => {
  return service.get(Api.MAIN_NIC_BIND_ASSIST_NIC, { params })
}

//查询未绑定弹性IP的网卡
export const queryUnbindNetCardList = (params: any) => {
  return service.get(Api.UNBIND_NET_CARD_LIST, { params })
}
//创建辅助弹性网卡
export const createAssistNic = (data: any) => {
  return service.post(Api.ELASTIC_NIC, data)
}
//批量创建辅助弹性网卡
export const batchCreateAssistNic = (data: any) => {
  return service.post(Api.ELASTIC_NIC_BATCH, data)
}
//删除辅助弹性网卡
export const deleteAssistNic = (data: any) => {
  return service.delete(Api.ELASTIC_NIC, { data })
}
//修改辅助弹性网卡
export const editAssistNic = (data: any) => {
  return service.put(Api.ELASTIC_NIC, data)
}

/**
 * 路由表
 */
//路由表列表(分页)
export const queryRouteTablePage = Api.ROUTE_TABLE_PAGE
//路由表列表(不分页)
export const queryRouteTableList = (params: any) => {
  return service.get(Api.ROUTE_TABLE_LIST, { params })
}
//路由表创建
export const routeTableCreate = (data: any) => {
  return service.post(Api.ROUTE_TABLE_OPERATE, data)
}
//路由表修改
export const routeTableEdit = (data: any) => {
  return service.put(Api.ROUTE_TABLE_OPERATE, data)
}
//路由表删除
export const routeTableDelete = (data: any) => {
  return service.delete(Api.ROUTE_TABLE_OPERATE, { data })
}
//路由表详情
export const queryRouteTableDetail = (params: any) => {
  return service.get(Api.ROUTE_TABLE_DETAIL, { params })
}
//路由表中添加路由
export const routesAddToRouteTable = (data: any) => {
  return service.post(Api.ROUTE_TABLE_ROUTE, data)
}
//修改路由表中路由
export const editRouteInRouteTable = (data: any) => {
  return service.put(Api.ROUTE_TABLE_ROUTE, data)
}
//路由表中删除路由
export const deleteRouteInRouteTable = (data: any) => {
  return service.delete(Api.ROUTE_TABLE_ROUTE, { data })
}
//路由表关联子网
export const routeTableBindSubnet = (data: any) => {
  return service.put(Api.ROUTE_TABLE_BIND_SUBNET, data)
}
//路由表关联子网
export const subnetChangeRouteTable = (data: any) => {
  return service.put(Api.SUBNET_CHANGE_ROUTE_TABLE, data)
}
