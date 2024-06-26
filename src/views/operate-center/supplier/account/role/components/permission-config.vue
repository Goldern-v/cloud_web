<template>
  <div class="role-permission-config flex-row">
    <div class="role-permission-config__tree">
      <el-input
        v-model="filterText"
        placeholder="请输入内容"
        class="role-permission-config__tree-input"
      >
        <template #suffix>
          <svg-icon icon="search-icon"></svg-icon>
        </template>
      </el-input>

      <el-tree
        ref="treeRef"
        class="ideal-default-margin-top role-permission-config__tree-content"
        :data="dataSource"
        :props="defaultProps"
        default-expand-all
        node-key="id"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      >
      </el-tree>
    </div>

    <div class="role-permission-config__table">
      <ideal-button-events
        :left-btns="leftButtons"
        @clickLeftEvent="clickLeftEvent"
      >
      </ideal-button-events>

      <ideal-table-list
        ref="multipleTableRef"
        :loading="state.dataListLoading"
        :table-data="state.dataList"
        :table-headers="tableHeaders"
        :total="state.total"
        :page="state.page"
        is-multiple
        @clickSizeChange="sizeChangeHandle"
        @clickCurrentChange="currentChangeHandle"
        @handleSelectionChange="selectionChangeHandle"
      >
      </ideal-table-list>

      <div class="flex-row role-permission-config__back">
        <el-button @click="clickBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus/es'
import { ElTree } from 'element-plus'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { showLoading, hideLoading } from '@/utils/tool'
import type { IdealTableColumnHeaders, IdealButtonEventProp } from '@/types'
import { useAllMenuNavApi } from '@/api/sys/menu'
import {
  queryRoleConfigTemplate,
  createRole
} from '@/api/java/business-center'

onMounted(() => {
  queryMenuCatalog()
})

/**
 * 菜单目录
 */
interface Tree {
  [key: string]: any
}
const menuInfo: any = ref({}) //当前节点所在的菜单信息
const dataSource = ref<Tree[]>([])
//查询菜单目录
const queryMenuCatalog = async () => {
  const params = {
    type: 0,
    platformType: '1',
  }
  const { data } = await useAllMenuNavApi(params)
  dataSource.value = data.filter((item: any) => item.children?.length > 0)

  //默认赋值第一个菜单的最后一级菜单信息
  menuInfo.value = findLastLayer(dataSource.value)
  state.queryForm.id = menuInfo.value.id
  getDataList()
}
//找到层级数组的第一层的最后一级
const findLastLayer = (arr: any[]) => {
  if (!Array.isArray(arr)) {
    return arr
  }
  let result: any = []
  if (arr[0]?.children.length > 0) {
    result = findLastLayer(arr[0]?.children)
  } else {
    result = arr[0]
  }
  return result
}
const treeRef = ref() // 菜单目录树
// 配置选项
const defaultProps = {
  children: 'children',
  label: 'name'
  // value: 'id'
}
// 菜单目录树搜索
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

// 点击菜单目录节点
const handleNodeClick = (data: Tree) => {
  state.queryForm.id = data.id
  menuInfo.value = data
  getDataList()
}

//获取左侧树形结构选中节点

const route = useRoute()
const roleId = route.query.id as string
/**
 * 列表
 */
//  列表搜索值
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '', prop: 'select', useSlot: true },
  { label: '权限名称', prop: 'name' },
  { label: 'CODE', prop: 'authority' },
  { label: '描述', prop: 'remark' }
]

const state: IHooksOptions = reactive({
  dataListUrl: queryRoleConfigTemplate,
  queryForm: {
    roleId
  },
  createdIsNeed: false
})
const { getDataList, sizeChangeHandle, currentChangeHandle, selectionChangeHandle } = useCrud(state)

/**
 * 列表上方左侧按钮
 */
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '授权',
    prop: 'accredit',
    type: 'primary',
    authority: 'sys:role:authorization'
  }
])

const multipleTableRef = ref()
//初始化时将角色的权限id勾选上
watch(
  () => state.dataList,
  data => {
    data?.forEach((item: any) => {
      multipleTableRef.value.IdealTableList.toggleRowSelection(item, item.bindOrNot)
    })
  }
)

const router = useRouter()
const clickLeftEvent = (command: string | number | object) => {
  if (command === 'accredit') {
    submit()
  }
}
const clickBack = () => {
  router.push({ path: '/operate-center/supplier/account/role/list' })
}
const submit = () => {
  const buttonIdList: any[] = []
  const menuIdList: any[] = []
  state.dataListSelections?.forEach((item: any) => {
    // 0 菜单 1接口
    if (item.type === 0) {
      menuIdList.push(item.id)
    } else if (item.type === 1) {
      buttonIdList.push(item.id)
    }
  })
  const params = {
    id: roleId,
    type: false,
    dataScope: '1',
    menuIdList,
    buttonIdList
  }
  showLoading('授权中...')
  createRole(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        ElMessage.success('授权成功')
        router.back()
      } else {
        ElMessage.success('授权失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>
<style lang="scss" scoped>
.role-permission-config {
  width: 100%;
  padding: $idealPadding;
  box-sizing: border-box;
  background-color: white;

  .role-permission-config__tree {
    width: 20%;
    border-right: 1px $gray1-light solid;

    .role-permission-config__tree-input {
      padding-right: 20px;
    }
    .role-permission-config__tree-content {
      overflow: auto;
      max-height: 500px;
    }
  }

  .role-permission-config__table {
    width: 80%;
    padding: 0 $idealPadding;
    .role-permission-config__back {
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
}
</style>
