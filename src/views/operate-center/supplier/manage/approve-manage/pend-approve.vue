<template>
  <div class="supplier-information-manage">
    <ideal-search
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider border-style="solid" />

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
      <template #name>
        <el-table-column label="供应商名称" width="200">
          <template #default="props"
            ><div class="ideal-theme-text" @click="toDetail(props.row)">
              {{ props.row.vendorName }}
            </div></template
          >
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185" fixed="right">
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
import {
  FiltrateEnum,
  PaginationTypeEnum,
  OperateEventEnum
} from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealTextProp
} from '@/types'
import dialogBox from './dialog-box.vue'
import { supplierList } from '@/api/java/operate-center'

const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input }
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

const state: IHooksOptions = reactive({
  dataListUrl: supplierList,
  dataList: [] as any[],
  deleteUrl: '',
  queryForm: {
    approvalStatus: 'wait'
  },
  primaryKey: 'id' // 多选结果主键
})

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

const operateButtons: IdealTableColumnOperate[] = [
  { title: '通过', prop: 'pass' },
  { title: '驳回', prop: 'reject' }
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
        ele.node = ele.supplierNodeDetail?.node?.name
        ele.area = ele.supplierNodeDetail?.node?.areaName
        ele.country = ele.supplierNodeDetail?.node?.countryName
        ele.city = ele.supplierNodeDetail?.node?.cityName
      })
    }
  },
  { immediate: true }
)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '供应商名称', prop: 'name', useSlot: true },
  { label: '区域', prop: 'area' },
  { label: '国家', prop: 'country' },
  { label: '城市', prop: 'city' },
  { label: '节点', prop: 'node' },
  { label: '申请账号', prop: 'creator.username' },
  { label: '申请时间', prop: 'createTime.date' }
]

const rowData = ref({})
const clickOperateEvent = (command: string | number, row: any) => {
  showDialog.value = true
  dialogType.value = command
}

const router = useRouter()
const toDetail = (row: any) => {
  router.push({
    path: '/operate-center/supplier/manage/approve-manage-detail'
  })
}

// 弹框
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
.supplier-information-manage {
  background-color: white;
  padding: $idealPadding;
}
</style>
