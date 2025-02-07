<template>
  <div class="business-manage-manage">
    <ideal-search
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider border-style="solid" />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :pagination-type="PaginationTypeEnum.totalSizes"
      :total="state.total"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #operation>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateButtons"
              @clickMoreEvent="clickOperateEvent($event as any, props.row)"
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
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import { FiltrateEnum, PaginationTypeEnum } from '@/utils/enum'
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealButtonEventProp,
  IdealTextProp
} from '@/types'
import {
  dciDataList,
  dciDataSearchList,
  dciDataDelete
} from '@/api/java/operate-center'

const typeArray = ref<IdealSearch[]>([
  { label: 'A端端口', prop: 'aPortName', type: FiltrateEnum.input },
  { label: 'Z端端口', prop: 'zPortName', type: FiltrateEnum.input }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      state.queryForm[item.prop] = item.value
    })
    state.dataListUrl = dciDataSearchList
  } else {
    state.dataListUrl = dciDataList
  }
  getDataList()
}

const state: IHooksOptions = reactive({
  dataListUrl: dciDataList,
  dataList: [] as any[],
  deleteUrl: '',
  queryForm: {},
  primaryKey: 'id' // 多选结果主键
})

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

const leftButtons: IdealButtonEventProp[] = [
  {
    title: '数据录入',
    prop: 'dataEntry',
    type: 'primary',
    authority: 'supplier:manage:dciRecord'
  }
]

const clickLeftEvent = (command: string | number | object) => {
  if (command === 'dataEntry') {
    showDialog.value = true
    dialogType.value = 'DCIDataEntry'
  }
}

const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit', authority: 'supplier:manage:dciUpdate' },
  { title: '删除', prop: 'delete', authority: 'supplier:manage:dciDelete' }
  // {
  //   title: 'Service Token',
  //   prop: 'serviceToken',
  //   authority: 'supplier:manage:serviceToken'
  // }
]

watch(
  () => state.dataList,
  (arr: any) => {
    if (arr.length) {
      arr.forEach((ele: any) => {
        ele.source =
          ele.dataResource === 'static' ? '静态录入' : ele.dataResource
        ele.bandwidth = `${ele.minBandwidth}-${ele.maxBandwidth}M`
        ele.deliveryPeriod = `${ele.deliveryDuration}天`
        ele.nrcStr = `${ele.nrc}$`
        ele.mrcStr = `${ele.mrc}$`
        ele.delayTimeText = `${ele.delayTime}ms`
      })
    }
  },
  { immediate: true }
)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'A端节点名称', prop: 'aNodeName', width: '100' },
  { label: 'A端设备名称', prop: 'aEquipmentName', width: '100' },
  { label: 'A端端口名称', prop: 'aPortName', width: '100' },
  { label: 'Z端节点名称', prop: 'zNodeName', width: '100' },
  { label: 'Z端设备名称', prop: 'zEquipmentName', width: '100' },
  { label: 'Z端端口名称', prop: 'zPortName', width: '100' },
  { label: '数据来源', prop: 'source' },
  { label: 'MTU', prop: 'mtu' },
  { label: '带宽', prop: 'bandwidth' },
  { label: '价格/NRC', prop: 'nrcStr' },
  { label: '价格/MRC', prop: 'mrcStr' },
  { label: '延时/ms', prop: 'delayTimeText' },
  { label: '交付工期', prop: 'deliveryPeriod' },
  { label: '录入时间', prop: 'createTime.date', width: '150' }
]

const rowData: any = ref({})
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'delete') {
    handleDelete(row)
  } else if (command === 'edit') {
    rowData.value = row
    showDialog.value = true
    dialogType.value = 'DCIDataEdit'
  } else if (command === 'serviceToken') {
    rowData.value = row
    showDialog.value = true
    dialogType.value = 'serviceToken'
  }
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除当前DCI端口信息吗？', '删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      dciDataDelete({ id: row.id }).then((res: any) => {
        const { code } = res
        if (code === 200) {
          getDataList()
          ElMessage.success('删除DCI端口信息成功')
        } else {
          ElMessage.error('删除DCI端口信息失败')
        }
      })
    })
    .catch(() => {
      ElMessage.info('取消删除DCI端口信息')
    })
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>

<style scoped lang="scss">
.business-manage-manage {
  background-color: white;
  padding: $idealPadding;

  .ideal-theme-text {
    cursor: pointer;
  }
}
</style>
