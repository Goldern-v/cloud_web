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
      <template #operation>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :max-buttons="3"
              :buttons="operateButtons"
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
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type {
  IdealTableColumnHeaders,
  IdealButtonEventProp,
  IdealTableColumnOperate
} from '@/types'
import { OperateEventEnum } from '@/utils/enum'
import { ElMessage, ElMessageBox } from 'element-plus'

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
  { prop: 'isDefault', label: '是否默认' },
  { prop: 'uuid', label: 'UUID' },
  { prop: 'ipv4Cidr', label: 'IPv4 CIDR' },
  { prop: 'inboundBandwidth', label: '入流量带宽' },
  { prop: 'outgoingBandwidth', label: '出流量带宽' },
  { prop: 'createTime', label: '创建时间' }
])

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  query
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

const operateButtons: IdealTableColumnOperate[] = [
  { type: 'primary', title: '设置网卡Qos', prop: 'setNicQos' },
  { type: 'primary', title: '设为默认网络', prop: 'setDefaultNet' },
  {
    type: 'primary',
    title: '卸载',
    prop: 'unload',
    disabled: true,
    disabledText: '默认网络不能删除'
  }
]

const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'setNicQos') {
    showDialog.value = true
    dialogType.value = 'setNicQos'
  } else if (command === 'setDefaultNet') {
    setDefaultNet()
  } else if (command === 'unload') {
    showDialog.value = true
    dialogType.value = 'unload'
  }
}

const setDefaultNet = () => {
  ElMessageBox.confirm('确定要设为默认网络吗？', '设置默认网络', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {})
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
