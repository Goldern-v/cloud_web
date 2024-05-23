<template>
  <div class="price-model">
    <div class="price-model__table-list">
      <div class="flex-row price-model__tip">
        <svg-icon
          icon="info-warning"
          color="var(--el-color-primary)"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span
          >您可以创建和管理定价模型，自定义各个云平台的资源价格，对用户申请的云资源进行计费</span
        >
      </div>

      <ideal-table-list
        :loading="state.dataListLoading"
        :table-data="state.dataList"
        :table-headers="tableHeaders"
        :total="state.total"
        :pagination-type="PaginationTypeEnum.totalSizes"
        @clickSizeChange="sizeChangeHandle"
        @clickCurrentChange="currentChangeHandle"
        @handleSelectionChange="selectionChangeHandle"
      >
        <template #expandTable>
          <el-table-column type="expand" width="60">
            <template #default="props">
              <div style="margin: 20px 60px">
                <el-row>
                  <el-col :span="12"
                    ><span class="ideal-tip-text">费用类型：</span
                    ><span>云主机</span></el-col
                  >
                  <el-col :span="12"
                    ><span class="ideal-tip-text">计费模式：</span
                    ><span>包年包月</span></el-col
                  >
                </el-row>
                <ideal-table-list
                  :table-data="props.row.billableItemsPrices"
                  :table-headers="billItemHeaders"
                  :show-pagination="false"
                >
                  <template #price>
                    <el-table-column label="计费价格/单位">
                      <template #default="props">
                        <div
                          v-for="(item, index) in props.row.priceText"
                          :key="index"
                        >
                          {{ item }}
                        </div>
                      </template>
                    </el-table-column>
                  </template>
                </ideal-table-list>
              </div>
            </template>
          </el-table-column>
        </template>
        <template #name>
          <el-table-column label="名称">
            <template #default="props">
              <div class="custom-color price-model__table-name">
                {{ props.row.name }}
              </div>
            </template>
          </el-table-column>
        </template>

        <template #status>
          <el-table-column label="状态">
            <template #default="props">
              <div>
                {{ props.row.enabled ? '启用' : '停用' }}
              </div>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

    <save-button @clickCancel="clickCancel" @clickSave="clickSave">
    </save-button>
  </div>
</template>

<script setup lang="ts">
/**
 * 详情的价格模型
 */
import saveButton from './save-button.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { PaginationTypeEnum, BillingEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
import { billPriceModel } from '@/api/java/operate-center'

const route = useRoute()

const cloudPlatformId = route.query.id as string

const state: IHooksOptions = reactive({
  dataListUrl: billPriceModel,
  queryForm: {
    cloudPlatformId
  }
})
watch(
  () => state.dataList,
  (arr: any) => {
    if (arr.length) {
      arr.forEach((ele: any) => {
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
                  const string =
                    ele.start +
                    '-' +
                    ele.end +
                    ', ' +
                    ele.unitPrice +
                    '元/' +
                    item.unit
                  arr.push(string)
                } else {
                  const string =
                    ele.start + '以上, ' + ele.unitPrice + '元/' + item.unit
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
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle } =
  useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '费用类型', prop: 'expenseType.name' },
  { label: '计费模式', prop: 'billingMode' },
  { label: '创建者', prop: 'creator.name' },
  { label: '创建时间', prop: 'createTime.date' }
]

const billItemHeaders: IdealTableColumnHeaders[] = [
  { label: '计费项', prop: 'billableItems.name' },
  { label: '计费单元', prop: 'billableItems.preUnit' },
  { label: '计费价格/单位', prop: 'price', useSlot: true },
  { label: '周期', prop: 'billCycleText' }
]

const router = useRouter()
const clickCancel = () => {
  router.back()
}

const clickSave = () => {
  router.push({
    path: '/operate-center/basic-config/cloud-platform-manage/list'
  })
}
</script>

<style scoped lang="scss">
.price-model {
  width: 100%;
  .price-model__table-list {
    padding: $idealPadding;
    .price-model__tip {
      background-color: var(--custom-information-bg-color);
      padding: 20px;
      align-items: center;
    }
    .price-model__table-name {
      cursor: pointer;
    }
  }

  .custom-color {
    color: var(--el-color-primary);
  }
}
</style>
