<template>
  <div class="message-tabs">
    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>
    <!-- state.dataList -->
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="[]"
      :table-headers="tableHeaders"
      :pagination-type="PaginationTypeEnum.totalSizes"
      :total="state.total"
      :page="state.page"
      :is-multiple="true"
      @handleSelectionChange="selectionChangeHandle"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #title>
        <el-table-column label="标题">
          <template #default="props">
            <div v-if="!isSupplierManager">工单通知{{ props.row.title }}</div>
            <div v-else>待审批通知</div>
          </template>
        </el-table-column>
      </template>
      <template #content>
        <el-table-column label="内容" width="500">
          <template #default="props">
            <div v-if="!isSupplierManager">
              尊敬的管理员：您有一个供应商（供应商名称）录入信息需要审批，请到供应商审批管理进行处理，谢谢。
            </div>
            <div v-else>
              尊敬的用户：您有一个工单(工单号：{{
                props.row.conteng
              }})需要处理，请到工单管理中心进行处理，谢谢。
            </div>
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="120" fixed="right">
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { PaginationTypeEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
  // IdealTextProp
} from '@/types'
import { portPageUrl, portDelete } from '@/api/java/operate-center'
import { isSupplierManager } from '@/utils/role'

const state: IHooksOptions = reactive({
  dataListUrl: portPageUrl,
  dataList: [] as any[],
  deleteUrl: portDelete,
  queryForm: {
    portType: 'SPECIALIZED'
  },
  primaryKey: 'id' // 多选结果主键
})

const {
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle,
  selectionChangeHandle
} = useCrud(state)

const tableHeaders = ref<IdealTableColumnHeaders[]>()
onMounted(() => {
  tableHeaders.value = headerArray
})

const headerArray: IdealTableColumnHeaders[] = [
  { label: '消息状态', prop: 'name' },
  { label: '标题', prop: 'title', useSlot: true },
  { label: '内容', prop: 'content', useSlot: true },
  { label: '日期', prop: 'vendorName' }
]

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '标记为已读',
    prop: 'markers',
    type: 'primary',
    iconColor: 'white',
    authority: 'message:notification:read',
    disabled: true,
    disabledText: '请至少选择一条消息'
  },
  {
    title: '删除',
    prop: 'delete',
    iconColor: 'white',
    authority: 'message:notification:unread:delete',
    disabled: true,
    disabledText: '请至少选择一条消息'
  }
])

const clickLeftEvent = (command: string | number | object) => {
  if (command === 'markers') {
    handleMarkers()
  } else {
    handleDelete()
  }
}

const handleMarkers = () => {
  // state.dataListSelections
  ElMessageBox.confirm('是否将所选中的消息标记为已读?', '提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    //   ElMessage({
    //     type: 'success',
    //     message: 'Delete completed'
    //   })
  })
}

const handleDelete = () => {
  // state.dataListSelections
  ElMessageBox.confirm('确定要删除当前消息吗?', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    //   ElMessage({
    //     type: 'success',
    //     message: 'Delete completed'
    //   })
  })
}

const operateButtons: IdealTableColumnOperate[] = [
  {
    title: '删除',
    prop: 'delete',
    authority: 'message:notification:unread:delete'
  }
]

// 多选禁用问题
watch(
  () => state.dataListSelections,
  arr => {
    rowData.value = arr
    if (arr?.length) {
      leftButtons?.value.forEach((item: any) => {
        item.disabled = arr?.length === 0
        item.disabledText = arr?.length > 0 ? '' : '请至少选择一条消息'
      })
    } else {
      leftButtons?.value.forEach((item: any) => {
        item.disabled = true
        item.disabledText = '请至少选择一条消息'
      })
    }
  }
)
const rowData: any = ref({})
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'delete') {
    deleteHandle(row.id, '/', '确定要删除当前消息吗？', '删除')
  }
}
const counter = ref()
const emit = defineEmits(['updateListLength'])
watch(
  () => state.total,
  val => {
    emit('updateListLength', val)
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.message-tabs {
  background-color: white;
  padding: $idealPadding;
}
</style>
