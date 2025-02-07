<template>
  <div class="supplier-information-manage">
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
        <el-table-column label="审批状态" width="80">
          <template #default="props">
            <el-tag :type="props.row.type">{{ props.row.status }}</el-tag>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="100" fixed="right">
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
import dialogBox from '../dialog-box.vue'
import { portPageUrl, portDelete } from '@/api/java/operate-center'
import { isSupplierManager } from '@/utils/role'
import { statusFormat, statusType } from '../common'

const typeArray = ref<IdealSearch[]>([
  { label: '端口名称', prop: 'name', type: FiltrateEnum.input }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  state.queryForm.portType = 'SPECIALIZED'
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

const state: IHooksOptions = reactive({
  dataListUrl: portPageUrl,
  dataList: [] as any[],
  deleteUrl: portDelete,
  queryForm: {
    portType: 'SPECIALIZED'
  },
  primaryKey: 'id' // 多选结果主键
})

const { sizeChangeHandle, currentChangeHandle, getDataList, deleteHandle } =
  useCrud(state)

const tableHeaders = ref<IdealTableColumnHeaders[]>()
onMounted(() => {
  //供应商角色
  if (!isSupplierManager.value) {
    tableHeaders.value = headerArray
  } else {
    tableHeaders.value = headerArray.filter(
      (item: any) => item.prop !== 'vendorName'
    )
  }
})

const headerArray: IdealTableColumnHeaders[] = [
  { label: '端口名称', prop: 'name' },
  { label: '数据来源', prop: 'originType' },
  { label: '端口状态', prop: 'portStatus' },
  { label: '审批状态', prop: 'status', useSlot: true },
  { label: '所属供应商', prop: 'vendorName' },
  { label: '所属节点', prop: 'nodeName' },
  { label: '所属设备', prop: 'equipmentName' },
  { label: '速率', prop: 'speed' }
]

const leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建',
    prop: 'create',
    type: 'primary',
    authority: 'supplier:specific:port:add'
  }
]

const clickLeftEvent = (command: string | number | object) => {
  if (command === 'create') {
    showDialog.value = true
    dialogType.value = 'createSpecificPort'
  }
}

const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit', authority: 'supplier:specific:port:edit' },
  // {
  //   title: '专线申请',
  //   prop: 'privateApplication',
  //   authority: 'supplier:specific:private:apply'
  // },
  { title: '删除', prop: 'delete', authority: 'supplier:specific:port:delete' }
]

watch(
  () => state.dataList,
  (arr: any) => {
    if (arr.length) {
      arr.forEach((ele: any) => {
        ele.operate = newOperate(ele)
        ele.status = statusFormat[ele.approvalStatus.toUpperCase()]
        ele.type = statusType[ele.approvalStatus.toUpperCase()]
        if (ele.origin === undefined || ele.origin === null) {
          ele.originType = ''
        } else {
          ele.originType = ele.origin == 3 ? 'API导入' : '静态录入'
        }
      })
    }
  },
  { immediate: true }
)

const newOperate = (ele: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateButtons))
  if (ele.approvalStatus.toUpperCase() === 'PASS' || ele.origin === 3) {
    resultArr = setOperateBtns(true, tempArr)
  }
  resultArr = tempArr
  return resultArr
}
// 根据状态设置操作禁用状态
const setOperateBtns = (
  disabled: boolean,
  array: IdealTableColumnOperate[]
) => {
  const arr: IdealTableColumnOperate[] = []
  array.forEach((item: any) => {
    if (item.prop === 'delete' || item.prop === 'edit') {
      item.disabled = disabled
      item.disabledText = `已通过审批或数据来源为API导入的不支持${item.title}操作`
      arr.push(item)
    }
  })
  return arr
}

const rowData: any = ref({})
const clickOperateEvent = (command: string | number, row: any) => {
  rowData.value = row
  if (command === 'delete') {
    deleteHandle(row.id, '/', '确定要删除当前专用端口信息吗？', '删除')
  } else if (command === 'edit') {
    showDialog.value = true
    dialogType.value = 'editSpecificPort'
  } else if (command === 'privateApplication') {
    showDialog.value = true
    dialogType.value = 'privateLine'
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
