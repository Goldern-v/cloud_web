<template>
  <div class="finance">
    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      ref="tableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #interior>
        <el-table-column label="站内信">
          <template #default="props">
            <div><el-switch v-model="props.row.interior" @change="updateStatus(props.row, 'interior')"></el-switch></div>
          </template>
        </el-table-column>
      </template>

      <template #note>
        <el-table-column label="短信">
          <template #default="props">
            <div><el-switch v-model="props.row.note" @change="updateStatus(props.row, 'note')"></el-switch></div>
          </template>
        </el-table-column>
      </template>

      <template #email>
        <el-table-column label="邮箱">
          <template #default="props">
            <div><el-switch v-model="props.row.email" @change="updateStatus(props.row, 'email')"></el-switch></div>
          </template>
        </el-table-column>
      </template>

      <template #weChat>
        <el-table-column label="企业微信">
          <template #default="props">
            <div><el-switch v-model="props.row.weChat" @change="updateStatus(props.row, 'weChat')"></el-switch></div>
          </template>
        </el-table-column>
      </template>

      <template #dingTalk>
        <el-table-column label="钉钉">
          <template #default="props">
            <div><el-switch v-model="props.row.dingTalk" @change="updateStatus(props.row, 'dingTalk')"></el-switch></div>
          </template>
        </el-table-column>
      </template>
      <template #receiver>
        <el-table-column label="接收人">
          <template #default="props">
            <el-tooltip
              popper-class="custom-tooltip"
              effect="dark"
              placement="top"
              :disabled="props.row?.messageReceptionItemsList.length < 1"
            >
              <template #content>
                <div v-for="(item, idx) of props.row?.messageReceptionItemsList" :key="idx">
                  {{ item.name }}
                </div>
              </template>

              <div>
                <div
                  v-if="props.row?.messageReceptionItemsList[0]"
                >
                  {{ props.row?.messageReceptionItemsList[0].name }}
                </div>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" fixed="right" width="240">
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
      :is-batch="isBatch"
      :type="dialogType"
      :select-array="state.dataListSelections"
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import dialogBox from '../components/dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import { messageReceiveConfigUrl, messageReceiveConfigStatusUpdate } from '@/api/java/operate-center'

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: messageReceiveConfigUrl,
  queryForm: {
    messageCategory: 'FINANCE_MESSAGE'
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  query
} = useCrud(state)
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '消息类型', prop: 'name' },
  { label: '消息描述', prop: 'remark' },
  { label: '站内信', prop: 'interior', useSlot: true },
  { label: '短信', prop: 'note', useSlot: true },
  { label: '邮箱', prop: 'email', useSlot: true },
  { label: '企业微信', prop: 'weChat', useSlot: true },
  { label: '钉钉', prop: 'dingTalk', useSlot: true },
  { label: '接收人', prop: 'receiver', useSlot: true }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '添加接收人', prop: 'add' },
  { title: '移除接收人', prop: 'remove' },
  { title: '通知模版', prop: 'notice' }
]
const isBatch = ref(false)
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  isBatch.value = false
  rowData.value = row
  if (command === 'add') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.add
  } else if (command === 'remove') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.remove
  } else if (command === 'notice') {
    showDialog.value = true
    dialogType.value = 'notice'
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '添加接收人', prop: 'add', type: 'primary', disabled: true, disabledText: '请选择消息接收配置' }
])
const clickLeftEvent = (value: string | number | object) => {
  isBatch.value = true
  if (value === 'add') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.add
  } else if (value === 'remove') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.remove
  }
}
watch(() => state.dataListSelections, value => {
  leftButtons.value.forEach((item: any) => item.disabled = true)
  if (value?.length) {
    leftButtons.value.forEach((item: any) => item.disabled = false)
  }
})
const updateStatus = (row: any, type: string) => {
  const params: {[key: string]: any} = {
    id: row.id
  }
  if (type === 'interior') {
    params.interior = row.interior
  } else if (type === 'note') {
    params.note = row.note
  } else if (type === 'email') {
    params.email = row.email
  } else if (type === 'weChat') {
    params.weChat = row.weChat
  } else if (type === 'dingTalk') {
    params.dingTalk = row.dingTalk
  } 

  messageReceiveConfigStatusUpdate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('更新成功')
    }
  })
}
const tableRef = ref()
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
  query()
}
// 重置弹框
const resetDialog = () => {
  tableRef.value.IdealTableList.clearSelection() // 清空多选
  showDialog.value = false
  dialogType.value = '' // 防止再点击弹框时 有值
}
</script>

<style scoped lang="scss">
.finance {
  width: calc(100% - 40px);
  padding: 20px;
}
</style>
