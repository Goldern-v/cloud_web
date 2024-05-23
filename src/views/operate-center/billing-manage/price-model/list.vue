<template>
  <div class="ideal-main-container price-model-list">
    <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />

    <el-divider border-style="solid" />

    <el-button type="primary" @click="clickPriceModelCreate">
      <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
      新建定价模型
    </el-button>

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
      <template #cloudPlatformType>
        <el-table-column label="云平台类型" width="200">
          <template #default="props">
            <div style="align-items: center" class="flex-row">
              <div class="flex-row" style="align-items: center">
                <img
                  :src="props.row.cloudPlatform.imageUrl"
                  alt=""
                  style="width: 40px; height: 40px"
                />
                <span>{{
                  props.row.cloudPlatform.cloudCategory === 'PUBLIC'
                    ? '公有云'
                    : '私有云'
                }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
      <template #enable>
        <el-table-column label="启用" width="200">
          <template #default="props">
            <div @click="clickEnable(props.row)">
              <el-switch
                v-model="props.row.enabled"
                :active-value="true"
                :inactive-value="false"
                @change="changeStatus(props.row)"
              />
            </div>
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
    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus/es'
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import {
  FiltrateEnum,
  PaginationTypeEnum,
  OperateEventEnum
} from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealTextProp
} from '@/types'
import {
  billPriceModel,
  deleteBillPrice,
  enabledBillPrice
} from '@/api/java/operate-center'

/**
 * 搜索类型
 * @type {IdealSearch[]}
 */
const typeArray = ref<IdealSearch[]>([
  { label: '定价模型名称', prop: 'name', type: FiltrateEnum.input }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      state.queryForm[item.prop] = temp[1]
    })
  }
  getDataList()
}
/**
 * 列表
 */
const searchValue = ref('') //  列表搜索值
const state: IHooksOptions = reactive({
  dataListUrl: billPriceModel,
  dataList: [] as any[],
  deleteUrl: '',
  queryForm: {
    name: searchValue
  },
  primaryKey: 'id' // 多选结果主键
})
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)
const operateButtons: IdealTableColumnOperate[] = [
  { title: '计费详情', prop: 'chargeItem' },
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', width: '200' },
  {
    label: '云平台类型',
    prop: 'cloudPlatformType',
    useSlot: true
  },
  { label: '云平台名称', prop: 'cloudPlatform.name', width: '200' },
  { label: '资源池名称', prop: 'resourceName', width: '200' },
  { label: '启用', prop: 'enable', useSlot: true },
  { label: '费用类型', prop: 'expenseType.name', width: '200' },
  { label: '计费模式', prop: 'billingMode', width: '200' },
  { label: '创建者', prop: 'creator.name', width: '200' },
  { label: '创建时间', prop: 'createTime.date', width: '200' }
]

//处理表格数据
watch(
  () => state.dataList,
  (arr: any) => {
    if (arr.length) {
      arr.forEach((ele: any) => {
        ele.operate = newOperate(ele)
        ele.resourceName = '全部'
        const billingModeFormat: any = {
          ON_DEMAND: '按需',
          PACKAGE: '包年/包月'
        }
        ele.billingMode = billingModeFormat[ele.billType]
        ele.billableItemsPrices.forEach((item: any) => {
          const cycleFormat: any = {
            HOUR: '时',
            DAY: '日',
            WEEK: '周',
            MONTH: '月'
          }
          item.billCycleText = cycleFormat[ele.billCycle]
          if (item.unitPrice) {
            item.priceText = [item.unitPrice + '元 /' + item.unit]
          } else {
            const arr: any = []
            if (item.tieredPrices.length) {
              item.tieredPrices.forEach((ele: any) => {
                if (ele.end) {
                  const string = `${ele.start}-${ele.end},${ele.unitPrice}元/${item.unit}`
                  arr.push(string)
                } else {
                  const string = `${ele.start}以上,${ele.unitPrice}元/ ${item.unit}`
                  arr.push(string)
                }
                item.priceText = arr
              })
            }
          }
        })
      })
    }
  }
)

const newOperate = (ele: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateButtons))
  if (ele.enabled) {
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
    if (item.prop === 'edit' || item.prop === 'delete') {
      item.disabled = disabled
      item.disabledText = `启用状态下${item.title}不可操作`
    }
    arr.push(item)
  })
  return arr
}
/**
 * 列表操作
 */
const changeStatus = async (rowData: any) => {}
const rowData = ref({}) //定价模型行数据
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'edit') {
    const data = JSON.stringify(row)
    router.push({
      path: '/operate-center/billing-manage/price-model/create',
      query: { type: 'edit', data }
    })
  } else if (command === 'delete') {
    ElMessageBox.confirm('确定要删除当前定价模型吗？', '删除定价模型', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteBillPrice('', { id: row.id }).then((res: any) => {
        const { code } = res
        if (code === 200) {
          getDataList()
          ElMessage.success('删除定价模型成功')
        } else {
          ElMessage.success('删除定价模型成功')
        }
      })
    })
  } else if (command === 'chargeItem') {
    showDialog.value = true
    dialogType.value = 'chargeItem'
    rowData.value = row
  }
}

/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = (value: any) => {
  showDialog.value = false
}

/**
 * 新建定价模型
 */
const router = useRouter()
const clickPriceModelCreate = () => {
  router.push({
    path: '/operate-center/billing-manage/price-model/create',
    query: { type: 'create' }
  })
}
// 启用
const clickEnable = (row: any) => {
  const params = {
    enabled: row.enabled,
    id: row.id
  }
  enabledBillPrice(params)
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success(`${row.enabled ? '启用' : '禁用'}定价模型成功`)
        getDataList()
      } else {
        ElMessage.error(`${row.enabled ? '启用' : '禁用'}定价模型失败`)
      }
    })
    .catch((err: any) => {
      row.enabled = !row.enabled
    })
}
</script>

<style scoped lang="scss">
.price-model-list {
  background-color: white;
  padding: $idealPadding;
}
:deep(.el-pager li) {
  line-height: inherit;
}
.el-table {
  margin: 20px 0;
}
// 自定义表头(注: 修改表头颜色, 可以在父视图下穿透修改background-color)
:deep(.el-table th.el-table__cell) {
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  background-color: $tableHeaderBgColor;
  color: #000;
}

/* :deep .el-table--default .cell {
  padding: 0px;
} */
</style>
