<template>
  <div class="ideal-main-container server-group">
    <div class="flex-row server-group__search">
      <ideal-select-search
        :search-type="SearchTypeEnum.title"
        prefix-title="模糊查询"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
      </ideal-select-search>
    </div>

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID">
          <template #default="props">
            <div
              class="server-group-table-title"
              @click="clickRedirectDetail(props.row)"
            >
              {{ props.row.name }}
            </div>

            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #listener>
        <el-table-column label="监听器">
          <template #default="props"
            ><div>
              <span class="server-group-table-title">
                {{ props.row.listener }} </span
              ><span>({{ props.row.protocol }}/{{ props.row.port }})</span>
            </div></template
          >
        </el-table-column>
      </template>

      <template #healthCheck>
        <el-table-column label="健康检查">
          <template #default="props"
            ><div>
              <p>
                <svg-icon
                  icon="info-warning"
                  color="#F3AD3C"
                  class="ideal-svg-margin-right"
                ></svg-icon>
                {{ props.row.statusText
                }}<span class="server-group-table-title"
                  >({{ props.row.stateNum }})</span
                >
              </p>
              <p class="server-group-table-title">配置</p>
            </div></template
          >
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
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
    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { OperateEventEnum, SearchTypeEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import dialogBox from './dialog-box.vue'

/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})

state.dataList = [
  {
    name: 'server-group-test',
    uuid: 'wq8x-2882dc- 9xj',
    forwardMode: '负载均衡',
    protocol: 'TCP',
    listener: 'listener-safe',
    port: 80,
    equalizer: '共享型',
    statusText: '异常',
    strategyType: '加权轮询算法',
    stateNum: 1,
    serverNum: 1,
    balancer: 'elb-978a'
  }
]

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.name = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '转发模式', prop: 'forwardMode' },
  { label: '虚拟私有云', prop: 'vpc' },
  { label: '后端协议', prop: 'protocol' },
  { label: '监听器', prop: 'listener', useSlot: true },
  { label: '负载均衡器', prop: 'equalizer' },
  { label: '负载均衡', prop: 'lbs' },
  { label: '健康检查', prop: 'healthCheck', useSlot: true },
  { label: '服务器组类型', prop: 'type' },
  { label: '后端服务器数量', prop: 'serverNum' }
]

// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建后端服务器组',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  }
}

// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '添加后端服务器', prop: 'add' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'add') {
  }
}
/**
 * 弹窗
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  if (dialogType.value === 'resourcePool') {
    router.push({ path: '/multi-cloud/elb-server-group/create' })
  }
  showDialog.value = false
}
// 详情
const router = useRouter()
const clickRedirectDetail = (row: any) => {
  const detail = JSON.stringify(row)
  router.push({
    path: '/multi-cloud/elb-server-group/detail',
    query: {
      detail
    }
  })
}
</script>

<style scoped lang="scss">
.server-group {
  padding: $idealPadding;
  .server-group__search {
    align-items: center;
    justify-content: space-between;
  }
  .server-group-table-title {
    color: var(--el-color-primary);
    cursor: pointer;
  }
}
</style>
