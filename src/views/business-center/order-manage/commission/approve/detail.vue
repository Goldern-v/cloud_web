<template>
  <div class="ideal-large-margin wait-detail">
    <div class="wait-detail-info">
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

    <div class="wait-detail-handle-box ideal-large-margin-top">
      <div class="flex-row wait-detail__title">
        <el-divider direction="vertical" />
        <div>审批流程</div>
      </div>

      <div class="flex-row wait-detail-flow">
        <approve-process :order-info="detailInfo"></approve-process>
      </div>
    </div>

    <div class="wait-detail-list ideal-large-margin-top">
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
            >¥{{ detailInfo?.billFinalPrice }}元</span
          >
        </div>
      </div>
    </div>

    <div class="wait-detail-button" style="margin-top: 5px">
      <el-button type="primary" @click="clickSave">{{ t('save') }}</el-button>
      <el-button type="info" @click="clickBack">{{ t('back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import approveProcess from '@/views/business-center/order-manage/components/approve-process.vue'
import { queryOrderDetail, getOrderItemsList } from '@/api/java/business-center'

const { t } = useI18n()

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
const detailInfo: any = ref()
// 订单是否待审批: false未审批 true已审批
const isApprove = ref(false)
// 处理
const clickHandle = () => {
  isApprove.value = true
}
// 驳回
const clickRecall = () => {
  isApprove.value = true
}
// 修改
const clickChange = () => {}
// 取消
const clickCancel = () => {
  isApprove.value = false
}
const router = useRouter()
// 保存
const clickSave = () => {}
// 返回
const clickBack = () => {
  router.back()
}

const route = useRoute()
const orderId = route.query.orderId
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
.wait-detail {
  box-sizing: border-box;
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 2px var(--el-color-primary) solid;
  }
  .flex-row-center {
    justify-content: center;
    align-items: center;
  }
  .wait-detail-info,
  .wait-detail-handle-box,
  .wait-detail-list,
  .wait-detail-button {
    background-color: white;
    padding: 20px;
    .wait-detail-handle-item {
      width: 22%;
    }
    .wait-detail-handle-arrow {
      width: 17%;
      padding: 0 10px;
    }
  }
  .wait-detail-flow {
    align-items: center;
    margin-top: 20px;
    .wait-detail__apply,
    .wait-detail__handle-active,
    .wait-detail__handle {
      border: 1px solid $sub5-light;
      border-radius: $circleRadiusSize;
      align-items: center;
      height: 90px;
      .wait-detail__apply-icon {
        background-color: var(--el-color-primary-light-9);
        justify-content: center;
        align-items: center;
        width: 70px;
        height: 100%;
      }
      .wait-detail__apply-text {
        padding: 0 10px;
      }
    }
    .wait-detail__handle-active {
      border: 1px solid var(--el-color-primary);
    }
    .wait-detail__handle,
    .wait-detail__handle-active {
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
  .custom-vertical-divider {
    height: 30px;
    width: 1px;
    padding: 0 10px;
    border-left: 1px solid $gray4-light;
  }
  .line-style {
    width: 240px;
    height: 1px;
    border-top: 1px solid $gray7-light;
  }
  .arrow-right {
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-left: 8px solid $gray7-light;
    border-bottom: 6px solid transparent;
  }
  .custom-title {
    color: #000000;
    font-size: 14px;
  }
  .custom-content {
    color: #5e5e5e;
    font-size: 12px;
  }
}
</style>
