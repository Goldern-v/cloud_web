<template>
  <div class="wait">
    <div class="flex-row wait__search">
      <ideal-select-search
        :search-type="SearchTypeEnum.title"
        prefix-title="订单号"
        :slot-array="slotArray"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
        <template #resourceType>
          <el-select
            v-model="resourceType"
            placeholder="请选择"
            clearable
            class="finished-order-type ideal-default-margin-right"
          >
            <template #prefix>费用类型:</template>
            <el-option
              v-for="item in costTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </template>
      </ideal-select-search>
    </div>

    <el-divider />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #orderStatus>
        <el-table-column label="订单状态" width="120">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.orderStatusCN"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.orderStatusCN"
            />
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="125">
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
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum } from '@/utils/enum'
import { ORDER_STATUS_ICON } from '@/utils/dictionary'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { expenseTypeList } from '@/api/java/operate-center'
import {
  getOrderList,
  queryCancelOrder,
  getAuditOrder
} from '@/api/java/business-center'
import { ElMessage, ElMessageBox } from 'element-plus/es'

// 付费类型
const payType = ref('PACKAGE')
// 搜索插槽
const slotArray = ['resourceType']
// 时间范围
const timeRange = ref('')

const payTypeChange = (val: string) => {
  state.queryForm.billType = val
  getDataList()
}

/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: getOrderList,
  queryForm: {
    orderStatus: 'ORDER_STATUS_APPROVE' //待审批订单状态值
  }
})
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusIcon = ORDER_STATUS_ICON[item.orderStatus]
        item.billFinalPriceText = item.billFinalPrice
          ? item.billFinalPrice.toFixed(2)
          : '0.00'
        item.billOriginalPriceText = item.billOriginalPrice
          ? item.billOriginalPrice.toFixed(2)
          : '0.00'
      })
    }
  }
)

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)
// 搜索
const clickSearch = (search: string, type: string) => {
  if (search) {
    state.queryForm.id = search
  }
  if (resourceType.value) {
    state.queryForm.resourceType = resourceType.value
  }
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  resourceType.value = ''
  timeRange.value = ''
  state.queryForm = {
    orderStatus: 'ORDER_STATUS_APPROVE'
  }
  getDataList()
}
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '订单号', prop: 'id' },
  { label: '账号/登录名称', prop: 'userName' },
  { label: '资源池', prop: 'resourcePoolName' },
  { label: '费用类型', prop: 'resourceTypeCN' },
  { label: '实例名称', prop: 'instanceResourceName' },
  { label: '订单类型', prop: 'typeCN' },
  { label: '订单状态', prop: 'orderStatus', useSlot: true },
  { label: '订单金额（¥）', prop: 'billOriginalPriceText' },
  { label: '应付金额（¥）', prop: 'billFinalPriceText' },
  { label: '订单创建时间', prop: 'createTime' }
]
// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '取消', prop: 'cancel' },
  { title: '查看详情', prop: 'detail' }
]
const router = useRouter()
const clickOperateEvent = (command: string | number | object, row: any) => {
  // const params: any = {
  //   key: 'orderId',
  //   value: row.id,
  //   approveStatus: 0
  // }
  // getAuditOrder(params).then((res: any) => {
  //   if (res.code === 200) {
  //     if (res.data) {
  //     } else {
  //       ElMessage.error('所选订单无法跳转')
  //     }
  //   }
  // })
  // router.push({
  // path: '/bpm-manage/task/my-process/detail',
  // query: {
  //   id: res.data.processInstanceId,
  //   processDefinitionId: res.data.processDefinitionId
  // }
  // })
  if (command === 'detail') {
    router.push({
      path: '/business-center/order-manage/commission/approve/detail',
      query: { orderId: row.id }
    })
  } else if (command === 'cancel') {
    cancelBat(row.id)
  }
}

onMounted(() => {
  getExpenseType()
})
// 费用类型
const resourceType = ref('')
const costTypeList: Ref<any[]> = ref([])
const getExpenseType = () => {
  expenseTypeList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        costTypeList.value = data
      } else {
        costTypeList.value = []
      }
    })
    .catch(_ => {
      costTypeList.value = []
    })
}
// 取消事件
const cancelBat = (orderId: number | string) => {
  ElMessageBox.confirm('确认要取消所选订单吗？', '取消订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      queryCancelOrder({ orderId }).then((res: any) => {
        if (res.code === 200) {
          ElMessage.success('取消订单请求成功')
          getDataList()
        }
      })
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}
</script>

<style scoped lang="scss">
.wait {
  padding: 0 $idealPadding $idealPadding;
  :deep(.el-select .el-input) {
    width: 200px;
    height: 34px;
  }
  :deep(.el-date-editor.el-input__wrapper) {
    width: 200px;
    height: 34px;
  }
  :deep(.el-range-editor.el-input__wrapper) {
    margin-right: 10px;
  }
  :deep(.el-radio-button__inner) {
    padding: 9px 15px;
  }
  .finished-order-type {
    width: 210px;
  }
  .wait__search {
    align-items: center;
    justify-content: flex-start;
  }
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
}
</style>
