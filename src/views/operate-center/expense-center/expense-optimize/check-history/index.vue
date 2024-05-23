<template>
  <div>
    <ideal-search
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #influenceDegree>
        <el-table-column label="影响程度">
          <template #default="props">
            <span :style="{ color: props.row.color }">{{
              props.row.incidenceTypeName
            }}</span>
          </template>
        </el-table-column>
      </template>

      <template #dimensionRange>
        <el-table-column label="维度范围">
          <template #default="props">
            <p v-for="(item, index) in props.row.dimensionRange" :key="index">
              {{ item }}
            </p>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <el-button link type="primary" @click="viewDetail(props.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <el-dialog
      v-model="dialogVisible"
      title="违规详情"
      :width="dialogWidth"
      :append-to-body="true"
      :before-close="handleClose"
      class="custom-class"
    >
      <ideal-table-list
        :table-data="detailTableData"
        :table-headers="tabOptions"
        :total="total"
        :page="page"
        @clickSizeChange="sizeChange"
        @clickCurrentChange="currentChange"
      >
        <template #status>
          <el-table-column label="状态">
            <template #default="props">
              <span
                :style="{
                  color: props.row.checkStatus ? '#2ba471' : '#d54941'
                }"
              >
                {{ props.row.statusText }}
              </span>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{
            t('cancel')
          }}</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            {{ t('confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealTextProp
} from '@/types'
import {
  billOptimizeLogPage,
  billOptimizeLogDetail
} from '@/api/java/operate-center'
import { useCrud } from '@/hooks'
import { FiltrateEnum } from '@/utils/enum'
import { dayjs } from 'element-plus'

const { t } = useI18n()

/**
 * 搜索类型
 * @type {IdealSearch[]}
 */
//影响程度
const influenceDegree = [
  { name: '低', code: 'LOW' },
  { name: '中', code: 'MIDDLE' },
  { name: '高', code: 'HIGH' },
  { name: '最高', code: 'HIGHEST' }
]
const typeArray = ref<IdealSearch[]>([
  {
    label: '影响程度',
    prop: 'incidenceType',
    type: FiltrateEnum.list,
    array: influenceDegree,
    arrayProp: 'name',
    arrayKey: 'code'
  },
  {
    label: '日期',
    prop: 'date',
    type: FiltrateEnum.date
  }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      if (item.prop === 'date') {
        const timeArray = temp[1].split('/')
        state.queryForm.beginTime = timeArray[0]
        state.queryForm.endTime = timeArray[1]
      } else {
        const result = influenceDegree.find((ele: any) => ele.name === temp[1])
        state.queryForm[item.prop] = result?.code
      }
    })
  }
  getDataList()
}

const date = ref('')

/**
 * 主列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: billOptimizeLogPage,
  queryForm: {}
})
//页码切换
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '策略执行ID', prop: 'id' },
  { label: '策略名称', prop: 'optimizingStrategyName' },
  { label: '作用维度', prop: 'actionDimension' },
  { label: '维度范围', prop: 'dimensionRange', useSlot: true },
  {
    label: '合格率',
    prop: 'rate',
    setTextType: true,
    textTypeProp: 'rateType'
  },
  { label: '违规数量', prop: 'unqualifiedNumber' },
  { label: '影响程度', prop: 'influenceDegree', useSlot: true },
  { label: '操作人', prop: 'creator.name' },
  { label: '开始检查时间', prop: 'beginTime' },
  { label: '结束检查时间', prop: 'endTime' }
]

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.incidenceType = search
  state.queryForm.beginTime = date.value[0]
  state.queryForm.endTime = date.value[1]
  getDataList()
}

// 重置
const clickReset = () => {
  state.page = 1
  date.value = ''
  state.queryForm = {}
  getDataList()
}

watch(
  () => state.dataList,
  value => {
    if (value) {
      value.forEach((item: any) => {
        const dimensionText: any = {
          VDC: 'VDC',
          PROJECT: '项目',
          POOL_RESOURCE: '资源池',
          CLOUD_PLATFORM: '云平台'
        }
        const colorFormat: any = {
          LOW: '#2ba471',
          MIDDLE: '#FA9550',
          HIGH: '#954500',
          HIGHEST: '#D54941'
        }
        item.color = colorFormat[item.incidenceType]
        item.rateType = item.rate === '100%' ? 'success' : 'danger'
        item.actionDimension = dimensionText[item.scope]
        item.dimensionRange = item.scopeDetail
          ? item.scopeDetail.split(',')
          : []
        item.beginTime = item.beginTime
          ? dayjs(item.beginTime).format('YYYY-MM-DD HH:mm:ss')
          : '--'
        item.endTime = item.endTime
          ? dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss')
          : '--'
      })
    }
  }
)

//查询检查详情
const total = ref()
const page = ref(1)
const pageSize = ref(10)
const queryDetailData = async () => {
  const params = {
    id: checkLogId.value,
    pageNum: page.value,
    pageSize: pageSize.value
  }
  const res: any = await billOptimizeLogDetail(params)
  const { data, code } = res
  if (code === 200) {
    data.data.forEach((ele: any) => {
      ele.statusText = ele.checkStatus ? '合格' : '违规'
    })
    total.value = data.total
    detailTableData.value = data.data
  } else {
    detailTableData.value = []
  }
}

const sizeChange = (val: number) => {
  detailTableData.value = []
  page.value = 1
  pageSize.value = val
  queryDetailData()
}

const currentChange = (val: number) => {
  detailTableData.value = []
  page.value = val
  queryDetailData()
}
const checkLogId = ref('')
/* 违规详情弹窗 */
const viewDetail = (row: any) => {
  dialogVisible.value = true
  checkLogId.value = row.id
  queryDetailData()
}
const dialogVisible = ref(false) // 是否显示弹框
const dialogWidth = ref('45%')
// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
}
//违规详情列表
const detailTableData: any = ref([])
const tabOptions = ref([
  { label: '主机名称', prop: 'vmName' },
  { label: '资源池', prop: 'resourcePoolName' },
  { label: '检查状态', prop: 'status', useSlot: true },
  { label: '开始检查时间', prop: 'beginTime' },
  { label: '结束检查时间', prop: 'endTime' }
])
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
}
</style>
