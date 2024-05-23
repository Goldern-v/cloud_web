<template>
  <div class="ideal-main-container project-manage">
    <ideal-search
      ref="searchRef"
      :type-array="typeArray"
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      @clickSearch="onClickSearch"
    />

    <el-divider border-style="solid" />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID">
          <template #default="props">
            <el-button link type="primary" @click="clickDetail(props.row)">{{
              props.row.name
            }}</el-button>

            <ideal-text-copy
              :row="props.row"
              copy-key="id"
              label-key="id"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="120">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
  <dialog-box
    v-if="showDialog"
    :row-data="rowData"
    :type="dialogType"
    @clickCloseEvent="clickCloseEvent"
    @clickRefreshEvent="clickRefreshEvent"
  ></dialog-box>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import DialogBox from './dialog-box.vue'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealSearchResult,
  IdealButtonEventProp
} from '@/types'
import { projectListApi, deleteProjectUrl } from '@/api/java/business-center'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '项目名称', prop: 'name', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: projectListApi,
  deleteUrl: deleteProjectUrl,
  queryForm: {
    name: ''
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)

watch(
  () => state.dataList,
  value => {
    value?.forEach(item => {
      item.createTimeText = item?.createTime?.date
      item.createName = item?.creator?.name
      item.vdcName = item?.vdc?.name
    })
  }
)
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '', prop: 'name', useSlot: true },
  { label: '描述', prop: 'remark' },
  { label: 'VDC', prop: 'vdcName' },
  { label: '创建者', prop: 'createName' },
  { label: '创建时间', prop: 'createTimeText' }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建项目',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  }
}
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { type: 'primary', title: '编辑', prop: 'edit' },
  { type: 'primary', title: '删除', prop: 'delete' }
]
// 行数据
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
  } else if (command === 'delete') {
    deleteHandle(row.id, '/', '确定要删除当前项目吗？', '删除项目')
  }
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()

const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
const router = useRouter()
const clickDetail = (row: any) => {
  rowData.value = row
  router.push({
    path: '/business-center/organization-manage/project-manage/detail',
    query: { id: row?.id, vdcId: row?.vdc?.id, vdcCode: row?.vdc?.code }
  })
}
</script>

<style scoped lang="scss">
.project-manage {
  padding: $idealPadding;
}
</style>
