<template>
  <div class="associate-subnet">
    <div class="flex-row associate-subnet__button">
      <el-button type="primary" @click="associateSubnet">
        <svg-icon
          icon="circle-add"
          color="white"
          class="ideal-svg-margin-right"
        ></svg-icon>
        关联子网
      </el-button>
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #name>
        <el-table-column label="名称/ID" width="280">
          <template #default="props">
            <div
              class="subnet-table-title"
              @click="clickRedirectDetail(props.row)"
            >
              {{ props.row.name }}
            </div>

            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <template #ipv6Gateway>
        <el-table-column label="ipv6网段">
          <template #default="props">
            <div class="flex-row">
              <div>{{ props.row.ipv6Gateway || '--' }}</div>
            </div>
          </template>
        </el-table-column>
      </template>

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
      :row-data="rowData"
      :custom-route="customRoute"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import { OperateEventEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { queryRouteTableDetail } from '@/api/java/network'

const state: IHooksOptions = reactive({})
onMounted(() => {
  queryDetailInfo()
})

const route = useRoute()
const id = route.query.id

const customRoute: any = ref([])
const detailInfo: any = ref({})
const queryDetailInfo = () => {
  queryRouteTableDetail({ id }).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      detailInfo.value = data
      data.subnetList.forEach((item: any) => {
        item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
        item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
      })
      state.dataList = data.subnetList
      customRoute.value = data.routeList
    } else {
      state.dataList = []
    }
  })
}

// 行数据操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '更换路由表', prop: 'replace' }
]
// 当前行数据
const rowData = ref(null)
// 行数据操作
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'replace') {
    rowData.value = row
    showDialog.value = true
    dialogType.value = OperateEventEnum.replace
  }
}

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '可用区', prop: 'availableZone' },
  { label: 'ipv4网段', prop: 'cidr' },
  { label: 'ipv6网段', prop: 'ipv6Gateway', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true }
]

// 关联子网
const associateSubnet = () => {
  rowData.value = detailInfo.value
  showDialog.value = true
  dialogType.value = OperateEventEnum.associate
}
// 子网详情
const clickRedirectDetail = (row: any) => {}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  queryDetailInfo()
}
</script>

<style scoped lang="scss">
.associate-subnet {
  width: 100%;
  padding: 20px;
  background-color: white;
  box-sizing: border-box;
  .associate-subnet-table-title {
    color: var(--el-color-primary);
    cursor: pointer;
  }
  :deep(.el-select .el-input) {
    width: 200px;
  }
  .associate-subnet__button {
    justify-content: space-between;
    align-items: center;
  }
}
</style>
