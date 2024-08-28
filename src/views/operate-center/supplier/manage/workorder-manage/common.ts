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

export let statusFormat: any = {}

export let statusList: any = []

export const initStatusInfo = (keys: string[], keysWords: string[] = []) => {
  statusList = []
  statusFormat = {}
  const UN_DEALObj = {
    UN_DEAL: keys.includes('delivery') ? '待交付' : '待处理'
  }
  Object.assign(statusFormat, {
    DEAL_ING: '审批中',
    COMPLETED: '已完成',
    REJECT: '已驳回',
    UN_APPROVED: '待审批',
    PASSED: '已通过',
    TIMEOUT_UN_DEAL: '超时未交付',
    ...UN_DEALObj
  })
  Object.assign(
    statusList,
    Object.keys(statusFormat).reduce((pre: any, next: any) => {
      if (keysWords.includes(statusFormat[next])) {
        return [
          ...pre,
          {
            label: statusFormat[next],
            value: next
          }
        ]
      } else {
        return [...pre]
      }
    }, [])
  )
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
  { label: '端口', value: 'PORT' },
  { label: '线路', value: 'LINE' }
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
  CLOUD: '云端口',
  NNI: 'NNI端口',
  SPECIALIZED: '专用端口'
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
const headerArr3 = (resourceTypeStr: string) => {
  const showConnect = resourceTypeStr === '线路' ? '线路编号：' : '端口编号：'
  return [
    { label: showConnect, prop: 'privateConnectId' },
    { label: '创建时间：', prop: 'createTime', useSlot: true },
    { label: '交付时间：', prop: 'updateTime', useSlot: true },
    { label: '交付工期：', prop: 'deliveryDuration' }
  ]
}
const headerArr2 = [
  // { label: '端口编号：', prop: 'privateConnectId' },
  { label: '资源类型：', prop: 'resourceTypeText' },
  { label: '创建时间：', prop: 'createTime', useSlot: true }
]
export const initHeaderArray = (type: string, resourceTypeStr: string) => {
  const headerArray: any = [
    { label: '供应商名称：', prop: 'supplierName' },
    { label: '订单号：', prop: 'orderId' },
    { label: '工单号：', prop: 'orderNo' },
    { label: '工单类型：', prop: 'typeText', useSlot: true },
    { label: '工单状态：', prop: 'statusText', useSlot: true },
    // { label: '带宽：', prop: 'bandwidthUnit', useSlot: true },
    ...(['processing'].includes(type)
      ? headerArr2
      : ['delivery'].includes(type)
        ? headerArr3(resourceTypeStr)
        : headerArr1),
    { label: '备注信息：', prop: 'remark' }
  ]
  return headerArray
}

const NNIList = [
  { label: '线路带宽：', prop: 'lineBandwidth' },
  { label: '端口的vlan号：', prop: 'portVlan' },
  { label: '端口名称：', prop: 'portName' },
  { label: 'NNI端口ID：', prop: 'portNniID' },
  { label: '端口带宽：', prop: 'portBandwidth' }
]

const cloudList = [
  { label: '公有云物理线路实例ID：', prop: 'publicPhysicsLineClientId' },
  { label: '公有云区域：', prop: 'publicRegion' },
  { label: '公有云类型：', prop: 'publicType' },
  { label: '端口带宽：', prop: 'portBandwidth' }
]

const SPECIALIZEDList = [
  { label: '线路带宽：', prop: 'lineBandwidth' },
  { label: '端口名称：', prop: 'portName' },
  { label: '端口ID：', prop: 'portId' }
]

const assetsArr1 = (dataInfo: any) => {
  const obj = {
    专用端口: SPECIALIZEDList,
    云端口: cloudList,
    NNI端口: NNIList
  }
  const emptyObj = { label: '', prop: '' }
  const AportType = portTypeList[dataInfo.endpointADetail.portType]
  const ZportType = portTypeList[dataInfo.endpointZDetail.portType]
  const Alist = obj[AportType]
  const Zlist = obj[ZportType]
  const arr: any[] = []
  let Aindex = 0,
    Zindex = 0

  Array.from(
    { length: Math.max(Alist.length, Zlist.length) * 2 },
    (_, index) => index
  ).forEach((index: any) => {
    if ((index + 1) % 2 === 1) {
      const pushObj = Alist[Aindex]
        ? {
            ...Alist[Aindex],
            prop: `endpointADetail.${Alist[Aindex]['prop']}`,
            computedValue: true
          }
        : emptyObj
      arr.push(pushObj)
      Aindex++
    } else {
      const pushObj = Zlist[Zindex]
        ? {
            ...Zlist[Zindex],
            prop: `endpointZDetail.${Zlist[Zindex]['prop']}`,
            computedValue: true
          }
        : emptyObj
      arr.push(pushObj)
      Zindex++
    }
  })
  const defaultArr = [
    { label: 'A端', prop: 'A端' },
    { label: 'Z端', prop: 'Z端' },
    { label: '端口类型：', prop: 'endpointADetailPortType', useSlot: true },
    { label: '端口类型：', prop: 'endpointZDetailPortType', useSlot: true }
  ]

  return [...defaultArr, ...arr]
}

const assetsArr2 = (dataInfo: any) => {
  const ifShowKeys = [
    'monitorVlan',
    'monitorBandwidth',
    'customerIp',
    'telecomIp'
  ]
  const arr = [
    { label: '端口类型：', prop: 'portType' },
    { label: '是否延伸监控：', prop: 'isMonitor' },
    { label: '端口带宽：', prop: 'portBandwidth' },
    { label: '监控vlan：', prop: 'monitorVlan' },
    { label: '端口名称：', prop: 'portNmae' },
    { label: '监控带宽：', prop: 'monitorBandwidth' },
    { label: '端口ID：', prop: 'portId' },
    { label: '您的路由器IP：', prop: 'customerIp' },
    { label: '所属节点：', prop: 'nodeName' },
    { label: 'CTG路由器IP：', prop: 'telecomIp' },
    { label: '所属设备：', prop: 'equipmentName' },
    { label: '', prop: '' },
    { label: '接入地址：', prop: 'accessAddress' }
  ]
  if (!dataInfo['isMonitor']) {
    return arr.filter(item => !ifShowKeys.includes(item.prop) && item.label)
  } else {
    return arr
  }
}
export const initAssetsArray = (resourceTypeStr: string, dataInfo: any) => {
  return resourceTypeStr === '线路'
    ? assetsArr1(dataInfo)
    : assetsArr2(dataInfo)
}

const priceHeaders1 = [
  { label: '原价', prop: 'originalPrice' },
  { label: '成交价($)', prop: 'transactionPrice' },
  { label: '审批状态', prop: 'statusText' },
  { label: '最终可接受价格($)', prop: 'acceptablePrice' },
  { label: '审批时间', prop: 'updateTime' }
]
const priceHeaders2 = [
  { label: '价格/NRC', prop: 'nrc' },
  { label: '价格/MRC', prop: 'mrc' },
  { label: '线路方案', prop: 'routeScheme' },
  { label: '审批状态', prop: 'statusText' },
  { label: '审批时间', prop: 'updateTime' },
  { label: '备注', prop: 'remark' }
]
export const initPriceInfo = (type: string, resourceTypeStr: string) => {
  const tarobj = {
    title: ['processing'].includes(type)
      ? '专线申请'
      : resourceTypeStr === '线路'
        ? '线路价格'
        : '端口价格',
    priceHeaders: ['processing'].includes(type) ? priceHeaders2 : priceHeaders1
  }
  return tarobj
}

export const processingHeaderArray: IdealTableColumnHeaders[] = [
  { label: '供应商名称', prop: 'supplierName' },
  { label: '订单号', prop: 'orderId' },
  { label: '工单号', prop: 'orderNo' },
  { label: '资源类型', prop: 'resourceTypeText' },
  { label: '工单类型', prop: 'typeText' },
  { label: '工单状态', prop: 'statusText' },
  { label: '端口带宽', prop: 'bandwidthUnit' },
  { label: '创建时间', prop: 'createTime.date' }
]
export const approveHeaderArray: IdealTableColumnHeaders[] = [
  { label: '供应商名称', prop: 'supplierName' },
  { label: '订单号', prop: 'orderId' },
  { label: '工单号', prop: 'orderNo' },
  { label: '资源类型', prop: 'resourceTypeText' },
  { label: '工单类型', prop: 'typeText' },
  { label: '工单状态', prop: 'statusText' },
  { label: '线路带宽', prop: 'bandwidthUnit' },
  { label: '创建时间', prop: 'createTime.date' }
]
export const deliveryHeaderArray: IdealTableColumnHeaders[] = [
  { label: '供应商名称', prop: 'supplierName' },
  { label: '订单号', prop: 'orderId' },
  { label: '工单号', prop: 'orderNo' },
  { label: '资源类型', prop: 'resourceTypeText' },
  { label: '工单类型', prop: 'typeText' },
  { label: '工单状态', prop: 'statusText' },
  { label: '交付工期', prop: 'deliveryDuration' },
  { label: '交付编号', prop: 'privateConnectId' },
  { label: '创建时间', prop: 'createTime.date' }
]

const computedValue = (obj: any, keys: string) => {
  const value = keys
    .split('.')
    .reduce((acc: any, key: any) => acc && acc[key], obj)
  return value
}

export const initListDataDefaultVal = (arr: any, dataList: any) => {
  dataList.forEach((data: any) => {
    arr
      .map((item: any) => item.prop)
      .forEach((key: any) => {
        if (!computedValue(data, key)) {
          data[key] = '-'
        }
      })
  })
}
