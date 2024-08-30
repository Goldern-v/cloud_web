import { corderSdwanList } from '@/api/java/operate-center'
import { IdealSearch, IdealTableColumnHeaders } from '@/types'
import { IdealTableColumnOperate } from '@/types/common'
import { FiltrateEnum } from '@/utils/enum'

type tabControllersDataType = {
  label: string
  name: string
}

enum orderEnum {
  '已完成' = '0',
  '进行中' = '1',
  '异常单' = '2'
}

interface stateType {
  dataListUrl: string
  dataList: any[]
  deleteUrl: string
  queryForm: sdwanListParamsType
  primaryKey: string
}

type defaultQuery = {
  productName: string
}
type othertQuery = {
  orderType: string
}
export type sdwanListParamsType = defaultQuery &
  othertQuery & {
    customerName?: string
    accountMaEmail?: string
    bssOrder?: string
    supplierId?: string
  }

export const tabControllersData: tabControllersDataType[] = [
  { label: '进行中', name: 'progressing' },
  { label: '已完成', name: 'finish' },
  { label: '异常单', name: 'abnormalBill' }
]

export const typeArray: IdealSearch[] = [
  // { label: '订单编号', prop: 'orderItemId', type: FiltrateEnum.input },
  { label: '客户名称', prop: 'customerName', type: FiltrateEnum.input },
  { label: '客户经理', prop: 'accountMaEmail', type: FiltrateEnum.input }
]

export const processingTableHeaders: IdealTableColumnHeaders[] = [
  { label: '订单编号', prop: 'orderItemId' },
  { label: '客户名称', prop: 'customerName' },
  { label: '客户经理', prop: 'accountMaEmail' },
  // { label: '订单流程', prop: '' },
  { label: '创建时间', prop: 'createTime' }
]
export const finishTableHeaders: IdealTableColumnHeaders[] = [
  { label: '订单编号', prop: 'orderItemId' },
  { label: '客户名称', prop: 'customerName' },
  { label: '客户经理', prop: 'accountMaEmail' },
  // { label: '订单流程', prop: '' },
  { label: '创建时间', prop: 'createTime' }
  // { label: '订单完成时间', prop: '' },
]
export const flowTableHeaders: IdealTableColumnHeaders[] = [
  { label: '流程环节', prop: 'taskName' },
  { label: '状态', prop: 'taskStatus' },
  { label: '操作时间', prop: 'startTime' }
]

const defaultQuery: defaultQuery = {
  productName: 'SD-WAN'
}

export const progressingQuery: defaultQuery & othertQuery = {
  ...defaultQuery,
  orderType: orderEnum['进行中']
}
export const finishQuery: defaultQuery & othertQuery = {
  ...defaultQuery,
  orderType: orderEnum['已完成']
}
export const abnormalBillQuery: defaultQuery & othertQuery = {
  ...defaultQuery,
  orderType: orderEnum['异常单']
}

export const stateData: stateType = {
  dataListUrl: corderSdwanList,
  dataList: [] as any[],
  deleteUrl: '',
  queryForm: {} as sdwanListParamsType,
  primaryKey: 'id' // 多选结果主键
}

export const operateButtons: IdealTableColumnOperate[] = [
  { title: '流程', prop: 'flow', authority: 'supplier:order:SDWAN:flow' }
]
