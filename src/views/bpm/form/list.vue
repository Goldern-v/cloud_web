<template>
  <div class="ideal-main-container bpm-form-list">
    <div class="bpm-form-list-search">
      <ideal-select-search
        :search-type="SearchTypeEnum.title"
        :slot-array="slotArray"
        prefix-title="表单名"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
      </ideal-select-search>
    </div>

    <el-divider />

    <ideal-button-events
      :right-btns="rightButtons"
      @clickRightEvent="clickFormCreate"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :pagination-type="PaginationTypeEnum.totalSizes"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #name>
        <el-table-column label="表单ID" align="center">
          <template #default="props">
            {{ props.row.id }}
          </template>
        </el-table-column>
      </template>

      <template #formName>
        <el-table-column label="表单名" align="center">
          <template #default="props">
            {{ props.row.name }}
          </template>
        </el-table-column>
      </template>

      <template #statusText>
        <el-table-column label="状态" align="center">
          <template #default="props">
            <div>
              <el-tag v-if="props.row.status === 0">开启</el-tag>
              <el-tag v-else class="ml-2" type="info">关闭</el-tag>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #createDate>
        <el-table-column label="创建时间" align="center">
          <template #default="props">
            <div>
              {{ dateFormat(props.row.createTime, FormatsEnums.YMDHIS) }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185" align="center">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event as any, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-detail
      v-if="showDialog"
      :type="dialogType"
      :row-data="currentRow"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-detail>
  </div>
</template>

<script setup lang="ts">
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'
import { IHooksOptions } from '@/hooks/interface'
import dialogDetail from './dialog-detail.vue'
import { useCrud } from '@/hooks'
import { dateFormat, FormatsEnums } from '@/utils/time-format'
import { FormList } from '@/types/bpm-form'
import {
  SearchTypeEnum,
  PaginationTypeEnum,
  OperateEventEnum
} from '@/utils/enum'
import { bpmFormListUrl, bpmFormDeleteUrl } from '@/api/java/bpm/form'

const router = useRouter()
const searchValue = ref('') // 搜索值
const state: IHooksOptions = reactive({
  dataListUrl: bpmFormListUrl,
  deleteUrl: bpmFormDeleteUrl,
  queryForm: {
    name: searchValue
  }
})
// 列表查询
const { sizeChangeHandle, currentChangeHandle, deleteHandle, getDataList } =
  useCrud(state)

// 搜索 表单
const clickSearch = (search: string, type: string) => {
  searchValue.value = search
  getDataList()
}

// 重置
const clickReset = () => {
  searchValue.value = ''
  getDataList()
}
// 搜索插槽
const slotArray = ['categoryType', 'platformType']

const operateBtns: IdealTableColumnOperate[] = [
  { type: '', title: '编辑', prop: 'edit' },
  { type: '', title: '详情', prop: 'detail' },
  { type: '', title: '删除', prop: 'delete' }
]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '表单名称', prop: 'formName', useSlot: true },
  { label: '状态', prop: 'statusText', useSlot: true },
  { label: '备注', prop: 'remark' },
  { label: '创建时间', prop: 'createDate', useSlot: true }
]

// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'add',
    title: '新增',
    type: 'primary',
    icon: 'circle-add'
  }
]

let currentRow = ref({})
/**
 * 列表操作
 * @param command 操作类型 detail-详情 delete-删除 edit-编辑
 * @param row 当前行数据
 */
const clickOperateEvent = (command: string | number, row: FormList) => {
  switch (command) {
    case 'detail':
      showDialog.value = true
      currentRow.value = row
      break
    case 'delete':
      deleteHandle(row.id, '?id=')
      break
    case 'edit':
      router.push({
        path: '/bpm-manage/form/create',
        query: { id: row.id, type: 'edit' }
      })
      break
    default:
      break
  }
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
// 关闭详情弹层
const clickCloseEvent = () => {
  showDialog.value = false
}
// 重置搜索
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
// 创建表单
const clickFormCreate = () => {
  router.push({
    path: '/bpm-manage/form/create',
    query: { type: 'create' }
  })
}
onMounted(() => {})
</script>

<style scoped lang="scss">
.bpm-form-list {
  padding: $idealPadding;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select .el-input) {
    width: 200px;
    height: 34px;
  }

  .bpm-form-list-search {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .custom-margin-right {
    margin-right: 10px;
  }
  .bpm-form-list__button {
    justify-content: space-between;
    align-items: center;
  }
  .custom-select {
    width: 210px;
  }
  .custom-color {
    color: var(--el-color-primary);
  }
  .bpm-form-list__table-name {
    cursor: pointer;
  }
}
</style>
