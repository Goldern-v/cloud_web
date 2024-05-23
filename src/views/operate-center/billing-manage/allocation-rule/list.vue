<template>
  <div class="ideal-main-container cost-center">
    <ideal-search
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider border-style="solid" />

    <el-button type="primary" @click="clickAllocationRuleCreate">
      <svg-icon
        icon="circle-add"
        color="white"
        class="ideal-svg-margin-right"
      ></svg-icon>
      创建分摊规则
    </el-button>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
      :pagination-type="PaginationTypeEnum.totalSizes"
    >
      <template #enable>
        <el-table-column label="启用">
          <template #default="props">
            <div @click="clickEnable(props.row)">
              <el-switch
                v-model="props.row.enabled"
                :active-value="true"
                :inactive-value="false"
              />
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
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
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { FiltrateEnum, PaginationTypeEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealTextProp,
  IdealSearch
} from '@/types'
import {
  allocationRulesPage,
  deleteAllocationRule,
  enabledAllocationRule
} from '@/api/java/operate-center'
import { ElMessage } from 'element-plus/es'

/**
 * 搜索类型
 * @type {IdealSearch[]}
 */
const typeArray = ref<IdealSearch[]>([
  { label: '分摊规则名称', prop: 'name', type: FiltrateEnum.input }
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

//  列表搜索值
const searchValue = ref('')
const state: IHooksOptions = reactive({
  dataListUrl: allocationRulesPage,
  deleteUrl: deleteAllocationRule,
  queryForm: {
    name: searchValue
  }
})
const { getDataList, deleteHandle } = useCrud(state)
const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '规则名称', prop: 'name' },
  { label: '描述', prop: 'remark' },
  { label: '优先级', prop: 'order' },
  { label: '启用', prop: 'enable', useSlot: true },
  { label: '创建者', prop: 'creator.name' },
  { label: '创建时间', prop: 'createTime' }
]
// 列表搜索
const clickSearch = (search: string, type: string) => {
  searchValue.value = search
  getDataList()
}
// 列表重置
const clickReset = () => {
  state.page = 1
  searchValue.value = ''
  getDataList()
}
// 操作
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'delete') {
    deleteHandle(row.id, '/', '确定要删除当前分摊规则吗？', '删除分摊规则')
  } else if (command === 'edit') {
    let data = JSON.stringify(row)
    router.push({
      path: '/operate-center/billing-manage/allocation-rule/create',
      query: { type: 'edit', data }
    })
  }
}

const router = useRouter()
const clickAllocationRuleCreate = () => {
  router.push({ path: '/operate-center/billing-manage/allocation-rule/create' })
}
const clickEnable = (row: any) => {
  const params = {
    enabled: row.enabled,
    id: row.id
  }
  enabledAllocationRule(params)
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success(`${row.enabled ? '启用' : '禁用'}分摊规则成功`)
      } else {
        ElMessage.error('启用分摊规则失败')
      }
    })
    .catch((err: any) => {
      row.enabled = !row.enabled
    })
}
</script>

<style scoped lang="scss">
.cost-center {
  background-color: white;
  padding: $idealPadding;
}
</style>
