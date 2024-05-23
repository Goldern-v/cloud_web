<template>
  <div class="ideal-main-container elastic-public-ip-monitor">
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
        <el-table-column label="弹性公网IP">
          <template #default="props">
            <div class="ideal-theme-text" @click="toDetail(props.row)">
              {{ props.row.ipAddress }}
            </div>
            <div>
              {{ props.row.name }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #id>
        <el-table-column label="ID">
          <template #default="props">
            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            />
          </template>
        </el-table-column>
      </template>

      <template #bandwidthName>
        <el-table-column label="带宽">
          <template #default="props">
            <div class="eip-table-title" @click="toDetail(props.row)">
              {{ props.row.bandwidth?.name }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #instance>
        <el-table-column label="已绑定实例">
          <template #default="props">
            <div v-if="props.row.bindInstanceName">
              <el-tooltip
                effect="dark"
                placement="top-start"
                :content="props.row.bindInstanceName"
              >
                <div
                  class="eip-table-title eip-table-sub"
                  @click="toDetail(props.row)"
                >
                  {{ props.row.bindInstanceName }}
                </div>
              </el-tooltip>

              <div class="eip-table-sub">
                {{ props.row.bindInstanceType }}
              </div>
            </div>

            <div v-else class="ideal-warning-text">未绑定实例，扣费中</div>
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
import { useCrud } from '@/hooks'
import type { IdealTextProp, IdealTableColumnHeaders } from '@/types'
import { IHooksOptions } from '@/hooks/interface'
import { resourceTypeEnum } from '@/utils/enum'
import { queryEipPage } from '@/api/java/network'
import store from '@/store'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'

const searchOptions: IdealTextProp[] = [
  { label: '主机名', prop: 'name' },
  { label: 'Ip地址', prop: 'ipAddress' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP', prop: 'name', useSlot: true },
  { label: 'ID', prop: 'id' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '带宽', prop: 'bandwidthName', useSlot: true },
  { label: '绑定实例', prop: 'instance', useSlot: true },
  { label: '云平台类别', prop: 'cloudPlatformCategory' },
  { label: '云平台类型', prop: 'cloudPlatformType' },
  { label: '资源池名称', prop: 'resourcePoolName' },
  { label: '所属项目', prop: 'projectName' },
  { label: '创建时间', prop: 'createTime.date' }
]
const state: IHooksOptions = reactive({
  dataListUrl: queryEipPage,
  deleteUrl: '',
  queryForm: {}
})

watch(
  () => state.dataList,
  arr => {
    arr?.forEach((item: any) => {
      item.showCopy = false
      item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
      item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
    })
  }
)

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
const searchValue = ref('')

const router = useRouter()

onBeforeRouteLeave((to, from, next) => {
  store.routerStore.setMonitorSidebar(from.fullPath)
  next()
})

const viewMonitor = (row: any) => {
  const data = JSON.stringify({
    monitorObject: resourceTypeEnum.EIP,
    uuid: row.uuid,
    cloudCategory: row.cloudPlatformCategoryCode,
    cloudType: row.cloudPlatformTypeCode
  })
  router.push({
    path: '/maintenance-center/monitor-chart/index',
    query: { data }
  })
}
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

const toDetail = (row: any) => {
  console.log(row)
}
</script>

<style scoped lang="scss">
.elastic-public-ip-monitor {
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
