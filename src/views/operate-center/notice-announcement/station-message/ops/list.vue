<template>
  <div class="ops">
    <ideal-search
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    ></ideal-search>

    <el-divider />

    <div class="flex-row ops-header">
      <ideal-button-events
        :left-btns="leftButtons"
        @clickLeftEvent="clickLeftEvent"
      />
      <div class="flex-row ops-header-msg">
        <div class="ideal-theme-text">未读</div>
        <div class="ideal-theme-text" style="padding: 0 3px">
          {{ unreadCount }}
        </div>
        <div>| 已读</div>
        <div style="padding-left: 3px">{{ readCount }}</div>
      </div>
    </div>

    <ideal-table-list
      ref="tableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #content>
        <el-table-column label="内容">
          <template #default="props">
            <el-tooltip
              effect="dark"
              :content="props.row.content"
              :disabled="isShow"
              placement="top"
              popper-class="custom-tooltip"
            >
              <div
                ref="contentRef"
                class="ops-content"
                :class="{ 'ops-content-color': !props.row.readOrNot }"
                @mouseover="isShowTooltip"
              >
                {{ props.row.content }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="80">
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
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus/es'
import dialogBox from '../components/dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { FiltrateEnum, OperateEventEnum } from '@/utils/enum'
import store from '@/store'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import {
  stationMessageUrl,
  stationMessageDeleteUrl,
  stationMessageRead,
  stationMessageBatchDelete,
  stationUnread,
  stationRead
} from '@/api/java/operate-center'

onMounted(() => {
  getUnread()
  getRead()
})
const getCountParams = (): { [key: string]: any } => {
  return {
    userId: store.userStore.user.id,
    messageCategory: 'OPERATION_MESSAGE'
  }
}
const unreadCount = ref(0)
// 获取未读
const getUnread = () => {
  const params = getCountParams()
  stationUnread(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        unreadCount.value = data
      } else {
        unreadCount.value = 0
      }
    })
    .catch(_ => {
      unreadCount.value = 0
    })
}
const readCount = ref(0)
// 获取已读
const getRead = () => {
  const params = getCountParams()
  stationRead(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        readCount.value = data
      } else {
        readCount.value = 0
      }
    })
    .catch(_ => {
      readCount.value = 0
    })
}

const statusList: any = ref([
  { label: '全部状态', value: '' },
  { label: '未读', value: false },
  { label: '已读', value: true }
])
const typeArray = ref<IdealSearch[]>([
  { label: '日期', prop: 'date', type: FiltrateEnum.date },
  {
    label: '状态',
    prop: 'readOrNot',
    type: FiltrateEnum.list,
    array: statusList.value,
    arrayProp: 'label',
    arrayKey: 'value'
  },
  { label: '标题', prop: 'title', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {
    userId: store.userStore.user.id
  }
  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      if (item.prop === 'readOrNot') {
        // 全部状态判断则不传参
        if (typeof item.value === 'boolean') {
          state.queryForm.readOrNot = item.value
        }
      } else if (item.prop === 'date' && item?.value) {
        // 日期
        const timeArray = item.value.split('/')
        state.queryForm.startTime = timeArray[0]
        state.queryForm.endTime = timeArray[1]
      } else {
        state.queryForm[item.prop] = item.value
      }
    })
  }
  getDataList()
}
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: stationMessageUrl,
  deleteUrl: stationMessageDeleteUrl,
  queryForm: {
    userId: store.userStore.user.id,
    messageCategory: 'OPERATION_MESSAGE'
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle,
  query
} = useCrud(state)
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusText = item?.readOrNot ? '已读' : '未读'
      })
    }
  }
)
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '状态', prop: 'statusText' },
  { label: '类别', prop: 'messageCategoryName' },
  { label: '类型', prop: 'messageReceptionName' },
  { label: '标题', prop: 'title' },
  { label: '内容', prop: 'content', useSlot: true },
  { label: '日期', prop: 'operTime' }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '删除', prop: 'delete' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'delete') {
    deleteHandle(row?.id, '/')
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '标记为已读', prop: 'mark', type: 'primary' },
  { title: '删除', prop: 'delete' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'mark') {
    markMessage()
  } else if (value === 'delete') {
    batchDelete()
  }
}
const tableRef = ref()
const markMessage = () => {
  ElMessageBox.confirm('确认要标记消息为已读？', '取消标记', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const idList = state.dataListSelections?.map((item: any) => item?.id)
    stationMessageRead(idList).then((res: any) => {
      if (res.code === 200) {
        ElMessage.success('消息已读')
        tableRef.value.IdealTableList.clearSelection() // 清空多选
        getUnread()
        getRead()
        getDataList()
      }
    })
  })
}
const batchDelete = () => {
  ElMessageBox.confirm('确认要删除这些消息吗？', '取消删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const idList = state.dataListSelections?.map((item: any) => item?.id)

    stationMessageBatchDelete(idList).then((res: any) => {
      if (res.code === 200) {
        ElMessage.success('删除成功')
        tableRef.value.IdealTableList.clearSelection() // 清空多选
        getDataList()
      }
    })
  })
}
watch(
  () => state.dataListSelections,
  value => {
    leftButtons.value?.forEach((item: IdealButtonEventProp) => {
      item.disabled = false
    })
    if (value?.length) {
      const exitRead = value.some((item: any) => item?.readOrNot)

      if (exitRead) {
        leftButtons.value?.forEach((item: IdealButtonEventProp) => {
          if (item.prop === 'mark') {
            item.disabled = true
            item.disabledText = '不能选择已读消息'
          } else {
            item.disabled = false
          }
        })
      }
    }
  }
)
const isShow = ref(true)
const contentRef = ref()
const isShowTooltip = () => {
  if (contentRef.value.parentNode.offsetWidth > contentRef.value.offsetWidth) {
    isShow.value = false
  } else {
    isShow.value = true
  }
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
  query()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = '' // 防止再点击弹框时 有值
}
</script>

<style scoped lang="scss">
.ops {
  width: calc(100% - 40px);
  padding: 20px;
  .ops-header {
    justify-content: space-between;
    align-items: center;
    .ops-header-msg {
      width: 120px;
      align-items: center;
    }
  }
  .ops-content {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .ops-content-color {
    color: var(--el-color-primary);
  }
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  width: 260px;
}
</style>
