<template>
  <div class="ideal-main-container charge-type-list flex-row">
    <div class="charge-type-list__tree">
      <div class="flex-row charge-type-list__tree-title">
        <el-divider direction="vertical" />
        <div>费用类型</div>
      </div>

      <el-input
        v-model="filterText"
        placeholder="请输入内容"
        class="charge-type-list__tree-input"
      >
        <template #suffix>
          <svg-icon icon="search-icon"></svg-icon>
        </template>
      </el-input>

      <el-tree
        ref="treeRef"
        class="filter-tree"
        :data="dataSource"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node show-hide">
            <span>{{ node.label }}</span>
            <span v-if="node.level === 1" style="width: 25px; height: 100%">
              <svg-icon icon="circle-add" @click.stop="addCostType"></svg-icon>
            </span>
            <span
              v-if="node.level === 3"
              class="flex-row"
              style="display: none"
            >
              <svg-icon
                icon="edit-pen"
                class="ideal-svg-margin-right"
                @click.stop="editCostType(data)"
              ></svg-icon>
              <svg-icon
                icon="delete-icon"
                @click.stop="deleteCostType(node, data)"
              ></svg-icon>
            </span>
          </span>
        </template>
      </el-tree>
    </div>

    <div class="charge-type-list__table">
      <ideal-search
        :show-category="false"
        :show-platform-type="false"
        :show-resource-pool="false"
        :type-array="typeArray"
        @clickSearch="onClickSearch"
      />

      <el-divider border-style="solid" />
      <el-button type="primary" @click="clickCostItemCreate">
        <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
        创建计费项
      </el-button>

      <ideal-table-list
        :loading="state.dataListLoading"
        :table-data="state.dataList"
        :table-headers="tableHeaders"
        :total="state.total"
        :page="state.page"
        :show-pagination="false"
        max-height="70vh"
      >
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

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :expense-type-data="expenseTypeData"
      :bill-item-data="billItemData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { ElTree } from 'element-plus'
import dialogBox from './dialog-box.vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { FiltrateEnum, OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealTextProp
} from '@/types'
import {
  billItems,
  deleteBillItem,
  expenseTypeGrade,
  deleteExpenseType
} from '@/api/java/operate-center'

onMounted(() => {
  queryExpenseTypeGrade()
})

/**
 * 费用类型
 */
interface Tree {
  [key: string]: any
}
const dataSource = ref<Tree[]>([
  {
    name: '资源中心',
    expenseType: 'resourceCenter',
    children: []
  }
])
//查询费用类型分级列表
const queryExpenseTypeGrade = async (params?: any) => {
  const res: any = await expenseTypeGrade(params)
  if (res.code === 200) {
    dataSource.value[0].children = []
    for (let propertyName in res.data) {
      if (res.data.hasOwnProperty(propertyName)) {
        const expenseType: any = {
          COMPUTE: '计算',
          STORAGE: '存储',
          NETWORK: '网络'
        }
        dataSource.value[0].children.unshift({
          name: expenseType[propertyName],
          expenseType: propertyName,
          children: res.data[propertyName]
        })
      }
    }
    expenseTypeData.value = res.data.COMPUTE[0]
    state.queryForm.expenseTypeId = res.data.COMPUTE[0].id
    getDataList()
  }
}

const treeRef = ref<InstanceType<typeof ElTree>>() // 费用类型树
// 配置选项
const defaultProps = {
  children: 'children',
  label: 'name'
}
// 费用类型树搜索
const filterText = ref('')
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
// 点击费用类型节点
const handleNodeClick = (data: Tree) => {
  //点击上层节点时默认展示第一个费用类型子节点下的计费项
  if (data.expenseType === 'resourceCenter') {
    state.queryForm.expenseTypeId = data.children[0].children[0].id
  } else if (
    data.expenseType === 'COMPUTE' ||
    data.expenseType === 'STORAGE' ||
    data.expenseType === 'NETWORK'
  ) {
    state.queryForm.expenseTypeId = data.children[0].id
  } else {
    state.queryForm.expenseTypeId = data.id
  }
  expenseTypeData.value = data

  getDataList()
}
// 编辑费用类型
const editCostType = (data: Tree) => {
  dialogType.value = OperateEventEnum.edit
  showDialog.value = true
  expenseTypeData.value = data
}
// 删除费用类型
const deleteCostType = (node: Node, data: Tree) => {
  ElMessageBox.confirm('确定要删除当前费用类型吗？', '删除费用类型', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteExpenseType({}, { id: data.id }).then((res: any) => {
      let { code } = res
      if (code === 200) {
        queryExpenseTypeGrade()
        ElMessage.success('删除成功')
      }
    })
  })
}
// 新增费用类型
const addCostType = () => {
  dialogType.value = OperateEventEnum.add
  showDialog.value = true
  expenseTypeData.value = {}
}

/**
 * 搜索类型
 * @type {IdealSearch[]}
 */
const typeArray = ref<IdealSearch[]>([
  { label: '计费项名称', prop: 'name', type: FiltrateEnum.input }
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
//  列表搜索值
const searchValue = ref('')
const state: IHooksOptions = reactive({
  dataListUrl: billItems,
  deleteUrl: deleteBillItem,
  queryForm: {
    name: searchValue
  },
  createdIsNeed: false,
  isPage: false
})
const { deleteHandle, getDataList } = useCrud(state)
const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '计费项', prop: 'name' },
  { label: '计费单元', prop: 'preUnit' },
  { label: '标识', prop: 'code' }
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
// 创建计费项
const clickCostItemCreate = () => {
  dialogType.value = 'addChargeItem'
  showDialog.value = true
  billItemData.value = {}
}
// 列表操作
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'edit') {
    dialogType.value = 'editChargeItem'
    showDialog.value = true
    billItemData.value = row
  } else if (command === 'delete') {
    deleteHandle(row.id)
  }
}

/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const expenseTypeData = ref({}) //费用类型行数据
const billItemData = ref({}) //计费项行数据
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  queryExpenseTypeGrade()
}
</script>
<style lang="scss" scoped>
.charge-type-list {
  background-color: white;
  padding: $idealPadding;
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) var(--el-border-style);
  }
  .charge-type-list__tree {
    width: 20%;
    border-right: 1px $gray1-light solid;
    .charge-type-list__tree-title {
      justify-content: flex-start;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px $gray1-light solid;
    }
    .charge-type-list__tree-input {
      padding: 0 10px;
      margin: 10px 0;
    }
  }
  .charge-type-list__table {
    width: 80%;
    padding: 10px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: $defaultFontSize;
    padding-right: 8px;
  }
  // 鼠标移入显示费用类型节点上修改和删除图标
  .show-hide:hover :nth-child(2) {
    display: flex !important;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
