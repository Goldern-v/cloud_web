<template>
  <div class="amazon">
    <ideal-search
      ref="searchRef"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
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
        <el-table-column label="ID" show-overflow-tooltip>
          <template #default="props">
            <div
              class="custom-color amazon__table-name"
              @click="clickDetail(props.row)"
            >
              {{ props.row.id }}
            </div>
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
import {
  resourcePoolList,
  resourcePoolDeleteUrl
} from '@/api/java/operate-center'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealSearchResult
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

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'ID', prop: 'id', useSlot: true },
  { label: '名称', prop: 'name' },
  { label: '区域', prop: 'cloudPlatform.name' },
  { label: '位置', prop: 'status' },
  { label: '带宽', prop: 'remark' },
  { label: '状态', prop: 'status', useSlot: true }
]

// 获取搜索组件
const searchRef = ref()

const router = useRouter()
// 详情
const clickDetail = (rowData: any) => {
  router.push({
    path: '/operate-center/supplier/resource/amazon/detail'
  })
}
</script>

<style scoped lang="scss">
.amazon {
  padding: $idealPadding;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select .el-input) {
    width: 200px;
  }
  .amazon__button {
    justify-content: space-between;
    align-items: center;
  }
  .custom-color {
    color: var(--el-color-primary);
  }
  .amazon__table-name {
    cursor: pointer;
  }
}
</style>
