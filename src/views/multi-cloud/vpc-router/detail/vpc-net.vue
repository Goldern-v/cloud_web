<template>
  <div class="vpc-net">
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
      @handleSelectionChange="selectionChangeHandle"
    >
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
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type { IdealTableColumnHeaders, IdealButtonEventProp } from '@/types'
import { OperateEventEnum } from '@/utils/enum'
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})

state.dataList = [
  {
    name: 'vpc-1',
    uuid: '1',
    ipv4Cidr: '192.168.0.0/16',
    inboundBandwidth: '1000',
    outgoingBandwidth: '1000',
    createTime: '2021-01-01'
  }
]

const tableHeaders = ref<IdealTableColumnHeaders[]>([
  { prop: 'name', label: '名称' },
  { prop: 'uuid', label: 'UUID' },
  { prop: 'ipv4Cidr', label: 'IPv4 CIDR' },
  { prop: 'inboundBandwidth', label: '入流量带宽' },
  { prop: 'outgoingBandwidth', label: '出流量带宽' },
  { prop: 'createTime', label: '创建时间' }
])

const {
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  selectionChangeHandle
} = useCrud(state)
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '加载',
    prop: 'load',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
])

const clickLeftEvent = (command: string | number | object) => {
  if (command === 'load') {
    showDialog.value = true
    dialogType.value = 'loadLayer3Network'
  }
}

/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
</script>

<style scoped lang="scss">
.vpc-net {
  padding: $idealPadding;
  background-color: white;
}
</style>
