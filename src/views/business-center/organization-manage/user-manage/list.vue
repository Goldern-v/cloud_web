<template>
  <div class="ideal-main-container user-manage">
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
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #username>
        <el-table-column label="登录名">
          <template #default="props">
            <div
              style="cursor: pointer"
              @mouseenter="value => (props.row.showCopy = true)"
              @mouseleave="value => (props.row.showCopy = false)"
            >
              <el-tooltip
                content="禁用的用户不可进行关联等其他操作"
                :disabled="props.row.status !== 0"
                placement="top"
              >
                <el-button
                  link
                  type="primary"
                  :disabled="!props.row.status"
                  class="ideal-default-margin-right"
                  @click="clickDetail(props.row)"
                  >{{ props.row.username }}</el-button
                >
              </el-tooltip>
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
        <el-table-column label="操作" width="120">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
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
      :multiple-selection="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { clickCopy } from '@/utils/tool'
import { IHooksOptions } from '@/hooks/interface'
import DialogBox from './dialog-box.vue'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import {
  getVdcListApi,
  deleteVdcUrl,
  getUserListUrl
} from '@/api/java/business-center'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealSearchResult
} from '@/types'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '登录名', prop: 'username', type: FiltrateEnum.input }
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
  dataListUrl: getUserListUrl,
  deleteUrl: '/sys/user'
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

onMounted(() => {})

// 改造列表数据
watch(
  () => state.dataList,
  value => {
    value?.forEach(item => {
      item.statusText = item.status === 1 ? '启用' : '禁用'
    })
  }
)
watch(
  () => state.dataListSelections,
  arr => {
    if (arr?.length) {
      leftButtons?.value.forEach((item: any, index: number) => {
        if (item.prop === 'enable' && arr.some(ele => ele.status === 1)) {
          item.disabled = true
          item.disabledText = '存在已启用的用户，不可重复操作'
        } else if (
          item.prop === 'forbidden' &&
          arr.some(ele => ele.status === 0)
        ) {
          item.disabled = true
          item.disabledText = '存在已禁用的用户，不可重复操作'
        } else {
          item.disabled = false
          item.disabledText = ''
        }
      })
    } else {
      leftButtons?.value.forEach((item: any, index: number) => {
        item.disabled = index !== 0
        item.disabledText = '请至少选择一个用户'
      })
    }
  }
)

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建用户',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white',
    authority: 'sys:user:add'
  },
  {
    title: '启用用户',
    prop: 'enable',
    disabled: true,
    disabledText: '请至少选择一个用户',
    authority: 'sys:user:start'
  },
  {
    title: '禁用用户',
    prop: 'forbidden',
    disabled: true,
    disabledText: '请至少选择一个用户',
    authority: 'sys:user:stop'
  },
  {
    title: '删除用户',
    prop: 'delete',
    disabled: true,
    disabledText: '请至少选择一个用户',
    authority: 'sys:user:delete'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  } else if (value === 'enable') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.enable
  } else if (value === 'forbidden') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.forbidden
  } else if (value === 'delete') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  }
}
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '登录名', prop: 'username', useSlot: true },
  { label: '用户名称', prop: 'realName' },
  { label: '状态', prop: 'statusText' },
  { label: '手机号', prop: 'mobile' },
  { label: '邮箱', prop: 'email' },
  { label: '所属VDC', prop: 'vdcId' },
  { label: '创建时间', prop: 'createTime' }
]
// 当前行数据
const rowData = ref()
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { type: 'primary', title: '编辑', prop: 'edit' },
  { type: 'primary', title: '修改密码', prop: 'change' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
  rowData.value = row
  if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
  } else if (command === 'change') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.change
  }
}

const router = useRouter()
const clickDetail = (row: any) => {
  const detail = JSON.stringify(row)
  router.push({
    path: '/business-center/organization-manage/user-manage/detail',
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
  getDataList()
}
</script>

<style scoped lang="scss">
.user-manage {
  padding: $idealPadding;
  .user-manage-select {
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
  .user-manage-list {
    width: 100%;
    padding-left: 20px;
    .user-manage__search {
      align-items: center;
      justify-content: space-between;
      .vms-input {
        width: 300px;
      }
    }
  }
}
</style>
