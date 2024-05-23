<template>
  <div class="share-line">
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
      <template #name>
        <el-table-column label="实例ID/名称" show-overflow-tooltip width="120">
          <template #default="props">
            <div>{{ props.row.name }}</div>
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

      <template #operation>
        <el-table-column label="操作" fixed="right" width="150">
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
import { RESOURCE_STATUS_ICON, RESOURCE_STATUS } from '@/utils/dictionary'
import {
  resourcePoolList,
  resourcePoolDeleteUrl
} from '@/api/java/operate-center'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
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
        item.readOnly = item.cloudPlatform?.mode ? '只读' : '读写'
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
  { label: '实例ID/名称', prop: 'name', useSlot: true },
  { label: '标签', prop: 'cloudTypeName' },
  { label: '接入点', prop: 'cloudPlatform.name' },
  { label: 'VLAN ID', prop: 'status', useSlot: true },
  { label: '共享专线带宽(Mbps)', prop: 'remark', width: '150' },
  { label: '付费信息', prop: 'creator.name' },
  { label: '端口连接状态', prop: 'createTime.date', width: '150' },
  { label: '共享专线拥有者ID', prop: 'createTime.date', width: '150' },
  { label: '状态', prop: 'createTime.date' }
]
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '变配', prop: 'transform' },
  { title: '终止', prop: 'terminate' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'edit') {
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
    {
      title: '创建共享端口',
      prop: 'create',
      type: 'primary',
      icon: 'circle-add',
      iconColor: 'white',
      disabled: true,
      disabledText: '暂不支持'
    }
  ])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
  }
}
// 获取搜索组件
const searchRef = ref()
// 重置
const clickReset = () => {
  searchRef.value.clickDeleteAll()
}

</script>

<style scoped lang="scss">
.share-line {
  padding: $idealPadding;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select .el-input) {
    width: 200px;
  }
  .share-line__button {
    justify-content: space-between;
    align-items: center;
  }
}
</style>
