<template>
  <div class="resource-spec">
    <ideal-search
      ref="searchRef"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider />

    <div class="flex-row resource-spec__button">
      <el-button type="primary" @click="clickCloudPlatformSync"
        ><svg-icon
          icon="sync-bill"
          color="white"
          class="ideal-svg-margin-right"
        ></svg-icon
        >同步规格</el-button
      >

      <el-button @click="clickRefresh">
        <svg-icon icon="refresh-icon"></svg-icon>
      </el-button>
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :pagination-type="PaginationTypeEnum.totalSizes"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #specsType>
        <el-table-column label="规格类型">
          <template #default="props">
            <div>{{ specTypeDic[props.row.specsType] }}</div>
          </template>
        </el-table-column>
      </template>

      <template #vcpus>
        <el-table-column label="vCPU">
          <template #default="props">
            <div>{{ props.row.vcpus }}核</div>
          </template>
        </el-table-column>
      </template>

      <template #ram>
        <el-table-column label="内存">
          <template #default="props">
            <div>{{ props.row.ram }}GB</div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.status"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <template #createTime>
        <el-table-column label="创建时间">
          <template #default="props">
            <el-tooltip
              effect="dark"
              :content="props.row.createTime.date"
              placement="top-start"
            >
              <div class="resource-spec-create-time">
                {{ props.row.createTime.date }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns(props.row)"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
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
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { specTypeDic } from '@/utils/dictionary'
import store from '@/store'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import { resourceSpecPage, resourceSpecDelete } from '@/api/java/operate-center'
import { resourcePoolGrade } from '@/api/java/public'
import {
  FiltrateEnum,
  PaginationTypeEnum,
  OperateEventEnum
} from '@/utils/enum'

onMounted(() => {
  resourcePool()
})

// 类别
const categoryList = ref<any[]>([])
// 类型
const typeList = ref<any[]>([])
// 资源池
const resourcePoolList = ref<any[]>([])
// 获取资源池列表
const resourcePool = () => {
  const vdcId = store.userStore.user.vdcId
  resourcePoolGrade({ vdcId })
    .then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        categoryList.value = data
        typeArray.value[1].array = data
      } else {
        categoryList.value = []
      }
    })
    .catch(_ => {
      categoryList.value = []
    })
}
// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'flavorName', type: FiltrateEnum.input },
  {
    label: '云平台类别',
    prop: 'cloudPlatformCategory',
    type: FiltrateEnum.list,
    array: [],
    arrayProp: 'name',
    arrayKey: 'cloudCategory'
  }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {
    origin: '2'
  }

  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      state.queryForm[item.prop] = item.value
    })
  } else {
    removeTypeArrayItem('cloudPlatformType')
    removeTypeArrayItem('resourcePoolId')
  }
  getDataList()
}
// 删除搜索组件条件
const removeTypeArrayItem = (type: string) => {
  const index = typeArray.value.findIndex(
    (item: IdealSearch) => item.prop === type
  )
  // 搜索存在云平台类型 删除
  if (index > 0) {
    typeArray.value.splice(index, 1)
  }
}
// 获取搜索组件
const searchRef = ref()
const clickRefresh = () => {
  searchRef.value.clickDeleteAll()
}

// 搜索框输入值
const searchValue = ref('')

const state: IHooksOptions = reactive({
  dataListUrl: resourceSpecPage,
  deleteUrl: resourceSpecDelete,
  queryForm: {
    flavorName: searchValue,
    origin: '2' // 0、直接创建,1、订单创建,2、资源纳管
  },
  primaryKey: 'uuid'
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  deleteHandle,
  getDataList
} = useCrud(state)
// 行数据操作
const operateBtns = computed(() => (row: any) => {
  let disabled = false
  // 2: 同步 0: 创建(同步不能编辑和删除)
  if (row.origin === 2) {
    disabled = true
  }
  const arr: IdealTableColumnOperate[] = [
    {
      title: '编辑',
      prop: 'edit',
      disabled,
      disabledText: '同步上来的资源规格禁止编辑'
    },
    {
      title: '删除',
      prop: 'delete',
      disabled,
      disabledText: '同步上来的资源规格禁止删除'
    }
  ]
  return arr
})
// 当前行数据
const rowData = ref(null)
// 行数据操作
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'delete') {
    deleteHandle(row.id, '/', '确定要删除当前规格吗？', '删除')
  } else if (command === 'edit') {
    rowData.value = row
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
  }
}
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '规格名称', prop: 'name' },
  { label: '架构', prop: 'cpuArchitecture' },
  { label: '规格类型', prop: 'specsType', useSlot: true },
  { label: 'vCPU', prop: 'vcpus', useSlot: true },
  { label: '内存', prop: 'ram', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '云平台类别', prop: 'cloudPlatformCategoryName' },
  { label: '云平台类型', prop: 'cloudPlatformTypeName' },
  { label: '资源池', prop: 'resourcePoolName' },
  { label: '同步时间', prop: 'createTime', useSlot: true }
]
// 状态值字典
const statusDic: { [key: string]: any } = {
  normal: { style: 'status-success', text: '正常' },
  abandon: { style: 'status-error', text: '下线' },
  sellout: { style: 'status-exception', text: '售罄' }
}
watch(
  () => state.dataList,
  value => {
    if (value) {
      value.map((item: any) => {
        // 状态处理
        item.statusIcon = statusDic[item.status].style
        item.status = statusDic[item.status].text
      })
    }
  }
)
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  currentChangeHandle(state.page as number) // 查询当前页数据
}
// 同步账单
const clickCloudPlatformSync = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.sync
}
</script>

<style scoped lang="scss">
.resource-spec {
  width: 100%;
  padding: 20px;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select .el-input) {
    width: 200px;
  }
  .resource-filter {
    width: auto;
    margin-right: 10px;
  }
  .resource-spec__button {
    justify-content: space-between;
    align-items: center;
  }
  .custom-color {
    color: var(--el-color-primary);
  }
  .resource-spec__table-name {
    cursor: pointer;
  }
  .resource-spec-create-time {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
