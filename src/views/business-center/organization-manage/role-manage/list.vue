<template>
  <div class="ideal-main-container role-manage flex-row">
    <div class="role-manage__tree">
      <div class="flex-row role-manage__tree-title">
        <el-divider direction="vertical" />
        <div>角色管理</div>
      </div>

      <el-input
        v-model="filterText"
        placeholder="请输入内容"
        class="role-manage__tree-input"
      >
        <template #suffix>
          <svg-icon icon="search-icon"></svg-icon>
        </template>
      </el-input>

      <el-tree
        ref="treeRef"
        :data="dataSource"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      >
      </el-tree>
    </div>

    <div class="role-manage__table">
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
          <el-table-column label="操作" width="120">
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
import { ElTree } from 'element-plus'
import type { 
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealSearchResult,
  IdealButtonEventProp
} from '@/types'
import {
  queryRoleClassify,
  getRolePage,
  deleteRole
} from '@/api/java/business-center'

const builtInRoles: any = [
  { label: '全部', value: '' },
  { label: '否', value: false },
  { label: '是', value: true }
]
const typeArray = ref<IdealSearch[]>([
  { label: '角色', prop: 'name', type: FiltrateEnum.input },
  {
    label: '自定义角色',
    prop: 'type',
    type: FiltrateEnum.list,
    array: builtInRoles,
    arrayProp: 'label',
    arrayKey: 'value'
  }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

// 树控组件
interface Tree {
  [key: string]: any
}
const dataSource = ref<Tree[]>([])
// 配置选项
const defaultProps = {
  children: 'children',
  label: 'name',
  highlight: 'highlight'
}
// 费用类型树搜索
const filterText = ref('')
// 费用类型树
const treeRef = ref<InstanceType<typeof ElTree>>()
// 根据搜索值筛选数据
watch(filterText, val => {
  treeRef.value!.filter(val)
})
// 对树节点进行筛选时执行的方法,返回false则表示这个节点会被隐藏
const filterNode = (value: string, data: Tree) => {
  if (!value) {
    return true
  }
  return data.name.includes(value)
}
// 点击节点
const handleNodeClick = (data: Tree) => {
  state.queryForm.roleType = data.value
  getDataList()
}

onMounted(() => {
  queryTreeData()
})

const queryTreeData = () => {
  queryRoleClassify().then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      dataSource.value = data
    } else {
      dataSource.value = []
    }
  })
}

/**
 * 列表
 */
//  列表搜索值
const searchValue = ref('')
const customRole = ref('')

const state: IHooksOptions = reactive({
  dataListUrl: getRolePage,
  deleteUrl: deleteRole,
  queryForm: {
    name: searchValue
  }
})
const { deleteHandle, getDataList, sizeChangeHandle, currentChangeHandle } =
  useCrud(state)
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit', authority: 'sys:role:edit' },
  { title: '删除', prop: 'delete', authority: 'sys:role:delete' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '角色名称', prop: 'name' },
  { label: '描述', prop: 'remark' },
  { label: '自定义角色', prop: 'customRole' },
  { label: '创建人', prop: 'creator' },
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
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    clickAddRole()
  }
}
// 新建角色
const router = useRouter()
const clickAddRole = () => {
  router.push({
    path: '/business-center/organization-manage/role-manage/create'
  })
}

// 列表操作
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'edit') {
    const detail = JSON.stringify(row)
    router.push({
      path: '/business-center/organization-manage/role-manage/create',
      query: { detail, type: 'edit' }
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
// 内置角色不可编辑删除
const handleBuiltInRole = (
  type: boolean,
  array: IdealTableColumnOperate[]
): IdealTableColumnOperate[] => {
  array.forEach(item => {
    item.disabled = type
    item.disabledText = `内置角色不可${item.title}`
  })

  return array
}
/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const expenseTypeData = ref({}) //费用类型行数据
const rowData = ref({}) //计费项行数据
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
</script>
<style lang="scss" scoped>
.role-manage {
  padding: $idealPadding;
  height: calc(
    100vh - var(--theme-header-height) - var(--navigation-bar-height) - 40px
  );
  background-color: white;
  :deep(.el-select .el-input) {
    width: 200px;
    height: 34px;
  }
  .role-manage__tree {
    width: 20%;
    border-right: 1px $gray1-light solid;
    .role-manage__tree-title {
      justify-content: flex-start;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px $gray1-light solid;
      :deep(.el-divider--vertical) {
        border-left: 2px var(--el-color-primary) var(--el-border-style);
      }
    }
    .role-manage__tree-input {
      padding: 0 10px;
      margin: 10px 0;
    }
  }
  .role-manage__table {
    width: 80%;
    padding: 10px;
  }
  :deep(.el-table) {
    height: calc(
      100vh - var(--navigation-bar-height) - var(--theme-header-height) - 40px -
        20px - 54px - 20px - 32px - 20px - 15px - 34px
    );
  }
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
}
</style>
