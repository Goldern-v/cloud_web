<template>
  <div class="tag">
    <div class="ideal-tip-text">您还可以添加9个标签。标签由键和值组成，针对分层管理资源可用键和值，普通管理资源只用键即可，值可以为空。</div>

    <ideal-button-events
      class="ideal-default-margin-top"
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false">
      <template #operation>
        <el-table-column label="操作" width="250">
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
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders, IdealTableColumnOperate, IdealButtonEventProp } from '@/types'

const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: ''
})
const { getDataList, deleteHandle, currentChangeHandle} = useCrud(state)

onMounted(() => {
  getDataList()
})

// 行数据操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]

// 行数据操作
const clickOperateEvent = (command: string | number | object, row: any) => {
}
state.dataList = [
  { number: '2', value: '1' },
  { number: '4', value: '3' },
  { number: '5', value: '9' }
]
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '键', prop: 'number' },
  { label: '值', prop: 'value' }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '添加标签',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'addTag'
  }
}
// 右侧按钮
const rightButtons = ref<IdealButtonEventProp[]>([
  { prop: 'refresh', icon: 'refresh-icon' }
])
  const clickRightEvent = (value: string | number | object) => {}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  currentChangeHandle(state.page as number) // 查询当前页数据
}
</script>

<style scoped lang="scss">
.tag {
  padding: 0 $idealPadding $idealPadding;
  background-color: white;
  // 操作组件修改弹性伸缩方向
  :deep(.ideal-table-operate__container) {
    justify-content: flex-start;
  }
}
</style>