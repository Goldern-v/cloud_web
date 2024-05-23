<template>
  <div class="ideal-main-container vdc-manage">
    <div class="vdc-manage-select">
      <div class="vms-title">
        <div class="vms-title-line"></div>
        <div class="vms-title-txt">VDC管理</div>
      </div>
      <el-input
        v-model="filterText"
        placeholder="请输入内容"
        class="vdc__tree-input"
      >
        <template #suffix>
          <svg-icon icon="search-icon"></svg-icon>
        </template>
      </el-input>
      <el-tree
        ref="treeRef"
        :data="vdcTree"
        :props="defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      />
    </div>
    <div class="vdc-manage-list">
      <ideal-search
        ref="searchRef"
        :type-array="typeArray"
        :show-category="false"
        :show-platform-type="false"
        :show-resource-pool="false"
        @clickSearch="onClickSearch"
      />

      <el-divider border-style="solid" />

      <ideal-button-events
        :left-btns="leftButtons"
        @clickLeftEvent="clickLeftEvent"
      />
      
      <ideal-table-list
        ref="vdcTable"
        :loading="state.dataListLoading"
        :table-data="state.dataList"
        :table-headers="tableHeaders"
        :total="state.total"
        :page="state.page"
        @clickSizeChange="sizeChangeHandle"
        @clickCurrentChange="currentChangeHandle"
        @handleSelectionChange="selectionChangeHandle"
      >
        <template #name>
          <el-table-column label="名称">
            <template #default="props">
              <el-button link type="primary" @click="clickDetail(props.row)">{{
                props.row.name
              }}</el-button>
            </template>
          </el-table-column>
        </template>
        <template #operation>
          <el-table-column label="操作" width="120">
            <template #default="props">
              <div class="ideal-table-flex">
                <el-button link type="primary" @click="clickEdit(props.row)"
                  >编辑</el-button
                >
                <span class="ideal-vertical-line">丨</span>
                <el-button link type="primary" @click="clickDelete(props.row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

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
import { ElMessage } from 'element-plus/es'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import DialogBox from './dialog-box.vue'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import { getVdcListApi, deleteVdcUrl } from '@/api/java/business-center'
import { vdcTreeList } from '@/api/java/public'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealSearchResult,
  IdealButtonEventProp
} from '@/types'
import { ElTree } from 'element-plus'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: 'VDC名称', prop: 'name', type: FiltrateEnum.input }
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
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: getVdcListApi,
  deleteUrl: deleteVdcUrl
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)

onMounted(() => {
  getVdcTree()
})

// 改造列表数据
watch(
  () => state.dataList,
  value => {
    value?.forEach(item => {
      item.createTimeText = item.createTime.date || '--'
      item.parentNameText = item.parent.name || '--'
      item.createName = item.creator.name || '--'
    })
  }
)
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建VDC',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  }
}

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '', prop: 'name', useSlot: true },
  { label: '上级VDC', prop: 'parentNameText' },
  { label: '描述', prop: 'remark' },
  { label: '创建者', prop: 'createName' },
  { label: '创建时间', prop: 'createTimeText' }
]

interface Tree {
  [key: string]: any
}
const treeRef = ref<InstanceType<typeof ElTree>>() // vdc类型树
// vdc搜索
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
// vdc树
const vdcTree: Ref<Tree[]> = ref([])
// 获取vdc树
const getVdcTree = async () => {
  try {
    const res: any = await vdcTreeList()
    const { code, data } = res
    if (code === 200) {
      vdcTree.value = data.sons
    } else {
      vdcTree.value = []
    }
  } catch (err: any) {
    ElMessage.error(err)
  }
}
// vdc树选择
const handleNodeClick = (data: any) => {
  state.queryForm.code = data.code
  getDataList()
}
const defaultProps = {
  children: 'sons',
  label: 'name'
}

const router = useRouter()
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
  getVdcTree()
}
// 创建
const handleCreate = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.create
}
// 当前行数据
const rowData = ref()
const clickEdit = (row: object) => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.edit
  rowData.value = row
}
const clickDelete = (row: object | any) => {
  deleteHandle(
    row.id,
    '/',
    '删除当前VDC同时会同时删除绑定的资源池、云资源、命名后缀等，将用户从当前VDC移除。确定要删除吗？',
    '删除VDC'
  )
}
const clickDetail = (row: any) => {
  rowData.value = row
  router.push({
    path: '/business-center/organization-manage/vdc-manage/detail',
    query: { id: row.id, code: row.code }
  })
}
watch(
  () => state.dataList,
  (newval, oldVal) => {
    if (newval !== oldVal) {
      getVdcTree()
    }
  }
)
</script>

<style scoped lang="scss">
.vdc-manage {
  padding: $idealPadding;
  display: flex;
  .vdc-manage-select {
    border-right: 1px solid #ddd;
    width: 284px;
    margin: -20px 0 -20px -20px;

    .vms-title {
      height: 42px;
      line-height: 42px;
      border-bottom: 1px solid #ddd;
      display: flex;
      align-items: center;

      .vms-title-line {
        margin: 0 8px 0 15px;
        height: 12px;
        border: 2px solid var(--el-color-primary);
        border-radius: 100px;
      }
      .vms-title-txt {
        font-weight: 500;
        font-size: 14px;
      }
    }
  }
  .vdc-manage-list {
    width: 100%;
    padding-left: 20px;
    .vdc-manage__search {
      align-items: center;
      justify-content: space-between;
      .vms-input {
        width: 300px;
      }
    }
  }
  .vdc__tree-input {
    padding: 0 10px;
    margin: 10px 0;
  }
}
</style>
