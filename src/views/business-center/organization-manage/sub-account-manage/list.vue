<template>
  <div class="ideal-main-container sub-account">
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
      :total="state.total"
      :page="state.page"
      :pagination-type="PaginationTypeEnum.totalSizes"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #username>
        <el-table-column label="子登录名" width="120">
          <template #default="props">
            <div
              style="cursor: pointer"
              @mouseenter="value => (props.row.showCopy = true)"
              @mouseleave="value => (props.row.showCopy = false)"
            >
              <el-button
                link
                type="primary"
                :disabled="!props.row.status"
                class="ideal-default-margin-right"
                @click="clickDetail(props.row)"
                >{{ props.row.username }}</el-button
              >
              <svg-icon
                v-if="props.row.username && props.row.showCopy"
                icon="copy-icon"
                class-name="copy-svg"
                @click="clickCopy(props.row.username)"
              />
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" fixed="right" width="100">
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
      :selection-data="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { clickCopy } from '@/utils/tool'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import {
  PaginationTypeEnum,
  OperateEventEnum,
  FiltrateEnum
} from '@/utils/enum'
import { getUserListUrl, subAccountDelete } from '@/api/java/business-center'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '子登录名', prop: 'username', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {
    master: '0'
  }

  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

const state: IHooksOptions = reactive({
  dataListUrl: getUserListUrl,
  deleteUrl: subAccountDelete,
  queryForm: {
    master: '0' // 0：子账户；1主账号
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  deleteHandle,
  getDataList
} = useCrud(state)

// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '新建子用户',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  }
}
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
// 当前行数据
const rowData = ref(null)
// 行数据操作
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
  } else if (command === 'delete') {
    deleteHandle(row?.id, '/')
  }
}
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '子登录名', prop: 'username', useSlot: true },
  { label: '子用户名', prop: 'realName' },
  { label: '主用户', prop: 'createName' },
  { label: '用户状态', prop: 'statusText' },
  { label: '手机号', prop: 'mobile' },
  { label: '用户邮箱', prop: 'email' }
]

watch(
  () => state.dataList,
  value => {
    if (value) {
      value.map((item: any) => {
        // 状态处理
        item.statusText = item?.status ? '启用' : '停用'
      })
    }
  }
)
const router = useRouter()
const clickDetail = (row: any) => {
  const detail = JSON.stringify(row)
  router.push({
    path: '/business-center/organization-manage/sub-account-manage/detail',
    query: {
      detail
    }
  })
}
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

</script>

<style scoped lang="scss">
.sub-account {
  padding: $idealPadding;
}
</style>
