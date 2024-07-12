<template>
  <div class="ideal-main-container role-manage">
    <ideal-search
      :type-array="typeArray"
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      @clickSearch="onClickSearch"
    ></ideal-search>

    <el-divider border-style="solid" />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #operation>
        <el-table-column label="操作" width="150">
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
      :expense-type-data="expenseTypeData"
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script lang="ts" setup>
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { FiltrateEnum, OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealSearchResult,
  IdealButtonEventProp
} from '@/types'
import { getRolePage, deleteRole } from '@/api/java/business-center'

// 搜索
const builtInRoles: any = [
  { label: '全部', value: '' },
  { label: '否', value: false },
  { label: '是', value: true }
]
const typeArray = ref<IdealSearch[]>([
  { label: '角色名称', prop: 'name', type: FiltrateEnum.input }
  // {
  //   label: '自定义角色',
  //   prop: 'type',
  //   type: FiltrateEnum.list,
  //   array: builtInRoles,
  //   arrayProp: 'label',
  //   arrayKey: 'value'
  // }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {
    rolePlatformType: '1' // 0:云管平台 1: 国际公司
  }
  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}
/**
 * 列表
 */
//  列表搜索值
const searchValue = ref('')

const state: IHooksOptions = reactive({
  dataListUrl: getRolePage,
  deleteUrl: deleteRole,
  queryForm: {
    rolePlatformType: '1' // 0:云管平台 1: 国际公司
  }
})
const { deleteHandle, getDataList, sizeChangeHandle, currentChangeHandle } =
  useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '角色名称', prop: 'name' },
  { label: '绑定用户数量', prop: 'bindUserCount' },
  { label: '描述', prop: 'remark' },
  { label: '创建时间', prop: 'createTime' }
]

watch(
  () => state.dataList,
  arr => {
    arr?.forEach((item: any) => {
      item.operate = newOperate(item)
    })
  }
)

// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建角色',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white',
    authority: 'sys:role:create'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  }
}
// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit', authority: 'sys:role:edit' },
  { title: '授权', prop: 'auth', authority: 'sys:role:authorization' },
  { title: '删除', prop: 'delete', authority: 'sys:role:delete' }
]
const router = useRouter()
const rowData = ref({}) // 行数据
const clickOperateEvent = (command: string | number, row: any) => {
  rowData.value = row
  if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
  } else if (command === 'auth') {
    router.push({
      path: '/operate-center/supplier/account/role/auth',
      query: { id: row?.id }
    })
  } else if (command === 'delete') {
    deleteHandle(row.id, '/', '确定要删除当前角色吗？', '删除角色')
  }
}

const newOperate = (item: any): IdealTableColumnOperate[] => {
  const resultArr: IdealTableColumnOperate[] = JSON.parse(
    JSON.stringify(operateBtns)
  )
  if (item.type) {
    resultArr.forEach(item => {
      item.disabled = true
      item.disabledText = `内置角色不可${item.title}`
    })
  }
  return resultArr
}
/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const expenseTypeData = ref({}) //费用类型行数据

const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>
<style lang="scss" scoped>
.role-manage {
  padding: $idealPadding;
  background-color: white;
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
}
</style>
