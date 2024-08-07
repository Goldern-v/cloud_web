<template>
  <div class="ideal-main-container work-manage-manage">
    <p>基本信息</p>
    <ideal-detail-info
      :label-array="labelArray"
      :detail-info="detailInfo"
      class="padding-left"
    >
      <template #typeText>
        <div>{{ detailInfo.type ? typeFormat[detailInfo.type] : '' }}</div>
      </template>
      <template #statusText>
        <div>
          {{ detailInfo.status ? statusFormat[detailInfo.status] : '' }}
        </div>
      </template>
      <template #bandwidthUnit>
        <div>
          {{ detailInfo.bandwidth ? detailInfo.bandwidth + 'Mbps' : '' }}
        </div>
      </template>
      <template #createTime>
        <div>{{ detailInfo.createTime ? detailInfo.createTime.date : '' }}</div>
      </template>
      <template #updateTime>
        <div>{{ detailInfo.updateTime ? detailInfo.updateTime.date : '' }}</div>
      </template>
    </ideal-detail-info>

    <p>资源概览</p>

    <!-- <ideal-table-list
      :table-data="dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      class="padding-left"
    >
    </ideal-table-list> -->
    <div class="padding-left resource_box">
      <div v-for="(item, index) in dataList" :key="index" :style="itemWidth">
        <div
          v-for="(ele, index) in handleSort(item)"
          :key="index"
          :class="resourceList[ele.key] ? 'detail_info_item' : ''"
        >
          <div v-if="resourceList[ele.key]" style="display: flex">
            <div
              v-if="ele.key == 'aType' || ele.key == 'zType'"
              style="font-weight: 600"
            >
              {{ resourceList[ele.key] }}
            </div>
            <div v-else class="resource_text ideal-default-margin-right">
              {{ resourceList[ele.key] }}
            </div>

            <div
              v-if="ele.key == 'portType'"
              class="ideal-detail-info-item__content"
            >
              {{ portTypeList[ele.value as string] }}
            </div>
            <div
              v-else-if="ele.key == 'portBandwidth'"
              class="ideal-detail-info-item__content"
            >
              {{ ele.value }}Mbps
            </div>
            <div v-else class="ideal-detail-info-item__content">
              {{ ele.value }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="
        detailInfo.connectionPrice != null ||
        detailInfo.connectionPrice != undefined
      "
    >
      <p>线路价格</p>

      <!-- 未审批情况下 -->
      <ideal-table-list
        :table-data="priceList"
        :table-headers="priceHeaders"
        :show-pagination="false"
        class="padding-left"
      >
        <template #expandTable>
          <el-table-column type="expand">
            <template #default="props">
              <p>审批详情</p>
              <ideal-table-list
                :table-data="props.row.workOrderApproveItems"
                :table-headers="contactTableHeaders"
                :show-pagination="false"
                style="padding-left: 60px"
              >
              </ideal-table-list>
            </template>
          </el-table-column>
        </template>
        <template #operation>
          <el-table-column
            v-if="detailInfo.type == 'NEW_DISCOUNT'"
            label="操作"
            width="120"
            fixed="right"
          >
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
    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-id="rowId"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>
<script setup lang="ts">
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { isSupplierManager } from '@/utils/role'
import dialogBox from './dialog-box.vue'
import {
  supplierWorkorderDetail,
  supplierWokkorderApproved
} from '@/api/java/operate-center'
import { typeFormat, statusFormat, resourceList, portTypeList } from './common'
import { ElMessage } from 'element-plus'
const detailInfo: any = ref({})
const route = useRoute()
onMounted(() => {
  //平台管理员角色
  if (!isSupplierManager.value) {
    labelArray.value = headerArray.value
  }
  //供应商角色
  else {
    labelArray.value = headerArray.value.filter(
      (item: any) => item.prop !== 'supplierName' && item.prop !== 'orderId'
    )
  }
  queryDetailData()
})
// 订单详情获取
const queryDetailData = () => {
  const id = route.query.id
  supplierWorkorderDetail({ id })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        detailInfo.value = data
        priceList.value = data.connectionPrice ? [data.connectionPrice] : []
      } else {
        detailInfo.value = {}
      }
    })
    .catch(_ => {})
}
const dataList: any = ref([])
const priceList: any = ref([])
// 每条宽
const itemWidth = computed(() => `width: calc((100% / 2) - 20px)`)
watch(
  () => detailInfo.value,
  (val: any) => {
    if (val) {
      dataList.value = [
        {
          aType: '',
          ...val.endpointADto
        },
        {
          zType: '',
          ...val.endpointZDto
        }
      ]
    }
  }
)
// 处理资源概览中端口类型顺序排列参数第一问题
const handleSort = (obj: Object) => {
  const tem = Object.entries(obj).map(([key, value]) => ({
    key,
    value
  }))
  const removedIndex = ref<number>(0)
  tem.forEach((ele, index) => {
    if (ele.key === 'portType') {
      removedIndex.value = index
    }
  })
  // 移除元素并保存
  const removedElement = tem.splice(removedIndex.value, 1)[0]

  // 在目标位置插入元素
  tem.splice(1, 0, removedElement)
  return tem
}
watch(
  () => priceList.value,
  (arr: any) => {
    if (arr.length) {
      arr.forEach((ele: any) => {
        ele.operate = newOperate(ele)
        ele.statusText = ele.status ? statusFormat[ele.status] : ''
        ele.workOrderApproveItems.forEach((item: any) => {
          item.acceptablePrice = item.acceptablePrice
            ? item.acceptablePrice
            : '-'
          item.statusText = item.status ? statusFormat[item.status] : ''
        })
      })
    }
  }
)
const labelArray = ref([])
const headerArray: any = ref([
  { label: '供应商名称', prop: 'supplierName' },
  { label: '工单号', prop: 'id' },
  { label: '订单号', prop: 'orderId' },
  { label: '工单类型', prop: 'typeText', useSlot: true },
  { label: '工单状态', prop: 'statusText', useSlot: true },
  { label: '带宽', prop: 'bandwidthUnit', useSlot: true },
  { label: '线路编号', prop: 'privateConnectId' },
  { label: '创建时间', prop: 'createTime', useSlot: true },
  { label: '交付时间', prop: 'updateTime', useSlot: true },
  { label: '备注信息', prop: 'remark' }
])

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '接入类型', prop: 'type' },
  { label: '云连接类型', prop: 'cloudType' },
  { label: '地址', prop: 'cloudRegionId' },
  { label: 'vlan', prop: 'vlanId' }
]
const priceHeaders: IdealTableColumnHeaders[] = [
  { label: '原价', prop: 'originalPrice' },
  { label: '成交价($)', prop: 'transactionPrice' },
  { label: '审批状态', prop: 'statusText' },
  { label: '最终可接受价格($)', prop: 'acceptablePrice' },
  { label: '审批时间', prop: 'updateTime' }
]
const operateButtons: IdealTableColumnOperate[] = [
  {
    title: '通过',
    prop: 'pass',
    authority: 'supplier:workorder:manage:passed'
  },
  {
    title: '驳回',
    prop: 'reject',
    authority: 'supplier:workorder:manage:reject'
  }
]
const newOperate = (ele: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateButtons))
  if (ele.status.toUpperCase() !== 'UN_APPROVED' || !isSupplierManager.value) {
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
    item.disabledText = `非管理员角色且状态为未审批时方可对线路价格进行审批操作`
    arr.push(item)
  })
  return arr
}
const rowId = ref('')
const clickOperateEvent = (command: string | number, row: any) => {
  rowId.value = row.id
  if (command === 'pass') {
    handlePass(row)
  } else if (command === 'reject') {
    showDialog.value = true
    dialogType.value = 'reject'
  }
}

const showDialog = ref(false)
const dialogType = ref<string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  queryDetailData()
}
// 审批通过111
const handlePass = (row: any) => {
  const id = row.id
  supplierWokkorderApproved({ id })
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        queryDetailData()
        ElMessage.success('通过成功')
      } else {
        ElMessage.error('通过失败')
      }
    })
    .catch(_ => {})
}
const contactTableHeaders: IdealTableColumnHeaders[] = [
  { label: '成交价($)', prop: 'transactionPrice' },
  { label: '审批记录', prop: 'statusText' },
  { label: '可接受价格($)', prop: 'acceptablePrice' },
  { label: '审批时间', prop: 'updateTime' }
]
</script>

<style scoped lang="scss">
.work-manage-manage {
  background-color: white;
  padding: $idealPadding;
}
.basic-info {
  background-color: white;
}
.padding-left {
  padding-left: 60px;
  margin-bottom: 20px;
}
.resource_box {
  width: calc(100% - 20px);
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.resource_text {
  width: 150px;
  color: #8b8b8b;
}
.detail_info_item {
  padding: 10px;
  align-items: center;
}
</style>
