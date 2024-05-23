<template>
  <div class="ideal-main-container alarm-rule">
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
      ref="tableListRef"
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
            <div class="expandTable">
              <ideal-table-list
                :table-data="props.row.historyConfigs"
                :table-headers="expandTableHeaders"
                :show-pagination="false"
                :merge-data="props.row.mergeData"
                :merge-column="[0]"
                show-border
              >
              </ideal-table-list>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #name>
        <el-table-column label="名称">
          <template #default="props">
            <div class="ideal-theme-text" @click="toDetail(props.row)">
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
            />
          </template>
        </el-table-column>
      </template>

      <template #contactGroup>
        <el-table-column label="告警联系组">
          <template #default="props">
            <div
              v-for="(item, index) in props.row.contactGroupNames"
              :key="index"
            >
              {{ item }}
            </div>
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
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { FiltrateEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { expenseTypeList } from '@/api/java/operate-center'
import {
  getAlarmRuleUrl,
  deleteCreateRulesMonitoring,
  enableRulesMonitoring,
  disabledRulesMonitoring,
  alarmDeleteUrl
} from '@/api/java/maintenance-center'
import { dayjs } from 'element-plus'

const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: '资源类型', prop: 'resourceType', type: FiltrateEnum.list }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      if (item.prop === 'resourceType') {
        const result = resourceTypeList.value.find(
          (item: any) => item.name === temp[1]
        )
        state.queryForm.resourceType = result?.code
      } else {
        state.queryForm[item.prop] = temp[1]
      }
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
    title: '创建告警规则',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  {
    title: '启用',
    prop: 'enable',
    disabled: true,
    disabledText: '请选择告警规则'
  },
  {
    title: '禁用',
    prop: 'forbidden',
    disabled: true,
    disabledText: '请选择告警规则'
  },
  {
    title: '删除',
    prop: 'delete',
    disabled: true,
    disabledText: '请选择告警规则'
  }
]

/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: getAlarmRuleUrl,
  deleteUrl: alarmDeleteUrl,
  queryForm: {}
})
const {
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  selectionChangeHandle,
  deleteHandle
} = useCrud(state)

const tableListRef = ref()
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    router.push({
      path: '/maintenance-center/alarm-service/alarm-rule/create'
    })
  } else if (value === 'enable' || value === 'forbidden') {
    // 启用禁用
    ControlSwitch(value)
  } else if (value === 'delete') {
    const ids = state.dataListSelections?.map((item: any) => item.id)
    deleteHandle(ids!.join(','), '?ids=')
    tableListRef.value.IdealTableList.clearSelection()
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

const multiSelectList: any = ref([])
watch(
  () => state.dataListSelections,
  value => {
    multiSelectList.value = value
    attrData.leftButtons.forEach((item: any, index: number) => {
      item.disabled = index !== 0
      item.disabledText = '请选择告警规则'
    })
    if (value?.length) {
      const isEnable = value.some((item: any) => item.status)
      const isDisable = value.some((item: any) => !item.status)
      const allEnable = value.every((item: any) => item.status)
      const allDisable = value.every((item: any) => !item.status)
      attrData.leftButtons.forEach((item: any, index: number) => {
        item.disabled = false
        item.disabledText = '请选择告警规则'
        // 同时选择已禁用和已启用则启用和禁用禁止
        if (index !== 0 && index !== 3) {
          item.disabled = isEnable && isDisable
          item.disabledText = '不能同时选择已启用和已禁用'
        }
        // 选择已启用,禁用启用按钮
        if (allEnable && index === 1) {
          item.disabled = true
          item.disabledText = '所选状态为已启用，不能再次启用'
        }
        // 选择已禁用,禁用禁用按钮
        if (allDisable && index === 2) {
          item.disabled = true
          item.disabledText = '所选状态为已禁用，不能再次禁用'
        }
      })
    }
  }
)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '规则名称', prop: 'name', useSlot: true },
  { label: '资源类型', prop: 'resourceTypeDes' },
  { label: '关联资源', prop: 'rangeDes' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '告警联系组', prop: 'contactGroup', useSlot: true },
  { label: '创建时间', prop: 'createDate' }
]

const expandTableHeaders: IdealTableColumnHeaders[] = [
  { label: '阈值规则名称', prop: 'name' },
  { label: '阈值描述', prop: 'overview' },
  { label: '告警级别', prop: 'reportLevelDes' }
]

const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]

/**
 * 列表合并
 */
const pos = ref(0)
const mergeTable = (row: any) => {
  if (!row.historyConfigs) {
    return
  }

  row.mergeData = []
  for (let i = 0; i < row.historyConfigs.length; i++) {
    if (i === 0) {
      row.mergeData.push(1)
      pos.value = 0
    } else {
      if (row.historyConfigs[i].name == row.historyConfigs[i - 1].name) {
        row.mergeData[pos.value] += 1
        row.mergeData.push(0)
      } else {
        row.mergeData.push(1)
        pos.value = i
      }
    }
  }
}

watch(
  () => state.dataList,
  arr => {
    arr?.forEach((item: any) => {
      item.createDate = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      if (item.status) {
        item.statusIcon = item.alarmStatus
          ? 'status-success'
          : 'status-exception'
        item.statusText = item.alarmStatus ? '启用(告警中)' : '启用(未告警)'
      } else {
        item.statusIcon = 'status-error'
        item.statusText = '禁用'
      }
      mergeTable(item)
    })
  }
)
onMounted(() => {
  getExpenseType()
})
const resourceTypeList: any = ref([])
const getExpenseType = () => {
  expenseTypeList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        const typeItem = typeArray.value.find(
          (item: IdealSearch) => item.prop === 'resourceType'
        )
        typeItem!.array = data
        typeItem!.arrayKey = 'code'
        typeItem!.arrayProp = 'name'
        resourceTypeList.value = data
      } else {
        resourceTypeList.value = []
      }
    })
    .catch(_ => {
      resourceTypeList.value = []
    })
}
//侧边栏操作
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'delete') {
    ElMessageBox.confirm('确定要删除当前告警规则吗？', '删除告警规则', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteCreateRulesMonitoring(row.id).then((res: any) => {
          let { code } = res
          if (code === 200) {
            ElMessage.success('删除告警规则成功')
            getDataList()
          }
        })
      })
      .catch(() => {
        ElMessage.info('取消删除告警规则')
      })
  } else if (command === 'edit') {
    const data = JSON.stringify(row)
    router.push({
      path: '/maintenance-center/alarm-service/alarm-rule/create',
      query: { type: 'edit', data }
    })
  }
}

//跳转详情
const toDetail = (row: any) => {
  const id = row.id
  router.push({
    path: '/maintenance-center/alarm-service/alarm-rule/detail',
    query: { id }
  })
}
// 启用禁用
const ControlSwitch = (command: string) => {
  const apiURL =
    command === 'enable' ? enableRulesMonitoring : disabledRulesMonitoring

  ElMessageBox.confirm(
    `确定要${command === 'enable' ? '启用' : '禁用'}所选规则吗？`,
    `${command === 'enable' ? '启用' : '禁用'}规则`,
    {
      confirmButtonText: '确定',
      cancelButtonText: '禁用',
      type: 'warning'
    }
  )
    .then(() => {
      const ids = multiSelectList.value.map((item: any) => item.id)
      apiURL(ids).then((res: any) => {
        if (res.code === 200) {
          ElMessage.success(`${command === 'enable' ? '启用' : '禁用'}请求成功`)
          tableListRef.value.IdealTableList.clearSelection()
          getDataList()
        }
      })
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}
</script>

<style scoped lang="scss">
.alarm-rule {
  background-color: #fff;
  padding: $idealPadding;
  .flex-row-center {
    align-items: center;
    justify-content: center;
  }
  .expandTable {
    padding: 0 $idealPadding;
  }
  ul {
    flex-wrap: wrap;
    li {
      width: 50%;
      list-style-type: none;
      height: 30px;
      line-height: 30px;
    }
  }
  .ideal-theme-text {
    cursor: pointer;
  }
}
</style>
