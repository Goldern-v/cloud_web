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
            <div class="monitor-table-title" @click="toDetail(props.row)">
              {{ props.row.name }}
            </div>
            <ideal-text-copy
              :row="props.row"
              label-key="vmId"
              copy-key="vmId"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #ipAddress>
        <el-table-column label="IP地址" width="150" show-overflow-tooltip>
          <template #default="props">
            <ip-address
              :data-array="props.row.nicList"
              @mouseEnterPrivate="
                value => (props.row.nicList[0].privateIpCopy = value)
              "
              @mouseLeavePrivate="
                value => (props.row.nicList[0].privateIpCopy = value)
              "
              @mouseEnterPublic="
                value => (props.row.nicList[0].eip.publicIpCopy = value)
              "
              @mouseLeavePublic="
                value => (props.row.nicList[0].eip.publicIpCopy = value)
              "
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
              >查看监控图表</el-button
            >
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import ipAddress from './ip-address.vue'
import { useCrud } from '@/hooks'
import type { IdealTextProp, IdealTableColumnHeaders } from '@/types'
import { IHooksOptions } from '@/hooks/interface'
import { vmMonitorList } from '@/api/java/maintenance-center'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { resourceTypeEnum } from '@/utils/enum'
import store from '@/store'

/**
 * 列表
 */
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '主机名称/Id', prop: 'name', useSlot: true },
  { label: 'IP地址', prop: 'ipAddress', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: 'CPU使用率(%)', prop: 'cpuUtil' },
  { label: '内存使用率(%)', prop: 'memUtil' },
  { label: '磁盘使用率(%)', prop: 'diskUtil' },
  { label: '云平台类别', prop: 'pool.cloudCategoryName' },
  { label: '云平台类型', prop: 'pool.cloudTypeName' },
  { label: '资源池名称', prop: 'pool.name' },
  { label: '所属项目', prop: 'project.name' },
  { label: '创建时间', prop: 'createTime' }
]

const { resourcePool } = storeToRefs(store.resourceStore)
onMounted(() => {})
const state: IHooksOptions = reactive({
  dataListUrl: vmMonitorList,
  deleteUrl: '',
  queryForm: {
    cloudResourcePoolId: resourcePool.value?.resourcePoolId
  }
})

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
const searchValue = ref('')

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
const searchOptions: IdealTextProp[] = [
  { label: '主机名', prop: 'name' },
  { label: 'Ip地址', prop: 'ipAddress' }
]
// 列表搜索
const clickSearch = (search: string, type: string) => {
  searchValue.value = search
  getDataList()
}
// 列表重置
const clickReset = () => {
  state.page = 1
  searchValue.value = ''
  getDataList()
}

//过滤云主机状态
const filterStatus = (command: string | number | object) => {
  console.log(command)
}

onBeforeRouteLeave((to, from, next) => {
  store.routerStore.setMonitorSidebar(from.fullPath)
  next()
})
//查看监控图表
const router = useRouter()
const viewMonitor = (row: any) => {
  const data = JSON.stringify({
    monitorObject: resourceTypeEnum.ECS,
    uuid: row.vmId,
    cloudCategory: row.pool.cloudCategory,
    cloudType: row.pool.cloudType
  })
  router.push({
    path: '/maintenance-center/monitor-chart/index',
    query: { data }
  })
}

const toDetail = (row: any) => {
  console.log(row)
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
  .monitor-table-title {
    color: var(--el-color-primary);
    cursor: pointer;
  }
  .monitor-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 3px;
  }
}
</style>
