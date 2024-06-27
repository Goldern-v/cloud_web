<template>
  <div class="ideal-main-container task">
    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #status>
        <el-table-column label="状态" width="120">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            />
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="120" fixed="right">
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
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'

import { IHooksOptions } from '@/hooks/interface'
import { existPropWithArray } from '@/utils/tool'
import { dateFormat, FormatsEnums } from '@/utils/time-format'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import { eventProgressPageUrl } from '@/api/java/public'

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm = {}
  if (type) {
    state.queryForm[type] = search
  }
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
  { label: 'ID', prop: 'uuid' }
]
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: eventProgressPageUrl,
  queryForm: {}
})

// 轮询
const loopUpdateStatus = () => {
  if (!state.dataList?.length) {
    return
  }
  let timer: number | undefined
  const existLoading = existPropWithArray(
    'loading',
    state?.dataList,
    'statusIcon'
  ) // 操作正在进行中

  if (existLoading) {
    timer = setTimeout(() => {
      query()
    }, 5000)
  } else {
    if (timer) {
      clearTimeout(timer)
    }
  }
}

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  query
} = useCrud(state)

watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
        item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
        item.startTime = dateFormat(item.createTime?.date,FormatsEnums.YMDHIS)
        item.endTime = dateFormat(item.endTime?.date,FormatsEnums.YMDHIS)
      })
    }
    loopUpdateStatus()
  }
)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'ID', prop: 'eventFlowId' },
  { label: '任务类型', prop: 'routeTypeName' },
  { label: '任务对象', prop: 'eventName' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '操作人', prop: 'operator.username' },
  { label: '开始时间', prop: 'startTime' },
  { label: '结束时间', prop: 'endTime' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '查看详情', prop: 'detail' }
]
const router = useRouter()
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'detail') {
    router.push({ path: '/multi-cloud/task/detail', query: { eventFlowId: row.eventFlowId } })
  }
}

</script>

<style scoped lang="scss">
.task {
  padding: $idealPadding;
  background-color: white;
  .task-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 3px;
    font-size: $defaultFontSize;
  }
  .task-font-size {
    font-size: $defaultFontSize;
  }
}
</style>
