<template>
  <div class="ideal-main-container history">
    <div class="flex-row history__search">
      <div class="flex-row">
        <el-radio-group v-model="payType" class="ideal-default-margin-right">
          <el-radio-button label="1">预付费</el-radio-button>
          <el-radio-button label="2">后付费</el-radio-button>
        </el-radio-group>
        <ideal-select-search
          :search-type="SearchTypeEnum.title"
          prefix-title="订单号"
          :slot-array="slotArray"
          @clickSearch="clickSearch"
          @clickReset="clickReset"
        >
          <template #resourceTyp>
            <el-select
              v-model="resourceTyp"
              placeholder="请选择"
              class="finished-order-type"
            >
              <template #prefix>产品类型:</template>
              <el-option
                v-for="item in resourceTypList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>

          <template #timeRange>
            <el-date-picker
              v-model="timeRange"
              type="daterange"
              format="YYYY/MM/DD"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </template>
        </ideal-select-search>
      </div>
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
        <el-table-column label="操作" width="125">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
              :max-buttons="2"
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
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import {
  getOrderList,
  queryCancelOrder,
  queryPaymentOrder
} from '@/api/java/business-center'
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { ORDER_STATUS_ICON } from '@/utils/dictionary'

// 付费类型
const payType = ref('1')
// 搜索插槽
const slotArray = ['resourcePool', 'orderType', 'timeRange']
// 时间范围
const timeRange = ref('')

// 费用类型
const resourceTyp = ref('')
const resourceTypList: Ref<any[]> = ref([])
// 搜索
const clickSearch = (search: string, type: string) => {
  if (search) {
    state.queryForm.id = search
  }
  if (payType.value) {
    state.queryForm.paymentType = payType.value
  }
  if (timeRange.value) {
    ;(state.queryForm.startTime = timeRange.value[0]),
      (state.queryForm.endTime = timeRange.value[1])
  }
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {
    paymentType: payType.value,
    startTime: timeRange.value[0],
    endTime: timeRange.value[1]
  }
  getDataList()
}
//  初始化
const state: IHooksOptions = reactive({
  dataListUrl: getOrderList,
  // 搜索条件
  queryForm: {
    paymentType: payType.value,
    startTime: timeRange.value[0],
    endTime: timeRange.value[1]
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
        item.finishTime = item.finishTime ? item.finishTime : '--'
        item.billFinalPriceText = item.billFinalPrice
          ? item.billFinalPrice.toFixed(2)
          : '0.00'
        item.billOriginalPriceText = item.billOriginalPrice
          ? item.billOriginalPrice.toFixed(2)
          : '0.00'
        item.operate = newOperate(item)
      })
    }
  }
)
// 根据每行数据状态判断操作是否禁用
const newOperate = (item: any): IdealTableColumnOperate[] => {
  const resultArr: IdealTableColumnOperate[] = JSON.parse(
    JSON.stringify(operateBtns)
  )
  if (item.orderStatus !== 'ORDER_STATUS_PAYING') {
    resultArr[0].disabled = true
    resultArr[0].disabledText = `当前所选订单${item.orderStatusCN}不可操作`
  }
  if (item.orderStatus === 'ORDER_STATUS_FINISH') {
    resultArr[1].disabled = true
    resultArr[1].disabledText = `当前所选订单${item.orderStatusCN}不可操作`
  }
  return resultArr
}
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '订单号', prop: 'id' },
  { label: '账号/登录名称', prop: 'userName' },
  { label: '资源池', prop: 'resourcePoolName' },
  { label: '费用类型', prop: 'resourceTypeCN' },
  { label: '实例名称', prop: 'instanceResourceName' },
  { label: '订单类型', prop: 'typeCN' },
  { label: '订单创建时间', prop: 'createTime' },
  { label: '订单状态', prop: 'status', useSlot: true },
  { label: '订单金额（¥）', prop: 'billOriginalPriceText' },
  { label: '应付金额（¥）', prop: 'billFinalPriceText' },
  { label: '订单完成时间', prop: 'finishTime' }
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
      path: '/business-center/order-manage/myOrder/detail',
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
  const apiURL = command === 'payment' ? queryPaymentOrder : queryCancelOrder
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
      apiURL({ orderId }).then((res: any) => {
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
  ElMessageBox.confirm('确定要支付所选订单吗？', '取消订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed'
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
.history {
  padding: $idealPadding;
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
  .history__search {
    align-items: center;
    justify-content: space-between;
  }
  // 修改列表高度
  :deep(.el-table) {
    height: calc(
      100vh - var(--navigation-bar-height) - var(--theme-header-height) - 40px -
        60px - 40px - 52px - 20px - 20px - 15px - 32px
    );
  }
}
</style>
