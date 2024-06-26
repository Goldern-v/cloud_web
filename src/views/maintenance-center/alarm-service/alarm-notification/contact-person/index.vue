<template>
  <div>
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
      :left-btns="attrData.leftButtons"
      :right-btns="attrData.rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      is-multiple
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateButtons"
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
      :row-data="attrData.rowData"
      :multi-contact-person="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    >
    </dialog-box>
  </div>
</template>

<script setup lang="ts">
import { SearchTypeEnum, OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage, ElMessageBox } from 'element-plus/es'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
} from '@/types'
import dialogBox from '../dialog-box.vue'
import {
  alarmContactPersonList,
  alarmContactPersonDelete,
  alarmContactPersonBatchDelete
} from '@/api/java/maintenance-center'

/**
 * 搜索类型
 * @type {IdealSearch[]}
 */
const typeArray = ref<IdealSearch[]>([
  { label: '联系人名称', prop: 'name', type: FiltrateEnum.input },
  { label: '手机号', prop: 'phone', type: FiltrateEnum.input },
  { label: '邮箱', prop: 'email', type: FiltrateEnum.input }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      state.queryForm[item.prop] = temp[1]
    })
  }
  getDataList()
}

const attrData = reactive({
  leftButtons: [] as IdealButtonEventProp[],
  rightButtons: [] as IdealButtonEventProp[],
  rowData: {}
})

attrData.leftButtons = [
  {
    title: '创建联系人',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  {
    title: '添加到联系组',
    prop: 'add',
    disabled: true,
    disabledText: '请选择联系人'
  },
  {
    title: '批量删除联系人',
    prop: 'batchDelete',
    disabled: true,
    disabledText: '请选择联系人'
  }
]

const clickLeftEvent = (value: string | number | object) => {
  showDialog.value = value !== 'batchDelete'
  if (value === 'create') {
    dialogType.value = OperateEventEnum.create
  } else if (value === 'add') {
    dialogType.value = 'addToContactGroup'
  } else if (value === 'batchDelete') {
    batchDeleteContactGroup()
  }
}

// 列表右侧按钮
attrData.rightButtons = [{ prop: 'refresh', icon: 'refresh-icon' }]
const searchRef = ref()
const clickRightEvent = (value: string | number | object) => {
  if (value === 'refresh') {
    searchRef.value.clickDeleteAll()
  }
}

/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: alarmContactPersonList,
  deleteUrl: alarmContactPersonDelete,
  queryForm: {}
})
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '手机号码', prop: 'phone' },
  { label: '邮箱', prop: 'email' },
  { label: '企业微信', prop: 'wecom' },
  { label: '钉钉', prop: 'dingtalk' },
  { label: '所属联系组', prop: 'contactGroup' }
]

watch(
  () => state.dataList,
  value => {
    value?.forEach((item: any) => {
      const arr: any = []
      item.groups.forEach((ele: any) => {
        arr.push(ele.name)
      })
      item.contactGroup = arr?.join(' , ')
    })
  }
)
const selectIds: any = ref([])

watch(
  () => state.dataListSelections,
  value => {
    attrData.leftButtons.forEach((item: any, index: number) => {
      item.disabled = index !== 0
      item.disabledText = '请选择联系人'
    })
    if (value?.length) {
      attrData.leftButtons.forEach((item: any) => {
        item.disabled = false
        item.disabledText = ''
      })
      selectIds.value = []
      value.forEach((item: any) => {
        selectIds.value.push(item.id)
      })
    }
  }
)

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)

const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]

// 操作
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'edit') {
    attrData.rowData = row
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
  } else if (command === 'delete') {
    deleteHandle(row.id, '/', '确认将选中联系人进行删除吗？', '删除')
  }
}

const batchDeleteContactGroup = () => {
  ElMessageBox.confirm('确定要删除当前所选联系人吗？', '删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const params = {
        ids: toRaw(selectIds.value).join(',')
      }
      alarmContactPersonBatchDelete({ params }).then((res: any) => {
        const { code } = res
        if (code === 200) {
          getDataList()
          ElMessage.success('批量删除联系人成功')
        } else {
          ElMessage.success('批量删除联系人失败')
        }
      })
    })
    .catch(() => {
      ElMessage.info('取消删除联系人')
    })
}
/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  getDataList()
  showDialog.value = false
}
</script>
