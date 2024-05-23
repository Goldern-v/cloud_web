<template>
  <div class="ideal-large-margin history-detail">
    <div class="history-detail-info">
      <div class="flex-row ideal-header-container">
        <el-divider direction="vertical" />
        <div>订单详情</div>
      </div>

      <ideal-detail-info
        :label-array="labelArray"
        :item-number="3"
        :detail-info="detailInfo"
        class="ideal-large-margin-top"
      ></ideal-detail-info>
    </div>

    <div class="history-detail-handle-box ideal-large-margin-top">
      <div class="flex-row history-detail__title">
        <el-divider direction="vertical" />
        <div>审批流程</div>
      </div>

      <div class="flex-row history-detail-flow">
        <approve-process :order-info="detailInfo"></approve-process>
      </div>
    </div>

    <div class="history-detail-list ideal-large-margin-top">
      <div class="flex-row ideal-header-container">
        <el-divider direction="vertical" />
        <div>订单列表</div>
      </div>

      <ideal-table-list
        :loading="state.dataListLoading"
        :table-data="state.dataList"
        :table-headers="tableHeaders"
        :page="state.page"
        :show-pagination="false"
      >
      </ideal-table-list>

      <div class="flex-row ideal-large-margin-top" style="justify-content: flex-end">
        <div>
          订单总额:<span class="ideal-theme-text"
            >{{ detailInfo?.billFinalPrice }}元</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { queryOrderDetail, getOrderItemsList } from '@/api/java/business-center'
import approveProcess from '@/views/business-center/order-manage/components/approve-process.vue'

const labelArray = ref([
  { label: '订单编号', prop: 'id' },
  { label: '订单类型', prop: 'typeCN' },
  { label: '订单状态', prop: 'orderStatusCN' },
  { label: '订单时间', prop: 'createTime' },
  { label: '计费模式', prop: 'billingMode' },
  { label: '资源池', prop: 'resourcePoolName' },
  { label: '费用类型', prop: 'resourceType' },
  { label: '实例名称', prop: 'instanceResourceName' }
])
// 订单详情
const detailInfo: any = ref()
// orderId
const route = useRoute()
const orderId = route.query.orderId

// const detailInfo = ref({
//   number: '2324479385',
//   type: '订购',
//   status: '一级审批中',
//   createTime: '2023.4.10 11:55:11',
//   chargeMode: '包年包月',
//   resourcePool: '阿里云',
//   costType: '云主机',
//   name: 'ecm-b7ix2d'
// })

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: getOrderItemsList,
  deleteUrl: '',
  isPage: false,
  queryForm: {
    orderId
  }
})
const {} = useCrud(state)
state.dataList = [
  {
    costItem: '实例规格',
    costUnit: 'vCPU、内存',
    config: 's7.4xlarge.2；2核，4G',
    price: '20/月',
    time: '2月',
    total: '40'
  }
]
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '计费项', prop: 'billItem' },
  { label: '计费单元', prop: 'billKey' },
  { label: '配置', prop: 'billValue' },
  { label: '单价', prop: 'billPrice' },
  { label: '订购时长', prop: 'billUnitValue' },
  { label: '订购金额', prop: 'billAmount' }
]

/**
 * 方法
 */
onMounted(() => {
  queryDetailData()
})
// 订单详情获取
const queryDetailData = () => {
  const statusDic: { [key: string]: string } = {
    '0': '审批中',
    '1': '审批通过',
    '-1': '审批未通过',
    '9': '无需审批'
  }
  queryOrderDetail({ orderId })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        data.billingMode = data.billType ? '包年包月' : '按需计费'
        data.status = statusDic[data.approveStatus]
        detailInfo.value = data
      } else {
        detailInfo.value = {}
      }
    })
    .catch(_ => {})
}
</script>

<style scoped lang="scss">
.history-detail {
  box-sizing: border-box;
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 2px var(--el-color-primary) solid;
  }
  .history-detail-info,
  .history-detail-handle-box,
  .history-detail-list,
  .history-detail-button {
    background-color: white;
    padding: 20px;
    .history-detail-handle-item {
      width: 22%;
    }
    .history-detail-handle-arrow {
      width: 17%;
      padding: 0 10px;
    }
  }
  .history-detail-flow {
    align-items: center;
    margin-top: 20px;
    .history-detail__apply,
    .history-detail__handle-active,
    .history-detail__handle {
      border: 1px solid $sub5-light;
      border-radius: $circleRadiusSize;
      align-items: center;
      height: 90px;
      .history-detail__apply-icon {
        background-color: var(--el-color-primary-light-9);
        justify-content: center;
        align-items: center;
        width: 70px;
        height: 100%;
      }
      .history-detail__apply-text {
        padding: 0 10px;
      }
    }
    .history-detail__handle-active {
      border: 1px solid var(--el-color-primary);
    }
    .history-detail__handle,
    .history-detail__handle-active {
      padding-right: 10px;
      .handle-button {
        border: 1px solid var(--el-color-primary);
        width: 80px;
        margin-bottom: 5px;
        &:disabled {
          border: 1px solid $gray6-light;
        }
      }
      .recall-button {
        border: 1px solid $error6-light;
        width: 80px;
        margin-top: 5px;
        --el-button-hover-text-color: $error6-light;
        --el-button-hover-bg-color: rgba($color: $error6-light, $alpha: 0.3);
        &:disabled {
          border: 1px solid $gray6-light;
        }
      }
    }
  }
  .history-detail-info,
  .history-detail-list {
    background-color: white;
    padding: 20px;
  }
}
</style>
