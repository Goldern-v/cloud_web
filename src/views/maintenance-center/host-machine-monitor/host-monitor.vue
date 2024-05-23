<template>
  <div class="ideal-main-container cloud-host-monitor">
    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
    </ideal-select-search>

    <el-divider border-style="solid" />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID" width="280">
          <template #default="props">
            <div>
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

      <template #status>
        <el-table-column>
          <template #header>
            <el-dropdown
              style="vertical-align: middle; font-size: 12px"
              @command="filterStatus"
            >
              <span>
                状态
                <svg-icon icon="down-arrow"></svg-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="active">正在运行</el-dropdown-item>
                  <el-dropdown-item command="power-on">开机</el-dropdown-item>
                  <el-dropdown-item command="shift-off">关机</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            />
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <el-button link type="primary" @click="viewMonitor(props.row)"
              >查看监控指标</el-button
            >
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import type { IdealTableColumnHeaders, IdealTextProp } from '@/types'
import { IHooksOptions } from '@/hooks/interface'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { hostMonitorList } from '@/api/java/maintenance-center'
import store from '@/store'

const searchOptions: IdealTextProp[] = [
  { label: '主机名', prop: 'name' },
  { label: 'Ip地址', prop: 'ipAddress' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '主机名称/Id', prop: 'name', useSlot: true },
  { label: 'IP地址', prop: 'ip' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: 'CPU使用率(%)', prop: 'cpuUtil' },
  { label: '内存使用率(%)', prop: 'memUtil' },
  { label: '磁盘使用率(%)', prop: 'diskUtil' },
  { label: '创建时间', prop: 'createTime.date' }
]
const state: IHooksOptions = reactive({
  dataListUrl: hostMonitorList,
  deleteUrl: '',
  queryForm: {}
})
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle } =
  useCrud(state)

watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusText = RESOURCE_STATUS[item?.status]
        item.statusIcon = RESOURCE_STATUS_ICON[item?.status]
      })
    }
  }
)

onBeforeRouteLeave((to, from, next) => {
  store.routerStore.setMonitorSidebar(from.fullPath)
  next()
})
const router = useRouter()
const viewMonitor = (row: any) => {
  const data = JSON.stringify({
    monitorObject: 'HOST',
    uuid: row.uuid,
    cloudCategory: row.pool.cloudCategory,
    cloudType: row.pool.cloudType
  })
  router.push({
    path: '/maintenance-center/monitor-chart/index',
    query: { data }
  })
}

//过滤云主机状态
const filterStatus = (command: string | number | object) => {
  console.log(command)
}

const searchValue = ref('')
const clickSearch = (search: string, type: string) => {
  searchValue.value = search
}
// 列表重置
const clickReset = () => {
  state.page = 1
  searchValue.value = ''
}
</script>

<style scoped lang="scss">
.cloud-host-monitor {
  padding: $idealPadding;
  background-color: #fff;
  .flex-row-center {
    align-items: center;
    justify-content: center;
  }
}
</style>
