<template>
  <div class="sql-data-analyze">
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :pagination-type="PaginationTypeEnum.totalSizes"
      show-border
    >
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <div>
              <el-switch
                v-model="props.row.enabled"
                :active-value="true"
                :inactive-value="false"
              />
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>
<script lang="ts" setup>
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { SearchTypeEnum, PaginationTypeEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'

//  列表搜索值
const searchValue = ref('')
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '序号', prop: 'order' },
  { label: '[1]角色名', prop: 'roleName' },
  { label: '[1]组织ID(计数)', prop: 'orgId' },
  { label: '[1]用户ID(求和)', prop: 'userId' },
  { label: '[2]角色ID(最大值)', prop: 'maxRoleName' },
  { label: '[1]主键ID(最大值)', prop: 'majorKey' },
  { label: '[1]角色名(最大值)', prop: 'maxRoleName' }
]
state.dataList = [
  {
    order: '1',
    roleName: '普通用户',
    orgId: '0',
    userId: '1',
    maxRoleName: '582'
  }
]
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.queryForm = {}
  getDataList()
}

const querySummaries = (val: any) => {
  const { columns, data } = val
  const sums = []
  // columns.forEach((column: any, index: number) => {
  //   if (index === 0) {
  //     sums[index] = '总价'
  //     return
  //   }
  // })
}
</script>
<style lang="scss" scoped>
.sql-data-analyze {
  padding: 20px;
  width: 100%;
  .ideal-table-list__container {
    padding-top: 0;
  }
}
</style>
