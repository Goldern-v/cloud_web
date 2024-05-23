export interface DetailPanelProps {
  title?: string
  name?: string
  labelArray?: any[]
}

export interface cloudPortCreateProps {
  key?: string
  name?: string //端口名称
  vendorId?: string //所属供应商
  node?: string //所属节点
  device?: string //所属设备
  speed?: string //端口速度
  instanceId?: string //实例ID
  region?: string //region
  accessPoint?: string //接入点
  type?: string //端口类型
  interconnectId?: string //互连ID
  position?: string //位置
  logicDevice?: string //逻辑设备
  zone?: string
  Address?: string
}
