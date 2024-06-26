<template>
  <div class="cloud-platform-manage">
    <ideal-search
      ref="searchRef"
      :type-array="typeArray"
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      @clickSearch="onClickSearch"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #expandTable>
        <el-table-column type="expand">
          <template #default="props">
            <account-list :auth-account-id="props.row.id"/>
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="150">
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
import accountList from './account-list.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import {
  OperateEventEnum,
  FiltrateEnum
} from '@/utils/enum'
import {
  cloudPlatformAuthListUrl
} from '@/api/java/operate-center'


const route = useRoute()
const cloudPlatformId = route.query.id as string
const cloudCategory = route.query.cloudCategory as string

onMounted(() => {
  initTableHeader()
})
const initTableHeader = () => {
  if (RegExp(/PUBLIC/).test(cloudCategory)) {
    tableHeaders.value = [
      { label: '授权账号名称', prop: 'name' },
      { label: 'accesskey', prop: 'ak' },
      { label: 'sk', prop: 'sk' },
      { label: '类型', prop: 'typeText' },
      { label: '创建时间', prop: 'createTime.date' }
    ]
  } else {
    tableHeaders.value = [
      { label: '授权账号名称', prop: 'name' },
      { label: '账号', prop: 'account' },
      { label: '类型', prop: 'typeText' },
      { label: '创建时间', prop: 'createTime.date' }
    ]
  }
}
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

// 获取搜索组件
const searchRef = ref()

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: cloudPlatformAuthListUrl,
  deleteUrl: cloudPlatformAuthListUrl,
  isPage: false,
  queryForm: {
    cloudPlatformId
  }
})

const {
  deleteHandle,
  getDataList
} = useCrud(state)
watch(
  () => state.dataList,
  value => {
    if (value) {
      value.map((item: any) => {
        item.typeText = item?.type === 'NORMAL' ? '普通的授权账户' : '必须存在的授权账户'
      })
    }
  }
)
// 列表表头
const tableHeaders = ref<IdealTableColumnHeaders[]>([])
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '新增',
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

const operateBtns = ref<IdealTableColumnOperate[]>([
  { title: '绑定云管用户', prop: 'bind' },
  { title: '删除', prop: 'delete' }
])
const rowData = ref()
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'delete') {
    deleteHandle(row.id, '/')
  } else if (command === 'bind') {
    rowData.value = row
    showDialog.value = true
    dialogType.value = OperateEventEnum.bind
  }
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()

const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}


</script>

<style scoped lang="scss">
.cloud-platform-manage {
  padding: $idealPadding;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
  :deep(.el-button) {
    height: 34px;
  }
  :deep(.el-select .el-input) {
    width: 200px;
    height: 34px;
  }
  .cloud-platform-manage__button {
    justify-content: space-between;
    align-items: center;
  }
  .custom-select {
    width: 200px;
  }
  .custom-color {
    color: var(--el-color-primary);
  }
  .cloud-platform-manage__table-name {
    cursor: pointer;
  }
}
</style>
