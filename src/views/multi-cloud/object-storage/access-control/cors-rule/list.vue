<template>
  <div class="cors-rule">
    <div class="cors-rule-title">CORS规则</div>
    <div class="ideal-tip-text ideal-middle-margin-bottom">您可以通过设置CORS，允许跨域请求访问OBS中的资源。</div>

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      ref="multipleTableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #operation>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
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
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'

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
  { source: '111', method: 'Get', allowHeader: '--', supplementHeader: '--', cacheTime: '100' }
]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '允许的来源', prop: 'source' },
  { label: '允许的方法', prop: 'method' },
  { label: '允许的头域', prop: 'allowHeader' },
  { label: '补充头域', prop: 'supplementHeader' },
  { label: '缓存时间(秒)', prop: 'cacheTime' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'change') {
    // showDialog.value = true
    // dialogType.value = OperateEventEnum.change
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { 
    title: '创建',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '复制', prop: 'copy' }
])
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  }
}
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
.cors-rule {
  background-color: white;
  padding: $idealPadding;
  .cors-rule-title {
    font-size: $largeFontSize;
    font-weight: 500;
  }
}
</style>
