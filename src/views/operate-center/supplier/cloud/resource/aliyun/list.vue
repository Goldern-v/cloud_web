<template>
  <div class="aliyun">
    <ideal-search
      ref="searchRef"
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
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
      :page="state.page"
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
            <div>{{ props.row.physicalConnectionId }}</div>
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
  IdealSearchResult,
  IdealButtonEventProp
} from '@/types'
import { FiltrateEnum, PaginationTypeEnum } from '@/utils/enum'
import { loaStatusFormat } from '../common'

// 获取搜索组件
const searchRef = ref()
// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '连接名称', prop: 'connectionName', type: FiltrateEnum.input },
  { label: '连接ID', prop: 'interconnectId', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {}
  state.queryForm.cloudType = 'ALI_CLOUD'
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
    cloudType: 'ALI_CLOUD'
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
        state.dataList = res.data.aliCloudConnectionOutDto.aliConnectionDtoList
        state.total = res.data.aliCloudConnectionOutDto.count
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
watch(
  () => state.dataList,
  val => {
    if (val?.length) {
      val.forEach((item: any) => {
        item.statusText = loaStatusFormat[item.loaStatus]
      })
    }
  }
)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '实例ID/名称', prop: 'name', useSlot: true },
  { label: '施工流程', prop: 'statusText' },
  { label: '接入点', prop: 'accessPointId' },
  { label: '物理专线运营商', prop: 'lineOperator' },
  { label: '专线类型', prop: 'productType' }
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
    disabledText: '暂不支持',
    authority: 'resource:ali:apply:port'
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
    path: '/operate-center/supplier/resource/aliyun/detail',
    query: {
      id: rowData.physicalConnectionId
    }
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
