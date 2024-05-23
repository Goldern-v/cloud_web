<template>
  <div class="trusteeship">
    <div class="ideal-middle-margin-bottom">托管连接(1)</div>

    <ideal-search
      ref="searchRef"
      :type-array="typeArray"
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      @clickSearch="onClickSearch"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :pagination-type="PaginationTypeEnum.totalSizes"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #id>
        <el-table-column label="ID" show-overflow-tooltip width="120">
          <template #default="props">
            <div>{{ props.row.id }}</div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            ></ideal-status-icon>
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
import { RESOURCE_STATUS_ICON, RESOURCE_STATUS } from '@/utils/dictionary'
import {
  resourcePoolList,
  resourcePoolDeleteUrl
} from '@/api/java/operate-center'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealSearchResult,
  IdealButtonEventProp
} from '@/types'
import {
  FiltrateEnum,
  PaginationTypeEnum
} from '@/utils/enum'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input }
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

const state: IHooksOptions = reactive({
  dataListUrl: resourcePoolList,
  deleteUrl: resourcePoolDeleteUrl,
  queryForm: {}
})

const { sizeChangeHandle, currentChangeHandle, deleteHandle, getDataList } =
  useCrud(state)
watch(
  () => state.dataList,
  value => {
    if (value) {
      value.forEach((item: any) => {
        item.statusIcon = RESOURCE_STATUS_ICON[item?.status.toUpperCase()]
        item.statusText = RESOURCE_STATUS[item?.status.toUpperCase()]
      })
      loopUpdateStatus()
    }
  }
)
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
      getDataList()
    }, 5000)
  } else {
    if (timer) {
      clearTimeout(timer)
    }
  }
}

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'ID', prop: 'id', useSlot: true },
  { label: '名称', prop: 'cloudTypeName' },
  { label: '区域', prop: 'cloudPlatform.name' },
  { label: '互连ID', prop: 'status' },
  { label: 'AWS账户', prop: 'remark' },
  { label: 'VLAN', prop: 'creator.name' },
  { label: '带宽', prop: 'createTime.date' },
  { label: '状态', prop: 'status', useSlot: true }
]

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '查看详细信息', prop: 'check', disabled: true, disabledText: '暂不支持' },
  { title: '删除', prop: 'delete', disabled: true, disabledText: '暂不支持' },
  { title: '分配连接', prop: 'alloc', disabled: true, disabledText: '暂不支持' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'check') {
  }
}
// 获取搜索组件
const searchRef = ref()

</script>

<style scoped lang="scss">
.trusteeship {
  padding: $idealPadding;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select .el-input) {
    width: 200px;
  }
  .trusteeship__button {
    justify-content: space-between;
    align-items: center;
  }
}
</style>
