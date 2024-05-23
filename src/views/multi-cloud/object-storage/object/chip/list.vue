<template>
  <div class="chip">
    <div class="ideal-middle-margin-bottom">碎片是采用多段方式上传过程中或上传失败后产生的数据段，这些数据段会占用您的存储空间并产生一定的费用，建议定期清理不需要的碎片。</div>

    <ideal-button-events
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称">
          <template #default="props">
            <div class="ideal-theme-text">{{ props.row.name }}</div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185" fixed="right">
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
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'


// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)
state.dataList = [
  { name: '122', storageClass: '--', size: '--', modifyTime: '--' }
]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '文件名称', prop: 'name' },
  { label: '碎片数量', prop: 'number' },
  { label: '碎片大小', prop: 'size' },
  { label: '创建时间', prop: 'createTime' },
  { label: '段任务序列号', prop: 'index' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  // { title: '分享', prop: 'share' },
]
const clickOperateEvent = (command: string | number | object, row: any) => {}

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '删除',prop: 'delete' , disabled: true, disabledText: '请选择需要删除的对象' }
])
const clickLeftEvent = (value: string | number | object) => {}
watch(() => state.dataListSelections, value => {
  leftButtons.value[0].disabled = true
  if (value?.length) {
    leftButtons.value[0].disabled = false
  }
})
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'refresh',
    icon: 'refresh-icon'
  }
]
const clickRightEvent = (value: string | number | object) => {}
</script>

<style scoped lang="scss">
.chip {
  padding: 10px $idealPadding $idealPadding;
  background-color: white;
}
</style>
