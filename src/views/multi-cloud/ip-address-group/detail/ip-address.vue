<template>
  <div class="ip-address-detail">
    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
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
import {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import { OperateEventEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import dialogBox from '../dialog-box.vue'

// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '添加IP地址',
    prop: 'add'
  },
  {
    title: '修改IP地址',
    prop: 'edit'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  showDialog.value = true
  if (value === 'add') {
    dialogType.value = OperateEventEnum.add
  } else if (value === 'edit') {
    dialogType.value = OperateEventEnum.edit
  }
}

/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})

state.dataList = [
  {
    name: 'ipGroup-637ds',
    uuid: 'wq8x-2882dc- 9xqy',
    ipAddress: '192.168.10.10',
    createDate: '2023/10/11 11::36:30'
  }
]

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'IP地址', prop: 'ipAddress' },
  { label: '备注', prop: 'remark' }
]

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

// 列表操作
const operateBtns: IdealTableColumnOperate[] = []
const clickOperateEvent = (command: string | number | object, row: object) => {}

/**
 * 弹窗
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
</script>

<style scoped lang="scss"></style>
