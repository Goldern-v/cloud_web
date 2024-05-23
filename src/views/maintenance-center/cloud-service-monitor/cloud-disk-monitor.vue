<template>
  <div class="ideal-main-container cloud-disk-monitor">
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
        <el-table-column label="名称/ID" width="280" show-overflow-tooltip>
          <template #default="props">
            <el-button
              link
              type="primary"
              :disabled="props.row.statusIcon === 'loading'"
              >{{ props.row.name }}</el-button
            >

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
import { cloudDiskPageUrl } from '@/api/java/store'
import { resourceTypeEnum } from '@/utils/enum'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import store from '@/store'

const searchOptions: IdealTextProp[] = [
  { label: '主机名', prop: 'name' },
  { label: 'Ip地址', prop: 'ipAddress' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '主机名称/Id', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '磁盘属性', prop: 'diskAttribute' },
  { label: '磁盘类型', prop: 'volumeTypeName' },
  { label: '挂载云主机', prop: 'instanceName' },
  {
    label: '云平台类别',
    prop: 'cloudResourcePool.cloudCategoryName'
  },
  {
    label: '云平台类型',
    prop: 'cloudResourcePool.cloudTypeName'
  },
  { label: '资源池名称', prop: 'cloudResourcePool.name' },
  { label: '所属项目', prop: 'projectName' },
  { label: '创建时间', prop: 'createTime.date' }
]
const state: IHooksOptions = reactive({
  dataListUrl: cloudDiskPageUrl,
  deleteUrl: '',
  queryForm: {}
})

watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
        item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
        item.diskAttribute = item.bootable === 1 ? '系统盘' : '数据盘'
      })
    }
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
    monitorObject: resourceTypeEnum.EBS,
    uuid: row.uuid,
    cloudCategory: row.cloudResourcePool?.cloudCategory,
    cloudType: row.cloudResourcePool?.cloudType
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
.cloud-disk-monitor {
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
