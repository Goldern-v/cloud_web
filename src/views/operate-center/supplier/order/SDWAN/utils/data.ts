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
  { label: '客户名称', prop: 'customerName', type: FiltrateEnum.input },
  { label: 'BASS Order No', prop: 'bssOrder', type: FiltrateEnum.input },
  { label: '客户经理邮箱', prop: 'accountMaEmail', type: FiltrateEnum.input }
]

export const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '客户名称', prop: 'customerName' },
  { label: 'BASS Order No', prop: 'bssOrder' },
  { label: '业务类型', prop: 'productName' },
  { label: '创建时间', prop: 'createTime' },
  { label: '客户经理邮箱', prop: 'accountMaEmail' }
]
export const flowTableHeaders: IdealTableColumnHeaders[] = [
  { label: '流程环节', prop: 'taskName' },
  { label: '状态', prop: 'taskStatus' },
  { label: '操作时间', prop: 'startTime' }
]

const defaultQuery: defaultQuery = {
  productName: 'SDWAN'
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
