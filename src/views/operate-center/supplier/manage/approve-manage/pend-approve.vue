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
      :is-multiple="true"
      @handleSelectionChange="selectionChangeHandle"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #name>
        <el-table-column label="供应商名称" width="200">
          <template #default="props"
            ><span class="ideal-theme-text" @click="toDetail(props.row)">
              {{ props.row.vendorName }}
            </span></template
          >
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
      :multiple-selection="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import {
  FiltrateEnum,
  PaginationTypeEnum,
  OperateEventEnum
} from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealTextProp
} from '@/types'
import dialogBox from './dialog-box.vue'
import { supplierInfoList } from '@/api/java/operate-center'
import store from '@/store'

const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'vendorName', type: FiltrateEnum.input }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {
    approvalStatus: 'wait'
  }
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      state.queryForm[item.prop] = temp[1]
    })
  }
  getDataList()
}

const state: IHooksOptions = reactive({
  dataListUrl: supplierInfoList,
  dataList: [] as any[],
  deleteUrl: '',
  queryForm: {
    approvalStatus: 'wait'
  },
  primaryKey: 'id' // 多选结果主键
})

const {
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  selectionChangeHandle
} = useCrud(state)

const operateButtons: IdealTableColumnOperate[] = [
  {
    title: '通过',
    prop: 'pass',
    authority: 'supplier:manage:approvalPass'
  },
  {
    title: '驳回',
    prop: 'reject',
    authority: 'supplier:manage:approvalReject'
  }
]
const newOperate = (ele: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateButtons))
  resultArr = tempArr
  return resultArr
}
watch(
  () => state.dataList,
  (arr: any) => {
    if (arr.length) {
      arr.forEach((ele: any) => {
        ele.operate = newOperate(ele)
        ele.node = ele.supplierNodeDetail?.node?.name
        ele.area = ele.supplierNodeDetail?.node?.areaName
        ele.country = ele.supplierNodeDetail?.node?.countryName
        ele.city = ele.supplierNodeDetail?.node?.cityName
      })
    }
  },
  { immediate: true }
)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '供应商名称', prop: 'name', useSlot: true },
  { label: '区域', prop: 'area' },
  { label: '国家', prop: 'country' },
  { label: '城市', prop: 'city' },
  { label: '节点', prop: 'node' },
  { label: '申请账号', prop: 'creator.username' },
  { label: '申请时间', prop: 'createTime.date' }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '通过',
    prop: 'passAll',
    type: 'primary',
    iconColor: 'white',
    authority: 'supplier:manage:approvalBatchReject',
    disabled: true,
    disabledText: '请至少选择一个供应商账号'
  },
  {
    title: '驳回',
    prop: 'rejectAll',
    iconColor: 'white',
    authority: 'supplier:manage:approvalBatchPass',
    disabled: true,
    disabledText: '请至少选择一个供应商账号'
  }
])

const rowData: any = ref(null)
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  showDialog.value = true
  dialogType.value = command
}

const router = useRouter()
onBeforeRouteLeave((to, from, next) => {
  store.commonStore.setSideBar(from.fullPath)
  next()
})

const toDetail = (row: any) => {
  router.push({
    path: '/operate-center/supplier/manage/information-manage-detail',
    query: { id: row.id }
  })
}
// 多选禁用问题
watch(
  () => state.dataListSelections,
  arr => {
    rowData.value = arr
    if (arr?.length) {
      leftButtons?.value.forEach((item: any) => {
        item.disabled = arr?.length == 0
        item.disabledText = arr?.length > 0 ? '' : '请至少选择一个用户'
      })
    } else {
      leftButtons?.value.forEach((item: any) => {
        item.disabled = true
        item.disabledText = '请至少选择一个用户'
      })
    }
  }
)
// 列表左上按钮操作
const clickLeftEvent = (value: string | number | object) => {
  showDialog.value = true
  dialogType.value = value
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string | object>()
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
  .ideal-theme-text {
    cursor: pointer;
  }
}
</style>
