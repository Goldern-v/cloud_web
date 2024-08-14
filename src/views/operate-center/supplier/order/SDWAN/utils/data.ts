import { supplierInfoList } from '@/api/java/operate-center'
import { IdealSearch, IdealTableColumnHeaders } from '@/types'
import { IdealTableColumnOperate } from '@/types/common'
import { FiltrateEnum } from '@/utils/enum'

type tabControllersDataType = {
  label: string
  name: string
}
export const tabControllersData: tabControllersDataType[] = [
  { label: '进行中', name: 'progressing' },
  { label: '已完成', name: 'finish' },
  { label: '异常单', name: 'abnormalBill' }
]

export const typeArray: IdealSearch[] = [
  { label: '客户名称', prop: 'vendorName', type: FiltrateEnum.input },
  { label: 'BASS Order No', prop: 'vendorName', type: FiltrateEnum.input },
  { label: '客户经理', prop: 'vendorName', type: FiltrateEnum.input }
]

export const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '客户名称', prop: 'name' },
  { label: 'BASS Order No', prop: 'area' },
  { label: '业务类型', prop: 'country' },
  { label: '创建时间', prop: 'city' },
  { label: '客户经理', prop: 'creator.username' }
]
export const flowTableHeaders: IdealTableColumnHeaders[] = [
  { label: '流程环节', prop: 'name' },
  { label: '状态', prop: 'area' },
  { label: '操作时间', prop: 'city' }
]

export const stateData = {
  dataListUrl: supplierInfoList,
  dataList: [] as any[],
  deleteUrl: '',
  queryForm: {
    approvalStatus: 'pass'
  },
  primaryKey: 'id' // 多选结果主键
}

export const operateButtons: IdealTableColumnOperate[] = [
  { title: '流程', prop: 'flow', authority: 'supplier:order:SDWAN:flow' }
]
