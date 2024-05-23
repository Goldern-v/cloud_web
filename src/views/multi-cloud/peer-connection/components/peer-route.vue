<template>
  <div class="peer-route">
    <div class="peer-route-tip">
      两个VPC创建对等连接后，需要配置本端和对端VPC的路由，方可实现VPC互通，请前往路由表添加该对等连接的本端路由
    </div>

    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      prefix-title="模糊查询"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
    </ideal-select-search>

    <el-button type="primary" @click="clickPeerRouteCreate">
      <svg-icon
        icon="circle-add"
        color="white"
        class="ideal-svg-margin-right"
      ></svg-icon>
      添加对端路由
    </el-button>

    <el-divider class="ideal-large-margin-top" />

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
import dialogBox from '../dialog-box.vue'
import {
  PaginationTypeEnum,
  OperateEventEnum,
  SearchTypeEnum
} from '@/utils/enum'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'

const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)
// 行数据操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '删除', prop: 'delete' }
]
// 行数据操作
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'delete') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  }
}
state.dataList = [{ destination: '192.168.0.1', nextAddress: '192.168.0.11' }]
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '目的地址', prop: 'destination' },
  { label: '下一跳地址', prop: 'nextAddress' }
]
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  currentChangeHandle(state.page as number) // 查询当前页数据
}
// 创建对端路由
const clickPeerRouteCreate = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.create
}
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
</script>

<style scoped lang="scss">
.peer-route {
  width: 100%;
  padding: 0 20px 20px;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select .el-input) {
    width: 200px;
  }
  :deep(.el-tabs__header) {
    margin: 0;
  }
  .peer-route-tip {
    background-color: var(--custom-information-bg-color);
    padding: 10px;
  }
}
</style>
