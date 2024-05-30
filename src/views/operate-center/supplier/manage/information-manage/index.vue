<template>
  <div class="ideal-main-container supplier-information-manage">
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
      <template #name>
        <el-table-column label="供应商名称" width="200">
          <template #default="props"
            ><div class="ideal-theme-text" @click="toDetail(props.row)">
              {{ props.row.vendorName }}
            </div></template
          >
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="申请信息状态" width="200">
          <template #default="props">
            <el-tag :type="props.row.type">{{ props.row.status }}</el-tag>
          </template>
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
  </div>
</template>

<script setup lang="ts">
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
import store from '@/store'
import { dayjs } from 'element-plus'
import {
  supplierInfoList,
  supplierDelete,
  approveAgain
} from '@/api/java/operate-center'
import { hideLoading, showLoading } from '@/utils/tool'
import { statusFormat, statusType } from './common'
import { isSupplierManager } from '@/utils/role'

const typeArray = ref<IdealSearch[]>([])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

const state: IHooksOptions = reactive({
  dataListUrl: supplierInfoList,
  dataList: [] as any[],
  deleteUrl: '',
  queryForm: {},
  primaryKey: 'id' // 多选结果主键
})

const tableHeaders = ref<IdealTableColumnHeaders[]>()

const statusList: any = [
  { label: '待审批', value: 'wait' },
  { label: '已通过', value: 'pass' },
  { label: '已驳回', value: 'reject' },
  { label: '已下架', value: 'offShelves' }
]
onMounted(() => {
  if (!isSupplierManager.value) {
    tableHeaders.value = headerArray
    typeArray.value = [
      {
        label: '供应商名称',
        prop: 'vendorName',
        type: FiltrateEnum.input
      }
    ]
  } else {
    tableHeaders.value = headerArray.filter(
      (item: any) => item.prop !== 'name' && item.prop !== 'account'
    )
    typeArray.value = [
      {
        label: '审批状态',
        prop: 'approvalStatus',
        type: FiltrateEnum.list,
        array: statusList,
        arrayProp: 'label',
        arrayKey: 'value'
      }
    ]
  }
})
const headerArray: IdealTableColumnHeaders[] = [
  { label: '供应商名称', prop: 'name', useSlot: true },
  { label: '申请信息状态', prop: 'status', useSlot: true },
  { label: '节点名称', prop: 'node', width: '200' },
  { label: '区域', prop: 'area', width: '200' },
  { label: '国家', prop: 'country', width: '200' },
  { label: '城市', prop: 'city', width: '200' },
  { label: '申请账号', prop: 'creator.username', width: '200' },
  { label: '申请时间', prop: 'createTime.date', width: '200' },
  { label: '审批人', prop: 'approvalUserName', width: '200' },
  { label: '审批理由', prop: 'approvalDesc', width: '200' },
  { label: '审批时间', prop: 'approvalTime', width: '200' }
]

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

const leftButtons: IdealButtonEventProp[] = [
  {
    title: '信息录入',
    prop: 'infoEntry',
    type: 'primary'
  }
]

const router = useRouter()
const clickLeftEvent = (command: string | number | object) => {
  if (command === 'infoEntry') {
    router.push({
      path: '/operate-center/supplier/manage/information-entry',
      query: { type: 'entry' }
    })
  }
}

const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' },
  { title: '再次审批', prop: 'againApprove' }
]
const newOperate = (ele: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateButtons))
  if (ele.approvalStatus.toUpperCase() === 'PASS') {
    resultArr = setOperateBtns(true, tempArr)
  } else {
    resultArr = tempArr
  }
  return resultArr
}
// 根据状态设置操作禁用状态
const setOperateBtns = (
  disabled: boolean,
  array: IdealTableColumnOperate[]
) => {
  const arr: IdealTableColumnOperate[] = []
  array.forEach((item: any) => {
    item.disabled = disabled
    item.disabledText = `已通过审批的不支持${item.title}操作`
    arr.push(item)
  })
  return arr
}
watch(
  () => state.dataList,
  (arr: any) => {
    if (arr.length) {
      arr.forEach((ele: any) => {
        ele.operate = newOperate(ele)
        ele.approvalTime = dayjs(ele.approvalTime).format('YYYY-MM-DD HH:mm:ss')
        ele.status = statusFormat[ele.approvalStatus.toUpperCase()]
        ele.type = statusType[ele.approvalStatus.toUpperCase()]
        ele.node = ele.supplierNodeDetail?.node?.name
        ele.area = ele.supplierNodeDetail?.node?.areaName
        ele.country = ele.supplierNodeDetail?.node?.countryName
        ele.city = ele.supplierNodeDetail?.node?.cityName
      })
    }
  },
  { immediate: true }
)
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
  if (command === 'delete') {
    handleDelete(row)
  } else if (command === 'againApprove') {
    handleApproveAgain(row)
  } else if (command === 'edit') {
    router.push({
      path: '/operate-center/supplier/manage/information-entry',
      query: {
        type: 'edit',
        id: row.id,
        vendorId: row.vendorId, //供应商id
        nodeId: row.supplierNodeDetail.node.id, //节点id
        equipmentId: row.supplierNodeDetail.equipments[0].id //节点id
      }
    })
  }
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除当前申请信息吗？', '删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      showLoading('删除中...')
      supplierDelete({ id: row.id }).then((res: any) => {
        let { code } = res
        if (code === 200) {
          getDataList()
          ElMessage.success('删除申请信息成功')
        } else {
          ElMessage.success('删除申请信息失败')
        }
        hideLoading()
      })
    })
    .catch(() => {
      ElMessage.info('取消申请信息')
      hideLoading()
    })
}

const handleApproveAgain = (row: any) => {
  ElMessageBox.confirm('确定要再次审批当前申请信息吗？', '再次审批', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      showLoading('发起再次审批中...')
      approveAgain({ id: row.id }).then((res: any) => {
        let { code } = res
        if (code === 200) {
          getDataList()
          ElMessage.success('发起再次审批成功')
        } else {
          ElMessage.success('发起再次审批失败')
        }
        hideLoading()
      })
    })
    .catch(() => {
      ElMessage.info('取消再次审批')
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.supplier-information-manage {
  background-color: white;
  padding: $idealPadding;
  .ideal-theme-text {
    cursor: pointer;
  }
}
</style>
