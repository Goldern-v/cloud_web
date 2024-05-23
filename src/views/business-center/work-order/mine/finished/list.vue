<template>
  <div class="ideal-table-list__container finished">
    <div class="flex-row finished__search">
      <ideal-select-search
        :search-type="SearchTypeEnum.title"
        :slot-array="slotArray"
        prefix-title="工单ID"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
        <template #status>
          <el-select
            v-model="workorderStatus"
            placeholder="请选择"
            class="finished-workorder-status ideal-default-margin-right"
          >
            <template #prefix>工单状态:</template>
            <el-option
              v-for="item in workorderStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </ideal-select-search>
    </div>

    <el-divider />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusType"
              :status-text="props.row.status"
            ></ideal-status-icon>
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
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'

const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)
// 搜索插槽
const slotArray = ['status']
const workorderStatus = ref('')
const workorderStatusList: any = ref([])
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.queryForm = {}
  getDataList()
}
state.dataList = [
  { id: '79358308585', description: '云主机创建规格不显示', creator: 'test1.1', type: '弹性云主机', status: '已完成', statusType: 'status-success', createTime: '2023.4.7 17:20:11' },
  { id: '79353308587', description: '云主机创建规格不显示', creator: 'test1.2', type: '弹性云硬盘', status: '已驳回', statusType: 'status-error', createTime: '2023.5.7 17:20:11' }
]
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '工单ID', prop: 'id' },
  { label: '描述', prop: 'description' },
  { label: '提单人', prop: 'creator' },
  { label: '工单类型', prop: 'type' },
  { label: '工单状态', prop: 'status', useSlot: true },
  { label: '创建时间', prop: 'createTime' }
]
// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '查看详情', prop: 'detail' },
  { title: '删除', prop: 'delete' }
]
const router = useRouter()
const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'detail') {
    router.push({ path: '/business-center/work-order/mine/finished/detail' })
  }
}
</script>

<style scoped lang="scss">
.finished {
  width: 100%;
  padding: 20px;
  :deep(.el-select .el-input) {
    width: 200px;
  }
  .finished-workorder-status {
    width: 210px;
  }
  .finished__search {
    align-items: center;
    justify-content: space-between;
  }
  // 修改列表高度
  :deep(.el-table) {
    height: calc(100vh - var(--navigation-bar-height) - var(--theme-header-height) - 40px - 60px - 40px - 54px - 20px - 20px - 15px - 32px);
  }
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
}
</style>
