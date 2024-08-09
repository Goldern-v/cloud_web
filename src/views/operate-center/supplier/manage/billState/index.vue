<template>
  <div class="ideal-main-container bill-state-manage">
    <!-- 搜索框 -->
    <div class="flex-row">
      <div class="select_text">筛选条件</div>
      <el-radio-group
        v-model="timeSelect"
        class="ideal-default-margin-right"
        @change="timeChange"
      >
        <el-radio-button
          v-for="(item, index) in timeList"
          :key="index"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>

      <div class="ideal-default-margin-right">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD HH:mm:ss"
          @change="dateChange"
        />
      </div>
    </div>
    <!-- 收入总览  收入占比 -->
    <div class="revenue_review">
      <el-row :gutter="20">
        <el-col :span="18"
          ><div class="grid_content">
            <div class="padding_ten">
              <div class="flex-between">
                <p>收入总览</p>
                <el-select
                  v-if="!isSupplierManager"
                  v-model="supplierId"
                  placeholder="请选择供应商"
                  style="width: 20%"
                >
                  <el-option
                    v-for="(item, index) in supplierList"
                    :key="index"
                    :label="item.username"
                    :value="item.id"
                  />
                </el-select>
              </div>
              <!-- 柱形图 -->
              <bar-charts ref="incomeReviewRatio"></bar-charts>
            </div>
          </div>
        </el-col>
        <el-col :span="6"
          ><div class="grid_content">
            <div class="padding_ten">
              <div v-if="!isSupplierManager">
                <div>收入占比</div>
                <pie-charts ref="incomeScaleRatio"></pie-charts>
              </div>
              <div v-else>
                <div>相关指标</div>
                <supplier-index></supplier-index>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 账单明细 -->
    <div class="checkDetail">
      <div class="padding_ten">
        <div>账单明细</div>
        <!-- state.dataList -->
        <ideal-table-list
          :loading="state.dataListLoading"
          :table-data="state.dataList"
          :table-headers="tableHeaders"
          :pagination-type="PaginationTypeEnum.totalSizes"
          :total="state.total"
          :page="state.page"
          :max-height="maxHeight"
          @clickSizeChange="sizeChangeHandle"
          @clickCurrentChange="currentChangeHandle"
        >
        </ideal-table-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isSupplierManager } from '@/utils/role'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { PaginationTypeEnum } from '@/utils/enum'
import { ElMessage } from 'element-plus'
import { useCrud } from '@/hooks'
import barCharts from './barCharts.vue'
import pieCharts from './pieCharts.vue'
import supplierIndex from './supplierIndex.vue'
import { supplierInfoList, getSupplierList } from '@/api/java/operate-center'
const timeSelect = ref<number | null>()
const dateRange = ref<[Date, Date]>() //时间范围
const timeList = [
  { label: '近7天', type: 'd', value: 7 },
  { label: '近30天', type: 'd', value: 30 },
  { label: '近半年', type: 'm', value: 6 },
  { label: '近一年', type: 'm', value: 12 }
]

const timeChange = (time: any) => {
  const obj = timeList.find(item => item.value === time)
  if (obj) {
    const to = new Date()
    const from =
      obj?.type === 'd'
        ? new Date(to.getTime() - obj.value * 24 * 3600000)
        : new Date(to.getTime() - obj.value * 24 * 30 * 3600000)
    dateRange.value = [from, to]
  }
}

const dateChange = (val: any) => {
  timeSelect.value = null
}

watch(
  () => dateRange,
  val => {
    // queryRevenue()   收入总览卡片数据
  },
  { deep: true }
)
const supplierId = ref()
const supplierList: any = ref([])

const querySupplier = async () => {
  try {
    const res = await getSupplierList()
    supplierList.value = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}

const incomeReviewRatio = ref()
const incomeScaleRatio = ref()
nextTick(() => {
  incomeReviewRatio?.value.initEchart()
  incomeScaleRatio?.value.initEchart()
})

const state: IHooksOptions = reactive({
  dataListUrl: supplierInfoList,
  dataList: [] as any[],
  queryForm: {}
})

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

onMounted(() => {
  querySupplier()
  //平台管理员角色
  if (!isSupplierManager.value) {
    tableHeaders.value = headerArray
  }
  //供应商角色
  else {
    tableHeaders.value = headerArray.filter((item: any) => item.prop !== 'name')
  }
})
const maxHeight = ref(210)
const tableHeaders = ref<IdealTableColumnHeaders[]>()
const headerArray: IdealTableColumnHeaders[] = [
  { label: '供应商名称', prop: 'name', width: '120' },
  { label: '产品名称', prop: 'status', width: '120' },
  { label: '业务类型', prop: 'node', width: '100' },
  { label: '工单号', prop: 'area', width: '200' },
  { label: '工单类型', prop: 'country', width: '200' },
  { label: '带宽', prop: 'city' },
  { label: '价格（$)', prop: 'creator.username', width: '100' },
  { label: '账单生成时间', prop: 'createTime.date', width: '180' }
]
</script>

<style scoped lang="scss">
.bill-state-manage {
  background-color: white;
  padding: $idealPadding;
}
.select_text {
  display: flex;
  align-items: center;
  padding-right: 20px;
}
.revenue_review {
  margin-top: 30px;
  .grid_content {
    height: 300px;
    border: 1px solid #e3e3e3;
  }
}
.checkDetail {
  border: 1px solid #e3e3e3;
  margin-top: 10px;
}
.padding_ten {
  padding: 10px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
}
</style>
