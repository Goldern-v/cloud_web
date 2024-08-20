<template>
  <div class="trusteeship">
    <div class="ideal-middle-margin-bottom">
      {{ '托管连接(' + state.total + ')' }}
    </div>

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
      :page="state.page"
      :pagination-type="PaginationTypeEnum.totalSizes"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #id>
        <el-table-column label="ID" show-overflow-tooltip width="120">
          <template #default="props">
            <div>{{ props.row.connectionId }}</div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import { existPropWithArray } from '@/utils/tool'
import { cloudResourceShareList } from '@/api/java/operate-center'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealSearchResult,
  IdealButtonEventProp
} from '@/types'
import { FiltrateEnum, PaginationTypeEnum } from '@/utils/enum'
import { shareConStatus } from '../../common'

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
  cloudResourceShareList(params)
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
  value => {
    if (value) {
      value.forEach((item: any) => {
        item.statusText = item.connectionState
          ? shareConStatus[item.connectionState]
          : ''
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
  { label: '名称', prop: 'connectionName' },
  { label: '区域', prop: 'region' },
  { label: '互连ID', prop: 'connectionId' },
  { label: 'AWS账户', prop: 'ownerAccount' },
  { label: 'VLAN', prop: 'vlan' },
  { label: '带宽', prop: 'bandwidth' },
  { label: '状态', prop: 'statusText' }
]

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '查看详细信息',
    prop: 'check',
    disabled: true,
    disabledText: '暂不支持'
  },
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
