<template>
  <div class="ideal-main-container elastic-expansion-monitor">
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
        <el-table-column label="名称/ID">
          <template #default="props">
            <div class="monitor-table-title" @click="toDetail(props.row)">
              {{ props.row.name }}
            </div>

            <div class="flex-row flex-row-center">
              <el-tooltip
                effect="dark"
                :content="props.row.id"
                placement="top-start"
              >
                <div class="monitor-table-id">{{ props.row.id }}</div>
              </el-tooltip>

              <svg-icon
                icon="copy-icon"
                @click="clickCopy(props.row.id)"
              ></svg-icon>
            </div>
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="185">
          <el-button link type="primary" @click="viewMonitor"
            >查看监控图表</el-button
          >
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import type { IdealTextProp, IdealTableColumnHeaders } from '@/types'
import { clickCopy } from '@/utils/tool'
import { IHooksOptions } from '@/hooks/interface'

const searchOptions: IdealTextProp[] = [
  { label: '主机名', prop: 'name' },
  { label: 'Ip地址', prop: 'ipAddress' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '主机名称/Id', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status' },
  { label: '总实例数', prop: 'instanceName' },
  { label: '最小实例数', prop: 'instanceName' },
  { label: '最大实例数', prop: 'instanceName' },
  { label: '伸缩配置', prop: 'instanceUuid' },
  { label: '创建时间', prop: 'createTime' }
]
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
state.dataList = [
  {
    name: 'eip-test',
    id: 'swqcc-s12-saojxc'
  }
]
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
const searchValue = ref('')

const router = useRouter()
const viewMonitor = () => {
  router.push({
    path: '/maintenance-center/monitor-chart/index',
    query: {
      monitorObject: 'elastic-expansion'
    }
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
.elastic-expansion-monitor {
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
