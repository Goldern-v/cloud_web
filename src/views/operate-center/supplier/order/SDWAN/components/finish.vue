<template>
  <div class="supplier-order">
    <ideal-search
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider border-style="solid" />

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
      <template #operation>
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateButtons"
              @clickMoreEvent="clickOperateEvent($event as any, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
    <flow ref="flowRef"></flow>
  </div>
</template>

<script setup lang="ts">
import { IdealTextProp } from '@/types'
import {
  operateButtons,
  stateData,
  tableHeaders,
  typeArray
} from '../utils/data'
import { IHooksOptions } from '@/hooks/interface'
import {
  supplierInfoList,
  supplierInfoQueryList
} from '@/api/java/operate-center'
import { useCrud } from '@/hooks'
import { PaginationTypeEnum } from '@/utils/enum'
import flow from './flow.vue'

const state: IHooksOptions = reactive(stateData)
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)
const flowRef = ref()

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  state.queryForm.approvalStatus = 'pass'
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      state.queryForm[item.prop] = temp[1]
    })
    state.dataListUrl = supplierInfoQueryList
  } else {
    state.dataListUrl = supplierInfoList
  }
  getDataList()
}

const clickOperateEvent = (e, row) => {
  console.log('clickOperateEvent', e, row)
  flowRef.value.open(row)
}
</script>

<style lang="scss" scoped>
.supplier-order {
  background-color: white;
  padding: $idealPadding;
}
</style>
