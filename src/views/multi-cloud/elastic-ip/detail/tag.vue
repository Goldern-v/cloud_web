<template>
  <div class="tag-container">
    <div class="flex-row" style="align-items: center">
      <el-button @click="addTag">添加标签</el-button>
      <div class="ideal-tip-text">
        您还可以添加加{{
          tagNum
        }}个标签，标签由键和值组成，针对分层管理资源可用键和值，普通管理资源只用键即可，值可以为空。
      </div>
    </div>
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #key>
        <el-table-column label="键">
          <template #default="props">
            <el-input v-model="props.key"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="值">
          <template #default="props">
            <el-input v-model="props.value"></el-input>
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="200px">
          <template #default="props">
            <el-button link type="primary" @click="handleDelete(props.$index)"
              >删除</el-button
            >
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
<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { OperateEventEnum } from '@/utils/enum'

const tagNum = ref(10)

//列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '键', prop: 'key', useSlot: true },
  { label: '值', prop: 'value', useSlot: true }
]
state.dataList = [
  {
    key: 'label1',
    value: 1
  }
]

const addTag = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.add
}
const handleDelete = (index: number) => {
  state.dataList?.splice(index, 1)
}

/**
 * 弹框
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
<style lang="scss" scoped>
.tag-container {
  margin: $idealMargin 0;
  background-color: #fff;
  padding: $idealPadding;
}
.el-button {
  margin-right: 10px;
}
</style>
