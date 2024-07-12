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
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
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
  businessCloudDataList,
  businessCloudSearchList,
  cloudDataDelete
} from '@/api/java/operate-center'

const typeArray = ref<IdealSearch[]>([
  { label: '端口名称', prop: 'portName', type: FiltrateEnum.input }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      state.queryForm[item.prop] = item.value
      state.dataListUrl = businessCloudSearchList
    })
  } else {
    state.dataListUrl = businessCloudDataList
  }
  getDataList()
}

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '端口名称', prop: 'port.name' },
  { label: '数据来源', prop: 'source' },
  { label: '带宽', prop: 'bandwidth' },
  { label: '价格/NRC', prop: 'nrcStr' },
  { label: '价格/MRC', prop: 'mrcStr' },
  { label: '交付工期', prop: 'deliveryPeriod' },
  { label: '录入时间', prop: 'createTime.date' }
]

const state: IHooksOptions = reactive({
  dataListUrl: businessCloudDataList,
  dataList: [] as any[],
  deleteUrl: '',
  queryForm: {},
  primaryKey: 'id' // 多选结果主键
})

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

watch(
  () => state.dataList,
  val => {
    if (val?.length) {
      val.forEach((item: any) => {
        item.source = item.dataResource === 'static' ? '静态录入' : 'API对接'
        item.bandwidth = `${item.minBandwidth}-${item.maxBandwidth}M`
        item.deliveryPeriod = `${item.deliveryDuration}天`
        item.nrcStr = `${item.nrc}$`
        item.mrcStr = `${item.mrc}$`
      })
    }
  }
)

const leftButtons: IdealButtonEventProp[] = [
  {
    title: '数据录入',
    prop: 'dataEntry',
    type: 'primary',
    authority: 'supplier:manage:cloudPortRecord'
  }
]

const clickLeftEvent = (command: string | number | object) => {
  if (command === 'dataEntry') {
    showDialog.value = true
    dialogType.value = 'portDataEntry'
  }
}

const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit', authority: 'supplier:manage:cloudPortUpdate' },
  {
    title: '删除',
    prop: 'delete',
    authority: 'supplier:manage:cloudPortDelete'
  }
]
const newOperate = (ele: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateButtons))
  resultArr = tempArr
  return resultArr
}
watch(
  () => state.dataList,
  (arr: any) => {
    if (arr.length) {
      arr.forEach((ele: any) => {
        ele.operate = newOperate(ele)
      })
    }
  },
  { immediate: true }
)
const rowData: any = ref({})
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'delete') {
    handleDelete(row)
  } else if (command === 'edit') {
    rowData.value = row
    showDialog.value = true
    dialogType.value = 'portDataEdit'
  }
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除当前云端口信息吗？', '删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      cloudDataDelete({ id: row.id }).then((res: any) => {
        let { code } = res
        if (code === 200) {
          getDataList()
          ElMessage.success('删除云端口信息成功')
        } else {
          ElMessage.error('删除云端口信息失败')
        }
      })
    })
    .catch(() => {
      ElMessage.info('取消云端口信息')
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
