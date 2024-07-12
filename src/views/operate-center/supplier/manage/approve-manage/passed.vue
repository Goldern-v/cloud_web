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
          <template #default="props">
            <div class="ideal-theme-text" @click="toDetail(props.row)">
              {{ props.row.vendorName }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="90" fixed="right">
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
  </div>
</template>

<script setup lang="ts">
import { FiltrateEnum, PaginationTypeEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import {
  supplierInfoList,
  supplierInfoQueryList,
  supplierOffShelves
} from '@/api/java/operate-center'
import store from '@/store'

const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'vendorName', type: FiltrateEnum.input }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  state.queryForm.approvalStatus = 'pass'
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      state.queryForm[item.prop] = temp[1]
    })
    state.dataListUrl = supplierInfoQueryList
  } else {
    state.dataListUrl = supplierInfoList
  }
  getDataList()
}

const state: IHooksOptions = reactive({
  dataListUrl: supplierInfoList,
  dataList: [] as any[],
  deleteUrl: '',
  queryForm: {
    approvalStatus: 'pass'
  },
  primaryKey: 'id' // 多选结果主键
})

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)
const operateButtons: IdealTableColumnOperate[] = [
  { title: '下架', prop: 'delist', authority: 'supplier:manage:offShelf' }
]

watch(
  () => state.dataList,
  (arr: any) => {
    if (arr.length) {
      arr.forEach((ele: any) => {
        ele.area = ele.supplierNodeDetail?.node?.areaName
        ele.country = ele.supplierNodeDetail?.node?.countryName
        ele.city = ele.supplierNodeDetail?.node?.cityName
        ele.approvalTime = dayjs(ele.approvalTime).format('YYYY-MM-DD HH:mm:ss')
      })
    }
  },
  { immediate: true }
)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '区域', prop: 'area' },
  { label: '国家', prop: 'country' },
  { label: '城市', prop: 'city' },
  { label: '申请账号', prop: 'creator.username' },
  { label: '申请时间', prop: 'createTime.date' },
  { label: '审批人', prop: 'approvalUserName' },
  { label: '审批时间', prop: 'approvalTime' }
]
const router = useRouter()

onBeforeRouteLeave((to, from, next) => {
  store.commonStore.setSideBar(from.fullPath)
  next()
})

const toDetail = (row: any) => {
  router.push({
    path: '/operate-center/supplier/manage/information-manage-detail',
    query: { id: row.id }
  })
}

const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'delist') {
    ElMessageBox.confirm('确定要将当前已通过的供应商进行下架吗？', '下架', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const { id, nodeId, equipmentId, portId } = row
        const params = {
          id,
          nodeId,
          equipmentId,
          portId
        }
        supplierOffShelves(params).then((res: any) => {
          let { code } = res
          if (code === 200) {
            getDataList()
            ElMessage.success('下架供应商成功')
          } else {
            ElMessage.error('下架供应商失败')
          }
        })
      })
      .catch(() => {
        ElMessage.info('取消下架供应商')
      })
  }
}
</script>

<style scoped lang="scss">
.supplier-information-manage {
  background-color: white;
  padding: $idealPadding;
}
</style>
