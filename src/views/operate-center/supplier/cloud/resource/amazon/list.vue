<template>
  <div class="amazon">
    <ideal-search
      ref="searchRef"
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
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
              {{ props.row.interconnectId }}
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import { cloudResourceList } from '@/api/java/operate-center'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import { FiltrateEnum, PaginationTypeEnum } from '@/utils/enum'
import { awsStatusFormat } from '../common'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '连接名称', prop: 'connectionName', type: FiltrateEnum.input },
  { label: '连接ID', prop: 'interconnectId', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {}
  state.queryForm.cloudType = 'AWS'
  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      state.queryForm[item.prop] = item.value
    })
  }
  state.page = 1
  getDataList()
}

const state: IHooksOptions = reactive({
  dataListLoading: false,
  queryForm: {
    cloudType: 'AWS'
  },
  dataList: [],
  page: 1,
  limit: 10,
  total: 0
})

onMounted(() => {
  getDataList()
})

const getDataList = () => {
  state.dataListLoading = true
  const params = {
    pageNum: state.page,
    pageSize: state.limit,
    ...state.queryForm
  }
  cloudResourceList(params)
    .then((res: any) => {
      state.dataListLoading = false
      const { code } = res
      if (code === 200) {
        state.dataList = res.data.awsCloudConnectionOutDto.awsConnectionDtoList
        state.total = res.data.awsCloudConnectionOutDto.count
      } else {
        state.dataList = []
        state.total = 0
      }
    })
    .catch(_ => {
      state.dataListLoading = false
      state.dataList = []
      state.total = 0
    })
}

watch(
  () => state.dataList,
  value => {
    if (value) {
      value.forEach((item: any) => {
        item.statusText = item.interconnectState
          ? awsStatusFormat[item.interconnectState]
          : ''
      })
    }
  }
)

const sizeChangeHandle = (val: number) => {
  state.dataList = []
  state.page = 1
  state.limit = val
  getDataList()
}

const currentChangeHandle = (val: number) => {
  state.dataList = []
  state.page = val
  getDataList()
}

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'ID', prop: 'id', useSlot: true },
  { label: '名称', prop: 'interconnectName' },
  { label: '区域', prop: 'region' },
  { label: '位置', prop: 'location' },
  { label: '带宽', prop: 'bandwidth' },
  { label: '状态', prop: 'statusText' }
]

// 获取搜索组件
const searchRef = ref()

const router = useRouter()
// 详情
const clickDetail = (rowData: any) => {
  router.push({
    path: '/operate-center/supplier/resource/amazon/detail',
    query: {
      id: rowData.interconnectId
    }
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
