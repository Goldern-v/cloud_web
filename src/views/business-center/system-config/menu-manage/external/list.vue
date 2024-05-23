<template>
  <div class="ideal-table-list__container external">
    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      prefix-title="名称"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
    </ideal-select-search>

    <el-divider />

    <el-button type="primary" @click="clickCreate">
      <svg-icon icon="circle-add" class="ideal-svg-margin-right" />
      创建菜单
    </el-button>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :page="state.page"
      :table-headers="tableHeaders"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #switch>
        <el-table-column label="开关">
          <template #default="props">
            <div>
              <el-switch v-model="props.row.switch" />
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="125">
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
import DialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum, OperateEventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'

const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

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
state.dataList = [
  {
    name: '安全中心',
    description: '您可以查看云管内资源概览、资源统计以及告警等数据信息',
    url: '/index',
    type: '内置菜单'
  }
]
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '菜单名称', prop: 'name' },
  { label: '类型', prop: 'type' },
  { label: '描述', prop: 'description' },
  { label: 'URL', prop: 'url' }
]
// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'edit') {
  }
}
const clickCreate = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.create
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>

<style scoped lang="scss">
.external {
  width: 100%;
  padding: 20px;
  :deep(.el-input) {
    width: 200px;
    height: 34px;
  }
  :deep(.el-divider--vertical) {
    margin: 0 12px;
  }
  // 修改列表高度
  :deep(.el-table) {
    height: calc(
      100vh - var(--navigation-bar-height) - var(--theme-header-height) - 40px -
        59px - 20px - 40px - 54px - 24px - 32px - 20px - 34px - 15px
    );
  }
}
</style>
