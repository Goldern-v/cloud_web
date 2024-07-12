<template>
  <div class="ideal-main-container resource-pool-manage">
    <ideal-search
      ref="searchRef"
      :type-array="typeArray"
      :show-resource-pool="false"
      platform-type-label="资源池类型"
      @clickSearch="onClickSearch"
    />

    <el-divider />

    <div class="flex-row resource-pool-manage__button">
      <el-button
        v-auth="'suppler:pool:create'"
        type="primary"
        @click="clickResourcePoolCreate"
      >
        <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
        创建资源池
      </el-button>

      <el-button @click="clickReset">
        <svg-icon icon="refresh-icon"></svg-icon>
      </el-button>
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
      :pagination-type="PaginationTypeEnum.totalSizes"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #name>
        <el-table-column label="资源池名称" show-overflow-tooltip>
          <template #default="props">
            <div
              class="custom-color resource-pool-manage__table-name"
              @click="clickDetail(props.row)"
            >
              {{ props.row.name }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="125">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
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
import { existPropWithArray } from '@/utils/tool'
import { RESOURCE_STATUS_ICON, RESOURCE_STATUS } from '@/utils/dictionary'
import {
  resourcePoolList,
  resourcePoolDeleteUrl
} from '@/api/java/operate-center'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import { FiltrateEnum, PaginationTypeEnum } from '@/utils/enum'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input }
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

const state: IHooksOptions = reactive({
  dataListUrl: resourcePoolList,
  deleteUrl: resourcePoolDeleteUrl,
  queryForm: {}
})

const { sizeChangeHandle, currentChangeHandle, deleteHandle, getDataList } =
  useCrud(state)
watch(
  () => state.dataList,
  value => {
    if (value) {
      value.forEach((item: any) => {
        item.statusIcon = RESOURCE_STATUS_ICON[item?.status.toUpperCase()]
        item.statusText = RESOURCE_STATUS[item?.status.toUpperCase()]
        item.readOnly = item.cloudPlatform?.mode ? '只读' : '读写'
        item.operate = newOperate(item)
      })
      loopUpdateStatus()
    }
  }
)
// 轮询
const loopUpdateStatus = () => {
  if (!state.dataList?.length) {
    return
  }
  let timer: number | undefined
  const existLoading = existPropWithArray(
    'loading',
    state?.dataList,
    'statusIcon'
  ) // 操作正在进行中

  if (existLoading) {
    timer = setTimeout(() => {
      getDataList()
    }, 5000)
  } else {
    if (timer) {
      clearTimeout(timer)
    }
  }
}

const operateBtns = ref<IdealTableColumnOperate[]>([
  { type: '', title: '编辑', prop: 'edit', authority: 'supplier:pool:edit' },
  { type: '', title: '删除', prop: 'delete', authority: 'supplier:pool:delete' }
])
// 根据每行数据状态判断操作是否禁用
const newOperate = (item: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateBtns.value))

  if (item.statusIcon === 'loading') {
    const tip = `${RESOURCE_STATUS[item.status]}不可操作`
    resultArr = setOperateBtns(true, tip, tempArr)
  } else {
    resultArr = setOperateBtns(false, '', tempArr)
  }
  return resultArr
}
const setOperateBtns = (
  disabled: boolean,
  disabledText: string,
  array: IdealTableColumnOperate[]
): IdealTableColumnOperate[] => {
  const arr: IdealTableColumnOperate[] = []
  array.forEach((item: any) => {
    if (!item.children) {
      item.disabled = disabled
      item.disabledText = disabledText
    }
    arr.push(item)
  })
  return arr
}
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '资源池名称', prop: 'name', useSlot: true },
  { label: '资源池类型', prop: 'cloudTypeName' },
  { label: '云平台类别', prop: 'cloudCategoryName' },
  { label: '云平台入口', prop: 'cloudPlatform.name' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '备注', prop: 'remark' },
  { label: '创建者', prop: 'creator.name' },
  { label: '创建时间', prop: 'createTime.date' }
]

const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'edit') {
    router.push({
      path: '/operate-center/supplier/pool/create',
      query: {
        id: row.id,
        cloudCategory: row.cloudCategory,
        cloudType: row.cloudType,
        type: 'edit'
      }
    })
  } else if (command === 'delete') {
    deleteHandle(row.id, '/')
  }
}

// 获取搜索组件
const searchRef = ref()
// 重置
const clickReset = () => {
  searchRef.value.clickDeleteAll()
}

const router = useRouter()
// 创建云平台
const clickResourcePoolCreate = () => {
  router.push({
    path: '/operate-center/supplier/pool/create',
    query: {
      type: 'create'
    }
  })
}
// 详情
const clickDetail = (rowData: any) => {
  router.push({
    path: '/operate-center/supplier/pool/detail',
    query: {
      vdcId: rowData?.vdcId,
      id: rowData?.id,
      name: rowData?.name,
      cloudPlatformId: rowData?.cloudPlatform?.id,
      cloudPlatformVendorCode: rowData?.cloudPlatformVendorCode,
      cloudCategory: rowData?.cloudCategory,
      cloudType: rowData?.cloudType,
      type: 'detail'
    }
  })
}
</script>

<style scoped lang="scss">
.resource-pool-manage {
  padding: $idealPadding;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select .el-input) {
    width: 200px;
  }
  .resource-pool-manage__button {
    justify-content: space-between;
    align-items: center;
  }
  .custom-color {
    color: var(--el-color-primary);
  }
  .resource-pool-manage__table-name {
    cursor: pointer;
  }
}
</style>
