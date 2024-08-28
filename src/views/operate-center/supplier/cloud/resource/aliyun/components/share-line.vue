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
      :page="state.page"
      :pagination-type="PaginationTypeEnum.totalSizes"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #name>
        <el-table-column label="实例ID/名称" show-overflow-tooltip width="120">
          <template #default="props">
            <div>{{ props.row.name }}</div>
            <div>{{ props.row.physicalConnectionId }}</div>
          </template>
        </el-table-column>
      </template>
      <!-- 此次优化未开发操作接口，暂时屏蔽 -->
      <!-- <template #operation>
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template> -->
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import { existPropWithArray } from '@/utils/tool'
import { cloudResourceShareList } from '@/api/java/operate-center'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealSearchResult,
  IdealButtonEventProp
} from '@/types'
import { FiltrateEnum, PaginationTypeEnum } from '@/utils/enum'
import { shareConStatus } from '../../common'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'connectionName', type: FiltrateEnum.input },
  { label: '实例ID', prop: 'interconnectId', type: FiltrateEnum.input }
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
  cloudResourceShareList(params)
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
  value => {
    if (value) {
      value.forEach((item: any) => {
        item.statusText = item.status ? shareConStatus[item?.status] : ''
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
  { label: '名称/实例ID', prop: 'name', useSlot: true },
  { label: '接入点', prop: 'accessPointId' },
  { label: 'VLAN ID', prop: 'vlanId' },
  { label: '共享专线带宽(Mbps)', prop: 'bandwidth' },
  { label: '付费信息', prop: 'ChargeType' },
  { label: '共享专线拥有者ID', prop: 'AliUid' },
  { label: '状态', prop: 'statusText' }
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
    disabledText: '暂不支持',
    authority: 'resource:ali:detail:share:create'
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
