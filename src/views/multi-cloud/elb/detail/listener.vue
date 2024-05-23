<template>
  <div class="monitor-container">
    <ideal-button-events
      :left-btns="attrData.leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

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
            <div class="vpc-table-title" @click="clickRedirectDetail">
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

      <template #backEnd>
        <el-table-column label="默认后端服务器组">
          <template #default="props">
            <div>{{ props.row.serverGroup }}</div>
            <el-text type="primary"> 查看/添加后端服务器 </el-text>
          </template>
        </el-table-column>
      </template>

      <template #healthCheck>
        <el-table-column label="默认后端服务器组">
          <template #default="props">
            <div>{{ props.row.statusText }}</div>
            <el-text type="primary">配置</el-text>
          </template>
        </el-table-column>
      </template>

      <template #accessControl>
        <el-table-column label="访问控制">
          <template #default="props">
            <div>{{ props.row.access }}</div>
            <el-text type="primary">设置</el-text>
          </template>
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
  </div>
</template>

<script setup lang="ts">
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { clickCopy } from '@/utils/tool'
// 列表左侧按钮
const attrData = reactive({
  leftButtons: [] as IdealButtonEventProp[]
})

attrData.leftButtons = [
  {
    title: '添加监听器',
    prop: 'create'
  }
]

const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})

state.dataList = [
  {
    serverGroup: 'server-group-1b38',
    name: 'listener-1afe',
    uuid: '4df85d-f00d-45d5-9b61',
    statusText: '异常',
    access: '允许所有IP访问',
    frontEnd: 'TCP/80'
  }
]
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.showCopy = false
      })
    }
  }
)
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '前端协议/端口', prop: 'frontEnd' },
  { label: '默认后端服务器组', prop: 'backEnd', useSlot: true },
  { label: '转发策略', prop: 'forwardStrategy' },
  { label: '健康检查', prop: 'healthCheck', useSlot: true },
  { label: '监控', prop: 'monitor', useSlot: true },
  { label: '访问控制', prop: 'accessControl', useSlot: true }
]

const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    router.push({
      path: '/multi-cloud/elb/add-listener'
    })
  }
}

const router = useRouter()
// 详情
const clickRedirectDetail = () => {
  router.push({ path: '' })
}

// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'edit') {
  }
}
</script>

<style scoped lang="scss">
.monitor-container {
  margin: $idealMargin 0;
  background-color: #fff;
  padding: $idealPadding;
  .el-text {
    cursor: pointer;
  }
}
</style>
