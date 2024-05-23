<template>
  <div class="ideal-main-container alarm-notification">
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
      <template #instance>
        <el-table-column label="关联实例" show-overflow-tooltip width="300">
          <template #default="props">
            <div v-for="(item, index) of props.row.resourceInfos" :key="index">
              {{ item?.name }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #shieldTime>
        <el-table-column label="屏蔽起止时间">
          <template #default="props">
            <div v-if="props.row.shieldTimeType === 'CLEAR_TIME'">
              <div>{{ props.row.startTimeDes }}</div>
              <div>{{ props.row.endTimeDes }}</div>
            </div>
            <div v-else-if="props.row.shieldTimeType === 'PERIOD_TIME'">
              <div>{{ props.row.plannedStart }}</div>
              <div>{{ props.row.plannedEnd }}</div>
            </div>
            <div v-else>永久生效</div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="120">
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
import { FiltrateEnum } from '@/utils/enum'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
} from '@/types'
import {
  alarmShieldPageUrl,
  alarmShieldDeleteUrl,
  alarmShieldEnable,
  alarmShieldDisable
} from '@/api/java/maintenance-center'
import { expenseTypeList } from '@/api/java/operate-center'
import { ElMessage } from 'element-plus'

/**
 * 搜索类型
 * @type {IdealSearch[]}
 */
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: '屏蔽资源类型', prop: 'resourceType', type: FiltrateEnum.list }
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
/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: alarmShieldPageUrl,
  deleteUrl: alarmShieldDeleteUrl,
  queryForm: {}
})
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusText = item.status ? '已启用' : '已禁用'
      })
    }
  }
)
const searchValue = ref('')
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '屏蔽策略名称', prop: 'name' },
  { label: '屏蔽资源类型', prop: 'resourceTypeDes' },
  { label: '屏蔽方式', prop: 'typeDes' },
  { label: '关联实例', prop: 'instance', useSlot: true },
  { label: '屏蔽状态', prop: 'statusText' },
  { label: '屏蔽起止时间', prop: 'shieldTime', useSlot: true },
  { label: '创建时间', prop: 'createTimeFormat' }
]

const attrData = reactive({
  leftButtons: [] as IdealButtonEventProp[],
  rightButtons: [] as IdealButtonEventProp[],
  rowData: {}
})
//列表左侧按钮
attrData.leftButtons = [
  {
    title: '创建告警屏蔽策略',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  {
    title: '启用',
    prop: 'enable',
    disabled: true,
    disabledText: '请选择屏蔽策略'
  },
  {
    title: '禁用',
    prop: 'forbidden',
    disabled: true,
    disabledText: '请选择屏蔽策略'
  },
  {
    title: '删除',
    prop: 'delete',
    disabled: true,
    disabledText: '请选择屏蔽策略'
  }
]
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    router.push({
      path: '/maintenance-center/alarm-service/alarm-shield/create'
    })
  } else if (value === 'delete') {
    if (!state.dataListSelections?.length) {
      return
    }
    const ids = state.dataListSelections.map((item: any) => item.id)
    deleteHandle(
      ids.join(','),
      '?ids=',
      '确定要删除当前告警屏蔽策略吗？',
      '删除'
    )
    tableListRef.value.IdealTableList.clearSelection()
  } else if (value === 'enable') {
    enableEvent()
  } else if (value === 'forbidden') {
    forbiddenEvent()
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
//启用
const enableEvent = () => {
  if (!state.dataListSelections?.length) {
    return
  }
  const ids = state.dataListSelections.map((item: any) => item.id)
  alarmShieldEnable(ids.join(',')).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('启用成功')
      tableListRef.value.IdealTableList.clearSelection()
      getDataList()
    }
  })
}
const forbiddenEvent = () => {
  if (!state.dataListSelections?.length) {
    return
  }
  const ids = state.dataListSelections.map((item: any) => item.id)
  alarmShieldDisable(ids.join(',')).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('禁用成功')
      tableListRef.value.IdealTableList.clearSelection()
      getDataList()
    }
  })
}
watch(
  () => state.dataListSelections,
  value => {
    attrData.leftButtons.forEach((item: any, index: number) => {
      item.disabled = index !== 0
      item.disabledText = '请选择屏蔽策略'
    })
    if (value?.length) {
      const isEnable = value.some((item: any) => item.status)
      const isDisable = value.some((item: any) => !item.status)
      const allEnable = value.every((item: any) => item.status)
      const allDisable = value.every((item: any) => !item.status)
      attrData.leftButtons.forEach((item: any, index: number) => {
        item.disabled = false
        item.disabledText = '请选择告警屏蔽策略'
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

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  deleteHandle,
  getDataList
} = useCrud(state)
const tableListRef = ref()
const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
// 操作
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'edit') {
    const data = JSON.stringify(row)
    router.push({
      path: '/maintenance-center/alarm-service/alarm-shield/create',
      query: { type: 'edit', data }
    })
  } else if (command === 'delete') {
    deleteHandle(row.id, '/', '确定要删除当前告警屏蔽策略吗？', '删除')
  }
}
//列表搜索
const clickSearch = (search: string, type: string) => {
  searchValue.value = search
  state.queryForm = {
    name: searchValue.value
  }
  getDataList()
}
// 列表重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  searchValue.value = ''
  getDataList()
}
</script>

<style scoped lang="scss">
.alarm-notification {
  background-color: #fff;
  padding: $idealPadding;
}
</style>
