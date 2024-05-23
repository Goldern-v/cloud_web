<template>
  <div class="finished">
    <div class="payment__tip-enter">
      <span
        >当前用户或所属VDC的预算/余额不足时，付费资源的订单为待支付状态，请在订单有效期内(默认三天)，调整预算/余额配置并完成支付</span
      >
    </div>
    <div class="flex-row finished__search">
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
      <el-button type="primary" @click="batchPayment">合并支付</el-button>
    </div>

    <el-divider />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.orderStatusCN"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="220">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              :max-buttons="3"
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
import {
  getOrderList,
  queryCancelOrder,
  getMergePayments
} from '@/api/java/business-center'
import { expenseTypeList } from '@/api/java/operate-center' //费用类型
import { ElMessage, ElMessageBox } from 'element-plus/es'

// 付费类型
const payType = ref('1')
// 搜索插槽
const slotArray = ['resourceType']
// 费用类型
const resourceType = ref('')
const costTypeList: Ref<any[]> = ref([])
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: getOrderList,
  queryForm: {
    orderStatus: 'ORDER_STATUS_PAYING'
  }
})

const {
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  selectionChangeHandle
} = useCrud(state)
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
onMounted(() => {
  getExpenseType()
})
// 订单类型
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
// 搜索
const clickSearch = (search: string, type: string) => {
  if (search) {
    state.queryForm.search = search
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
  state.queryForm = {
    orderStatus: 'ORDER_STATUS_PAYING'
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
  { label: '订单状态', prop: 'status', useSlot: true },
  { label: '订单金额（¥）', prop: 'billOriginalPriceText' },
  { label: '应付金额（¥）', prop: 'billFinalPriceText' },
  { label: '订单创建时间', prop: 'createTime' }
]
// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '支付', prop: 'payment' },
  { title: '取消', prop: 'cancel' },
  { title: '查看详情', prop: 'detail' }
]
const router = useRouter()
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'detail') {
    router.push({
      path: '/business-center/order-manage/commission/pay/detail',
      query: { orderId: row.id }
    })
  }
  if (command === 'payment') {
    combination(row.id, command)
  }
  if (command === 'cancel') {
    combination(row.id, command)
  }
}
// 支付/取消
const combination = (orderId: number | string, command: string) => {
  const apiURL = command === 'payment' ? getMergePayments : queryCancelOrder
  ElMessageBox.confirm(
    `确定要${command === 'payment' ? '支付' : '取消'}所选订单吗？`,
    `${command === 'payment' ? '支付' : '取消'}订单`,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      let params: any = {}
      if (command === 'payment') {
        params.orderIds = [orderId]
      } else {
        params.orderId = orderId
      }
      apiURL(params).then((res: any) => {
        if (res.code === 200) {
          ElMessage.success(
            `${command === 'payment' ? '支付' : '取消'}请求成功`
          )
          getDataList()
        }
      })
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}
// 合并支付
const batchPayment = () => {
  const dataList = state.dataListSelections ? state.dataListSelections : []
  if (dataList.length === 0) {
    ElMessage.warning('请选择待支付订单')
    return
  }
  ElMessageBox.confirm('确定要支付所选订单吗？', '合并支付', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const orderIds = state.dataListSelections?.map((item: any) => {
        return item.id
      })
      getMergePayments({ orderIds })
        .then((res: any) => {
          ElMessage.success(`请求成功`)
          getDataList()
        })
        .catch(() => {
          ElMessage.info('已取消操作')
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消操作'
      })
    })
}
</script>

<style scoped lang="scss">
.finished {
  padding: 0 $idealPadding $idealPadding;
  .payment__tip-enter {
    width: 99%;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    background-color: #eaf0fd;
    border: 1px solid var(--el-color-primary);
    cursor: pointer;
  }
  :deep(.el-select .el-input) {
    width: 200px;
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
  .finished__search {
    margin-top: 10px;
    align-items: center;
    justify-content: space-between;
  }
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
}
</style>
