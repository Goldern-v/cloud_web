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

    <el-button type="primary" @click="clickCostCenterCreate">
      <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
      创建成本中心
    </el-button>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
      :pagination-type="PaginationTypeEnum.totalSizes"
    >
      <template #vdc>
        <el-table-column label="关联VDC">
          <template #default="props">
            <p v-for="(item, index) in props.row.vdcList" :key="index">
              {{ item.name }}
            </p>
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
import { billCostPage, deleteBillCostCenter } from '@/api/java/operate-center'

/**
 * 搜索类型
 * @type {IdealSearch[]}
 */
const typeArray = ref<IdealSearch[]>([
  { label: '成本中心名称', prop: 'name', type: FiltrateEnum.input }
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

/* 
列表 
*/
//  列表搜索值
const searchValue = ref('')
const state: IHooksOptions = reactive({
  dataListUrl: billCostPage,
  deleteUrl: '',
  queryForm: {
    name: searchValue
  }
})
const { getDataList } = useCrud(state)
const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '成本中心名称', prop: 'name' },
  { label: '描述', prop: 'remark' },
  { label: '关联VDC', prop: 'vdc', useSlot: true },
  { label: '创建者', prop: 'creator.name' },
  { label: '创建时间', prop: 'createTime.date' }
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
    ElMessageBox.confirm('确定要删除当前分摊规则吗？', '删除分摊规则', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteBillCostCenter({ version: row.version }, { id: row.id }).then(
          (res: any) => {
            let { code } = res
            if (code === 200) {
              getDataList()
              ElMessage.success('删除成本中心成功')
            } else {
              ElMessage.success('删除成本中心失败')
            }
          }
        )
      })
      .catch(() => {
        ElMessage.info('删除成本中心失败')
      })
  } else if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
    rowData.value = row
  }
}

//创建成本中心
const clickCostCenterCreate = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.create
  rowData.value = {}
}

/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const rowData = ref({}) //行数据
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>

<style scoped lang="scss">
.cost-center {
  background-color: white;
  padding: $idealPadding;
}
</style>
