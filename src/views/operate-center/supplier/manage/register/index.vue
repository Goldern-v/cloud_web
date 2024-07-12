<template>
  <div class="ideal-main-container supplier-register">
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
      <template #attribute>
        <el-table-column label="属性">
          <template #default="props">
            <div v-if="props.row.ak">访问密钥ID：{{ props.row.ak }}</div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateButtons"
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
import dialogBox from './dialog-box.vue'
import {
  FiltrateEnum,
  PaginationTypeEnum,
  OperateEventEnum
} from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealButtonEventProp,
  IdealTextProp
} from '@/types'
import { supplierRegisterPageUrl } from '@/api/java/operate-center'

const typeArray = ref<IdealSearch[]>([
  {
    label: '供应商名称',
    prop: 'name',
    type: FiltrateEnum.input
  }
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
  dataListUrl: supplierRegisterPageUrl,
  queryForm: {}
})
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '供应商名称', prop: 'name' },
  { label: '供应商类别', prop: 'supplierType' },
  { label: '属性', prop: 'attribute', useSlot: true },
  { label: '状态', prop: 'statusText' },
  { label: '创建时间', prop: 'createTime.date' }
]

const leftButtons: IdealButtonEventProp[] = [
  {
    title: '供应商注册',
    prop: 'create',
    type: 'primary',
    authority: 'supplier:register:add'
  }
]
const router = useRouter()
const clickLeftEvent = (command: string | number | object) => {
  if (command === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  }
}
const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit', authority: 'supplier:register:edit' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number, row: any) => {
  rowData.value = row
  if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
  }
}

watch(
  () => state.dataList,
  (arr: any) => {
    if (arr.length) {
      arr.forEach((item: any) => {
        item.statusText =
          item.status.toUpperCase() === 'SUCCESS' ? '成功' : '失败'
      })
    }
  },
  { immediate: true }
)

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()

const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>

<style scoped lang="scss">
.supplier-register {
  background-color: white;
  padding: $idealPadding;

  .ideal-theme-text {
    cursor: pointer;
  }
}
</style>
