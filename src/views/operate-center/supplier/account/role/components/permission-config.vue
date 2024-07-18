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
        @clickSizeChange="sizeChangeHandle"
        @clickCurrentChange="currentChangeHandle"
      >
        <template #select>
          <el-table-column width="50" align="center">
            <template #header>
              <el-checkbox v-model="checkAll" @change="selectAll"></el-checkbox
            ></template>
            <template #default="props">
              <el-tooltip
                :disabled="!props.row.disabled"
                :content="props.row.disabledText"
                placement="top"
              >
                <el-checkbox
                  v-model="props.row.checked"
                  :disabled="props.row.disabled"
                  @change="selectRow(props.row)"
                ></el-checkbox>
              </el-tooltip>
            </template>
          </el-table-column>
        </template>
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
  queryRoleLimits,
  queryRoleConfigTemplate,
  createRole
} from '@/api/java/business-center'

onMounted(() => {
  queryMenuCatalog()
  getRoleLimits()
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
    platformType: '1'
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
const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(state)

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

const router = useRouter()
const clickLeftEvent = (command: string | number | object) => {
  if (command === 'accredit') {
    submit()
  }
}
const clickBack = () => {
  router.push({ path: '/operate-center/supplier/account/role/list' })
}

/**
 * 权限处理
 */
//判断该操作权限是否已存在
const limitExitOrNot = (role: any, limits: any[]) => {
  return limits.some((ele: any) => ele === role.id)
}
//记录操作权限id
const recordPermission = (item: any) => {
  if (!item.checked) {
    if (item.type === 0) {
      roleState.menuList = roleState.menuList.filter(
        (ele: any) => ele !== item.id
      )
    } else {
      roleState.buttonList = roleState.buttonList.filter(
        (ele: any) => ele !== item.id
      )
    }
  } else {
    if (item.type === 1 && !limitExitOrNot(item, roleState.buttonList)) {
      roleState.buttonList.push(item.id)
    } else if (item.type === 0 && !limitExitOrNot(item, roleState.menuList)) {
      roleState.menuList.push(item.id)
    }
  }
}

//勾选所有
const selectAll = (val: boolean) => {
  state.dataList?.forEach((item: any) => {
    item.checked = val
    recordPermission(item)
  })
  handleDisabled(state.dataList as any[])
}
//勾选整行
const selectRow = (val: any) => {
  //未勾选菜单权限时不可存在按钮权限
  if (val.type === 0 && !val.checked) {
    state.dataList?.forEach(ele => {
      ele.checked = false
    })
  }
  recordPermission(val)
  handleDisabled(state.dataList as any[])
}
//判断是否全选
const checkAll = computed(() => {
  return state.dataList?.every((item: any) => item.checked)
})

//判断按钮禁用
const handleDisabled = (array: any[]) => {
  array.forEach((item: any) => {
    if (item.type === 1 && !checkMenu.value) {
      item.disabled = true
      item.disabledText = '未授权页面权限'
    } else {
      item.disabled = false
      item.disabledText = 'false'
    }
  })
  return array
}

//回显已存在的权限
const handleChecked = (limit: any, array: any[]) => {
  const role = [...limit.buttonList, ...limit.menuList]
  array?.forEach((item: any) => {
    item.checked = limitExitOrNot(item, role)
  })
  return array
}

const id = route.query.id as string
const emit = defineEmits(['updateInfo'])

const roleState = reactive({
  buttonList: [] as any[], //用来记录右侧表格的操作权限id
  menuList: [] as any[] //用来记录菜单权限
})

// const
//查询角色已绑定权限
const getRoleLimits = () => {
  queryRoleLimits({ roleId: id })
    .then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        roleState.buttonList = data.buttonIdList
        roleState.menuList = data.menuIdList
        state.dataList = handleChecked(roleState, state.dataList as any[])
        handleDisabled(state.dataList as any[])
        emit('updateInfo', data)
      } else {
        roleState.buttonList = []
        roleState.menuList = []
      }
    })
    .catch(_ => {
      roleState.buttonList = []
      roleState.menuList = []
    })
}

const includeMenuData: any = ref([])
//判断菜单权限是否存在
const checkMenu = computed(() => {
  return includeMenuData.value?.some(
    (ele: any) => ele.type === 0 && ele.checked
  )
})
//初始化时将角色的权限id勾选上
watch(
  () => state.dataList,
  data => {
    //找到包含菜单权限的数据用来判断是否禁选按钮权限(type =0 为菜单权限，type=1为按钮权限)
    if (data?.some(item => item.type === 0)) {
      includeMenuData.value = data
    }
    data?.forEach((item: any) => {
      if (state.page !== 1 && !checkMenu.value) {
        item.checked = false
        roleState.buttonList = roleState.buttonList.filter(ele =>
          data.some((it: any) => it.id === ele.id)
        )
      } else {
        item.checked = limitExitOrNot(item, [
          ...roleState.menuList,
          ...roleState.buttonList
        ])
      }
    })
    handleDisabled(data as any[])
  }
)

const submit = () => {
  const buttonIdList = roleState.buttonList
  const menuIdList = roleState.menuList
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
