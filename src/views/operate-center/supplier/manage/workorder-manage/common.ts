import { IdealTableColumnHeaders } from '@/types'

export const typeFormat: { [key: string]: any } = {
  NEW_OPEN: '新开',
  RENEWAL: '续约',
  CHANGE: '变更',
  RENT_OUT: '退租',
  SHUTDOWN: '停开',
  NEW_DISCOUNT: '折扣审批',
  SPECIAL_LINE_APPLICATION: '专线申请',
  NOTIFY: '消息通知'
}

export const resourceTypeFormat: { [key: string]: any } = {
  LINE: '线路',
  PORT: '端口'
}

export const statusFormat: { [key: string]: any } = {
  UN_DEAL: '待处理',
  DEAL_ING: '审批中',
  COMPLETED: '已完成',
  REJECT: '已驳回',
  UN_APPROVED: '待审批',
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
export const sourceList: any = [
  { label: '端口', value: 'NEW_OPEN' },
  { label: '线路', value: 'RENEWAL' }
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

type tabControllersDataType = {
  label: string
  name: string
}

export const tabControllersData: tabControllersDataType[] = [
  { label: '处理工单', name: 'Processing' },
  { label: '审批工单', name: 'Approve' },
  { label: '交付工单', name: 'Delivery' }
]

const headerArr1 = [
  { label: '资源类型：', prop: 'resourceTypeText' },
  { label: '创建时间：', prop: 'createTime', useSlot: true }
]
const headerArr3 = [
  { label: '线路编号：', prop: 'privateConnectId' },
  { label: '创建时间：', prop: 'createTime', useSlot: true },
  { label: '交付时间：', prop: 'updateTime', useSlot: true },
  { label: '交付工期：', prop: 'updateTime' }
]
const headerArr2 = [
  // { label: '端口编号：', prop: 'privateConnectId' },
  { label: '资源类型：', prop: 'resourceTypeText' },
  { label: '创建时间：', prop: 'createTime', useSlot: true }
]
export const initHeaderArray = (type: string) => {
  const headerArray: any = [
    // { label: '供应商名称：', prop: 'supplierName' },
    // { label: '订单号：', prop: 'orderId' },
    { label: '工单号：', prop: 'orderNo' },
    { label: '工单类型：', prop: 'typeText', useSlot: true },
    { label: '工单状态：', prop: 'statusText', useSlot: true },
    // { label: '带宽：', prop: 'bandwidthUnit', useSlot: true },
    ...(['processing'].includes(type)
      ? headerArr2
      : ['delivery'].includes(type)
        ? headerArr3
        : headerArr1),
    { label: '备注信息：', prop: 'remark' }
  ]
  return headerArray
}
const assetsArr1 = [
  { label: 'A端', prop: 'A端' },
  { label: 'Z端', prop: 'Z端' },
  { label: '端口类型：', prop: 'endpointADto.portType' },
  { label: '端口类型：', prop: 'endpointZDto.portType' },
  { label: '线路带宽：', prop: 'endpointADto.portBandwidth' },
  { label: '公有云物理线路实例ID：', prop: 'endpointZDt.cloudRegionId' },
  { label: '端口的vlan号：', prop: 'endpointADto.nniVlanId' },
  { label: '公有云区域：', prop: 'endpointZDto.cloudRegionId' },
  { label: '端口名称：', prop: 'endpointADto.nniPortName' },
  { label: '公有云类型：', prop: 'endpointZDto.cloudType' },
  { label: 'NNI端口ID：', prop: 'endpointADto.nniPortId' },
  { label: '端口带宽：', prop: 'endpointZDto.portBandwidth' },
  { label: '端口带宽：', prop: 'endpointADto.portBandwidth' }
]
const assetsArr2 = [
  { label: '端口类型：', prop: 'portType' },
  { label: '所属节点：', prop: 'nodeName' },
  { label: '端口带宽：', prop: 'portBandwidth' },
  { label: '所属设备：', prop: 'equipmentName' },
  { label: '端口名称：', prop: 'portNmae' },
  { label: '接入地址：', prop: 'accessAddress' },
  { label: '端口ID：', prop: 'portId' }
]
export const initAssetsArray = (type: string) => {
  return ['processing'].includes(type) ? assetsArr2 : assetsArr1
}

const priceHeaders1 = [
  { label: '原价', prop: 'originalPrice' },
  { label: '成交价($)', prop: 'transactionPrice' },
  { label: '审批状态', prop: 'statusText' },
  { label: '最终可接受价格($)', prop: 'acceptablePrice' },
  { label: '审批时间', prop: 'updateTime' }
]
const priceHeaders2 = [
  { label: '价格/NRC', prop: 'type' },
  { label: '价格/MRC', prop: 'type' },
  { label: '线路方案', prop: 'type' },
  { label: '审批状态', prop: 'type' },
  { label: '审批时间', prop: 'type' }
]
export const initPriceInfo = (type: string) => {
  const tarobj = {
    title: ['processing'].includes(type) ? '专线申请' : '线路价格',
    priceHeaders: ['processing'].includes(type) ? priceHeaders2 : priceHeaders1
  }
  return tarobj
}

export const processingHeaderArray: IdealTableColumnHeaders[] = [
  // { label: '供应商名称', prop: 'supplierName' },
  { label: '工单号', prop: 'orderNo' },
  { label: '资源类型', prop: 'resourceTypeText', defaultVal: '-' },
  { label: '工单类型', prop: 'typeText', defaultVal: '-' },
  // { label: '订单号', prop: 'orderId' },
  { label: '工单状态', prop: 'statusText' },
  { label: '端口带宽', prop: 'bandwidthUnit' },
  { label: '创建时间', prop: 'createTime.date' }
]
export const approveHeaderArray: IdealTableColumnHeaders[] = [
  // { label: '供应商名称', prop: 'supplierName' },
  { label: '工单号', prop: 'id' },
  { label: '资源类型', prop: 'resourceTypeText', defaultVal: '-' },
  { label: '工单类型', prop: 'typeText', defaultVal: '-' },
  // { label: '订单号', prop: 'orderId' },
  { label: '工单状态', prop: 'statusText' },
  { label: '线路带宽', prop: 'bandwidthUnit' },
  { label: '创建时间', prop: 'createTime.date' }
]
export const deliveryHeaderArray: IdealTableColumnHeaders[] = [
  // { label: '供应商名称', prop: 'supplierName' },
  { label: '工单号', prop: 'id' },
  { label: '资源类型', prop: 'resourceTypeText', defaultVal: '-' },
  { label: '工单类型', prop: 'typeText', defaultVal: '-' },
  // { label: '订单号', prop: 'orderId' },
  { label: '工单状态', prop: 'statusText' },
  { label: '交付工期', prop: 'bandwidthUnit' },
  { label: '交付编号', prop: 'bandwidthUnit' },
  { label: '创建时间', prop: 'createTime.date' }
]
