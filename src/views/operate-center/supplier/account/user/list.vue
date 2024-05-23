<template>
  <div class="ideal-main-container user-manage">
    <ideal-search
      ref="searchRef"
      input-placeholder="默认按照供应商名称搜索"
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
      ref="tableRef"
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
        <el-table-column label="供应商名称">
          <template #default="props">
            <div
              style="cursor: pointer"
              @mouseenter="value => (props.row.showCopy = true)"
              @mouseleave="value => (props.row.showCopy = false)"
            >
              <el-text type="primary" class="ideal-default-margin-right">{{ props.row.username }}</el-text>
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

      <template #bindRole>
        <el-table-column label="绑定角色">
          <template #default="props">
            <div v-for="(item, index) of props.row.sysRoleList" :key="index">{{ item.name }}</div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" fixed="right" width="210">
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
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { clickCopy } from '@/utils/tool'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import {
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
  { label: '供应商名称', prop: 'username', type: FiltrateEnum.input }
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
      item.operate = newOperate(item)
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
    title: '创建供应商',
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
  { label: '供应商名称', prop: 'username', useSlot: true },
  { label: '供应商编码', prop: 'code' },
  { label: '用户账号', prop: 'realName' },
  { label: '用户状态', prop: 'statusText' },
  { label: '手机号', prop: 'mobile' },
  { label: '用户邮箱', prop: 'email' },
  { label: '绑定角色', prop: 'bindRole', useSlot: true }
]
// 当前行数据
const rowData = ref()
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { type: 'primary', title: '编辑', prop: 'edit' },
  { type: 'primary', title: '绑定解绑角色', prop: 'bind-role' },
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
  } else if (command === 'bind-role') {
    showDialog.value = true
    dialogType.value = 'bind-role'
  }
}
const newOperate = (item: any) => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateBtns))
  if (!item.status) {
    const tip = `禁用不可操作`
    resultArr = setOperateBtns(true, tip, tempArr)
  } else {
    resultArr = setOperateBtns(false, '', tempArr)
  }
  return resultArr
}
// 根据状态设置操作禁用状态
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
const tableRef = ref()
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  tableRef.value.IdealTableList.clearSelection()
  showDialog.value = false
  getDataList()
}
</script>

<style scoped lang="scss">
.user-manage {
  padding: $idealPadding;
}
</style>
