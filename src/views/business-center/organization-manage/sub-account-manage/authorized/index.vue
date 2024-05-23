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
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <!-- <template #expandTable>
        <el-table-column type="expand">
          <template #default="props">
            <account-list :auth-account-id="props.row.id"/>
          </template>
        </el-table-column>
      </template> -->
      <!-- <template #operation>
        <el-table-column label="操作" width="150">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event as any, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template> -->
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
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
  subAccountRoleList,
  subAccountDelete
} from '@/api/java/business-center'

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

const route = useRoute()
const detailInfo = JSON.parse(route.query.detail as any)

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: `${subAccountDelete}/${detailInfo.id}/auth`,
  isPage: false,
  queryForm: {}
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
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '授权账号名称', prop: 'name' },
  { label: 'accesskey', prop: 'ak' },
  { label: 'sk', prop: 'sk' },
  { label: '类型', prop: 'typeText' },
  { label: '云平台', prop: 'cloudPlatformName' },
  { label: '创建时间', prop: 'createTime.date' }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '授权',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
])

const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'authorized-auth'
  }
}
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'refresh',
    icon: 'refresh-icon'
  }
]
const searchRef = ref()
const clickRightEvent = (value: string | number | object) => {
  if (value === 'refresh') {
    searchRef.value.clickDeleteAll()
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
const dialogType = ref<OperateEventEnum | string>()

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
