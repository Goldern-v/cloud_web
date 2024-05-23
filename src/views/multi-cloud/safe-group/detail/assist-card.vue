<template>
  <div class="elastic-card">
    <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />
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
      <template #privateIp>
        <el-table-column label="私有IP地址">
          <template #default="props">
            <div class="ideal-theme-text" @click="toAssistNic(props.row)">
              {{ props.row.fixedIp }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #mainFixedIp>
        <el-table-column label="所属弹性网卡">
          <template #default="props">
            <p class="ideal-theme-text">{{ props.row.mainFixedIp }}</p>
          </template>
        </el-table-column>
      </template>

      <template #network>
        <el-table-column label="所属网络">
          <template #default="props">
            <p class="ideal-theme-text">{{ props.row.vpcName }}</p>
            <p class="ideal-theme-text">{{ props.row.subnet?.name }}</p>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="150">
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
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { queryRelevanceAssistNicList } from '@/api/java/network'

/**
 * 搜索类型
 */
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'UUID', prop: 'uuid', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      state.queryForm[item.prop] = temp[1]
    })
  }
  getDataList()
}

const route = useRoute()
const uuid = route.query.uuid as string

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: queryRelevanceAssistNicList,
  deleteUrl: '',
  queryForm: { uuid },
  isPage: false
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '私有IP地址', prop: 'privateIp', useSlot: true },
  { label: '所属弹性网卡', prop: 'mainFixedIp', useSlot: true },
  { label: '所属网络', prop: 'network', useSlot: true },
  { label: '描述', prop: 'description' }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '添加',
    prop: 'addSubEni',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '移出', prop: 'delete', disabled: true, disabledText: '请先选择' }
])
type leftBtnType = string | number | object
const clickLeftEvent = (value: leftBtnType) => {
  if (value === 'addSubEni') {
    showDialog.value = true
    dialogType.value = 'addSubEni'
  }
}
const operateBtns = ref<IdealTableColumnOperate[]>([
  { title: '移出', prop: '移出' },
  { title: '更改安全组', prop: 'change' }
])
const clickOperateEvent = (command: string | number | object, row: object) => {}

const toAssistNic = (row: any) => {}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
// 更新tabs选项卡标题数量, total: 当前页面列表总数 index: 当前tabs选项卡
interface EventEmits {
  (e: 'updatePageNumber', total: number, index: number): void
}
const emit = defineEmits<EventEmits>()
watch(
  () => state.dataList,
  (newValue, oldValue) => {
    if (newValue !== oldValue && newValue?.length) {
      emit('updatePageNumber', newValue?.length, 2)
    }
  }
)
</script>

<style scoped lang="scss">
.elastic-card {
  padding: $idealPadding;
  background-color: white;
}
</style>
