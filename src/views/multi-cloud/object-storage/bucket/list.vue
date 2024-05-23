<template>
  <div class="ideal-main-container bucket">
    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      ref="multipleTableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="桶名称">
          <template #default="props">
            <el-button link type="primary" @click="clickDetail">{{
              props.row.name
            }}</el-button>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'id' }
]
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)

state.dataList = [
  {
    name: 'test01',
    storageClass: '标准存储',
    area: '华为-北京四',
    storagePolicy: '多AZ存储',
    storageUsage: '0 byte',
    bucketPolicy: '私有桶',
    objectNumber: '0',
    tag: '--',
    createTime: '2023-11-14 14:27:00'
  }
]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '桶名称', prop: 'name', useSlot: true },
  { label: '存储类别', prop: 'storageClass' },
  { label: '区域', prop: 'area' },
  { label: '数据冗余存储策略', prop: 'storagePolicy', width: '130' },
  { label: '存储用量', prop: 'storageUsage' },
  { label: '桶策略', prop: 'bucketPolicy' },
  { label: '对象数量', prop: 'objectNumber' },
  { label: '标签', prop: 'tag' },
  { label: '创建时间', prop: 'createTime' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '修改存储类别', prop: 'change' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'change') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.change
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建桶',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '导出', prop: 'export' }
])
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  }
}

const clickDetail = () => {
  router.push({ path: '/multi-cloud/object-storage/bucket/detail' })
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  if (dialogType.value === 'resourcePool') {
    router.push({ path: '/multi-cloud/object-storage/bucket/create' })
  }
  showDialog.value = false
}
</script>

<style scoped lang="scss">
.bucket {
  background-color: white;
  padding: $idealPadding;
}
</style>
