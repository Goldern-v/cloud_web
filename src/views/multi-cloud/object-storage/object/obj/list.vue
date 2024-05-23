<template>
  <div class="obj-list">
    <div class="ideal-middle-margin-bottom">若需要将对象移动到桶内其他位置，推荐下载使用<span class="ideal-theme-text">OBS Browser+</span>图形化管理工具。基于安全合规要求，从浏览器直接访问文件时不能进行在线预览；若需要在线预览，请参考<span class="ideal-theme-text">如何在浏览器中在线预览OBS的对象。</span></div>

    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
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

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'

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
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'id' }
]

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
  { label: '名称', prop: 'name', useSlot: true },
  { label: '存储类别', prop: 'storageClass' },
  { label: '大小', prop: 'size' },
  { label: '最后修改时间', prop: 'modifyTime' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '分享', prop: 'share' },
  { title: '复制路径', prop: 'copy' },
  { title: '删除', prop: 'delete' },
  { title: '配置对象策略', prop: 'config' },
  { title: '复制对象URL', prop: 'copyUrl' }
]
const rowData = ref()

const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'share') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.share
  } else if (command === 'delete') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  } else if (command === 'config') {
    emit('clickConfig') // 跳转访问控制权限
  }
}
// 方法
interface EventEmits {
  (e: 'clickConfig'): void
}
const emit = defineEmits<EventEmits>()
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '上传对象',
    prop: 'upload',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '新建文件夹', prop: 'create' },
  { title: '删除', prop: 'delete', disabled: true, disabledText: '请选择需要删除的对象' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'upload') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.upload
  } else if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  }
}
watch(() => state.dataListSelections, value => {
  leftButtons.value[2].disabled = true
  if (value?.length) {
    leftButtons.value[2].disabled = false
  }
})
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = ''
}
</script>

<style scoped lang="scss">
.obj-list {
  padding: 10px $idealPadding $idealPadding;
  background-color: white;
}
</style>
