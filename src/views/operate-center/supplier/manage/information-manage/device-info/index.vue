<template>
  <div class="ideal-main-container supplier-information-manage">
    <ideal-search
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider border-style="solid" />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :pagination-type="PaginationTypeEnum.totalSizes"
      :total="state.total"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #status>
        <el-table-column label="状态" width="200">
          <template #default="props">
            <el-tag :type="props.row.type">{{ props.row.status }}</el-tag>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
              @clickMoreEvent="clickOperateEvent($event as any, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import { FiltrateEnum, PaginationTypeEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealButtonEventProp,
  IdealTextProp
} from '@/types'
import { equipmentPageUrl, equipmentDelete } from '@/api/java/operate-center'
import { isSupplierManager } from '@/utils/role'
import { statusFormat, statusType } from '../common'

const typeArray = ref<IdealSearch[]>([
  { label: '设备名称', prop: 'name', type: FiltrateEnum.input }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

const state: IHooksOptions = reactive({
  dataListUrl: equipmentPageUrl,
  dataList: [] as any[],
  deleteUrl: equipmentDelete,
  queryForm: {},
  primaryKey: 'id' // 多选结果主键
})

const tableHeaders = ref<IdealTableColumnHeaders[]>()
onMounted(() => {
  //运营商角色
  if (!isSupplierManager.value) {
    tableHeaders.value = headerArray
  } else {
    tableHeaders.value = headerArray.filter(
      (item: any) => item.prop !== 'vendorName'
    )
  }
})
const headerArray: IdealTableColumnHeaders[] = [
  { label: '设备名称', prop: 'name' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '所属供应商', prop: 'vendorName' },
  { label: '所属节点', prop: 'nodeName' },
  { label: '所属机柜', prop: 'cabinetName' },
  { label: '所属U位', prop: 'uType' },
  { label: '网络平面', prop: 'planarNetwork' },
  { label: 'IP地址', prop: 'ip' }
]

const { sizeChangeHandle, currentChangeHandle, getDataList, deleteHandle } =
  useCrud(state)

watch(
  () => state.dataList,
  (arr: any) => {
    if (arr.length) {
      arr.forEach((ele: any) => {
        ele.operate = newOperate(ele)
        ele.status = statusFormat[ele.approvalStatus.toUpperCase()]
        ele.type = statusType[ele.approvalStatus.toUpperCase()]
      })
    }
  },
  { immediate: true }
)

const leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建',
    prop: 'create',
    type: 'primary'
  }
]
const clickLeftEvent = (command: string | number | object) => {
  if (command === 'create') {
    showDialog.value = true
    dialogType.value = 'createDevice'
  }
}

const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]

const newOperate = (ele: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateButtons))
  if (ele.approvalStatus.toUpperCase() === 'PASS') {
    resultArr = setOperateBtns(true, tempArr)
  } else {
    resultArr = tempArr
  }
  return resultArr
}
// 根据状态设置操作禁用状态
const setOperateBtns = (
  disabled: boolean,
  array: IdealTableColumnOperate[]
) => {
  const arr: IdealTableColumnOperate[] = []
  array.forEach((item: any) => {
    item.disabled = disabled
    item.disabledText = `已通过审批的不支持${item.title}操作`
    arr.push(item)
  })
  return arr
}

const rowData: any = ref({})
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'delete') {
    deleteHandle(row.id, '/', '确定要删除当前设备信息吗', '删除')
  } else if (command === 'edit') {
    rowData.value = row
    showDialog.value = true
    dialogType.value = 'editDevice'
  }
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>

<style scoped lang="scss">
.supplier-information-manage {
  background-color: white;
  padding: $idealPadding;
}
</style>
