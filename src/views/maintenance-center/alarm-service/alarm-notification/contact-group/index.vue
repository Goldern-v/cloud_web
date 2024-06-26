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
      <template #expandTable>
        <el-table-column type="expand">
          <template #default="props">
            <ideal-table-list
              :table-data="props.row.alarmContacts"
              :table-headers="contactTableHeaders"
              :show-pagination="false"
              style="padding-left: 60px"
            >
              <template #operation>
                <el-table-column label="操作" width="185">
                  <template #default="scope">
                    <ideal-table-operate
                      :buttons="contactButtons"
                      @clickMoreEvent="
                        clickContactOperate($event as any, scope.row, props.row)
                      "
                    >
                    </ideal-table-operate>
                  </template>
                </el-table-column>
              </template>
            </ideal-table-list>
          </template>
        </el-table-column>
      </template>

      <template #contactNum>
        <el-table-column label="通知联系人数">
          <template #default="props">
            {{ props.row.alarmContacts.length }}
          </template>
        </el-table-column>
      </template>

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
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    >
    </dialog-box>
  </div>
</template>

<script setup lang="ts">
import { FiltrateEnum, OperateEventEnum } from '@/utils/enum'
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
  alarmContactGroupList,
  alarmContactGroupDelete,
  alarmContactGroupBatchDelete,
  contactPersonUnbindContactGroup
} from '@/api/java/maintenance-center'

/**
 * 搜索类型
 * @type {IdealSearch[]}
 */
const typeArray = ref<IdealSearch[]>([
  { label: '联系组名称', prop: 'name', type: FiltrateEnum.input }
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
    title: '创建联系组',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  {
    title: '批量删除联系组',
    prop: 'batchDelete',
    disabled: true,
    disabledText: '请选择联系人'
  }
]
//列表左侧按钮操作
const clickLeftEvent = (value: string | number | object) => {
  showDialog.value = value !== 'batchDelete'
  if (value === 'create') {
    dialogType.value = 'createContactGroup'
  } else if (value === 'add') {
    dialogType.value = OperateEventEnum.add
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
 * 主列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: alarmContactGroupList,
  deleteUrl: alarmContactGroupDelete,
  queryForm: {}
})
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '通知联系人数', prop: 'contactNum', useSlot: true },
  { label: '创建时间', prop: 'createTime.date' },
  { label: '最近修改时间', prop: 'updateTime.date' }
]

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle,
  deleteBatchHandle
} = useCrud(state)

const operateButtons: IdealTableColumnOperate[] = [
  { title: '添加联系人', prop: 'add' },
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]

const selectIds: any = ref([])
watch(
  () => state.dataListSelections,
  value => {
    attrData.leftButtons.forEach((item: any, index: number) => {
      item.disabled = index !== 0
      item.disabledText = '请选择联系组'
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

//主表格操作
const clickOperateEvent = (command: string | number, row: any) => {
  showDialog.value = command !== 'delete'
  attrData.rowData = row
  if (command === 'edit') {
    dialogType.value = 'editContactGroup'
  } else if (command === 'delete') {
    deleteHandle(row.id, '/', '确认将当前联系组进行删除吗？', '删除')
  } else if (command === 'add') {
    dialogType.value = OperateEventEnum.add
  }
}

/**
 * 扩展表格
 */
const contactTableHeaders: IdealTableColumnHeaders[] = [
  { label: '通知联系人', prop: 'name' },
  { label: '手机号码', prop: 'phone' },
  { label: '邮箱', prop: 'email' }
]

const contactButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]

const clickContactOperate = (
  command: string | number,
  internalRow: any,
  externalRow: any
) => {
  if (command === 'edit') {
    attrData.rowData = internalRow
    dialogType.value = OperateEventEnum.edit
    showDialog.value = true
  } else if (command === 'delete') {
    unbindContact(internalRow, externalRow)
  }
}

//删除告警联系组
const batchDeleteContactGroup = () => {
  ElMessageBox.confirm('确定要删除当前所选告警联系组吗？', '删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const params = {
        ids: toRaw(selectIds.value).join(',')
      }
      alarmContactGroupBatchDelete({ params }).then((res: any) => {
        const { code } = res
        if (code === 200) {
          getDataList()
          ElMessage.success('批量删除联系组成功')
        } else {
          ElMessage.success('批量删除联系组失败')
        }
      })
    })
    .catch(() => {
      ElMessage.info('取消删除联系组')
    })
}
//将联系人从联系组移出
const unbindContact = (internalRow: any, externalRow: any) => {
  ElMessageBox.confirm('确认将当前联系人从该组内删除吗？', '删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const contacts = [
        {
          id: internalRow.id,
          name: internalRow.name
        }
      ]
      const group = {
        id: externalRow.id,
        name: externalRow.name
      }
      const params = { contacts, group }
      contactPersonUnbindContactGroup(params).then((res: any) => {
        const { code } = res
        if (code === 200) {
          getDataList()
          ElMessage.success('移出联系人成功')
        } else {
          ElMessage.success('移出联系人失败')
        }
      })
    })
    .catch(() => {
      ElMessage.info('取消移出联系人')
    })
}

/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  getDataList()
  showDialog.value = false
}
</script>
