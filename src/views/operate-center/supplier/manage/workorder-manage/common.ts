export const typeFormat: { [key: string]: any } = {
  NEW_OPEN: '新开',
  RENEWAL: '续约',
  CHANGE: '变更',
  RENT_OUT: '退租',
  SHUTDOWN: '停开',
  NEW_DISCOUNT: '折扣审批单'
}

export const statusFormat: { [key: string]: any } = {
  UN_DEAL: '未处理',
  DEAL_ING: '处理中',
  COMPLETED: '已完成',
  REJECT: '已驳回',
  UN_APPROVED: '未审批',
  PASSED: '已通过',
  TIMEOUT_UN_DEAL: '超时未交付'
}

export const typeList: any = [
  { label: '新开', value: 'NEW_OPEN' },
  { label: '续约', value: 'RENEWAL' },
  { label: '变更', value: 'CHANGE' },
  { label: '退租', value: 'RENT_OUT' },
  { label: '停开', value: 'SHUTDOWN' },
  { label: '折扣审批单', value: 'NEW_DISCOUNT' }
]

export const statusList: any = [
  { label: '未处理', value: 'UN_DEAL' },
  { label: '续约', value: 'DEAL_ING' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已驳回', value: 'REJECT' },
  { label: '未审批', value: 'UN_APPROVED' },
  { label: '已通过', value: 'PASSED' },
  { label: '超时未交付', value: 'TIMEOUT_UN_DEAL' }
]

export const resourceList: { [key: string]: any } = {
  physicalConnectionId: '物理线路ID',
  portId: '端口ID',
  cloudAccountId: '云平台账号',
  cloudType: '云连接类型',
  cloudRegionId: '区域',
  // dcId: '接入点ID',
  vlanId: 'VLAN ID',
  nniPortName: 'NNI端口名称',
  nniPortId: 'NNI端口ID',
  nniVlanId: 'NNI端口vlan',
  portBandwidth: '端口带宽',
  portType: '端口类型',
  aType: 'A端',
  zType: 'Z端'
}
export const portTypeList: { [key: string]: any } = {
  CLOUD_PORT: '云端口',
  NNI_PORT: 'nni端口',
  ONLY_PORT: '专用端口'
}
