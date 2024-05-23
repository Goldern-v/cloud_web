<template>
  <div class="aliyun">
    <ideal-search
      ref="searchRef"
      :type-array="typeArray"
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
        <el-table-column label="实例ID/名称" show-overflow-tooltip>
          <template #default="props">
            <div
              class="custom-color aliyun__table-name"
              @click="clickDetail(props.row)"
            >
              {{ props.row.name }}
            </div>
            <div>{{ props.row.id }}</div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
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

// 获取搜索组件
const searchRef = ref()
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

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '实例ID/名称', prop: 'name', useSlot: true },
  { label: '标签', prop: 'cloudTypeName' },
  { label: '计量', prop: 'cloudPlatform.name' },
  { label: '施工流程', prop: 'status' },
  { label: '接入点', prop: 'remark' },
  { label: '物理专线运营商', prop: 'creator.name' },
  { label: '专线类型', prop: 'createTime.date' }
]

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
    {
      title: '申请物理端口',
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

const router = useRouter()
// 详情
const clickDetail = (rowData: any) => {
  router.push({
    path: '/operate-center/supplier/resource/aliyun/detail'
  })
}
</script>

<style scoped lang="scss">
.aliyun {
  padding: $idealPadding;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select .el-input) {
    width: 200px;
  }
  .aliyun__button {
    justify-content: space-between;
    align-items: center;
  }
  .custom-color {
    color: var(--el-color-primary);
  }
  .aliyun__table-name {
    cursor: pointer;
  }
}
</style>
