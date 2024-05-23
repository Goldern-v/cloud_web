<template>
  <div class="history">
    <ideal-search
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    ></ideal-search>
    <el-divider />

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
      :page="state.page"
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #operation>
        <el-table-column label="操作" width="120">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              :max-buttons="2"
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
import { ElMessageBox, ElMessage } from 'element-plus'
import dialogBox from '../dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { FiltrateEnum, OperateEventEnum } from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import {
  announcementManagePageUrl,
  announcementManageEdit,
  announcementBatchDelete
} from '@/api/java/operate-center'

const typeArray = ref<IdealSearch[]>([
  { label: '日期', prop: 'date', type: FiltrateEnum.date },
  { label: '公告标题', prop: 'title', type: FiltrateEnum.input },
  { label: '公告内容', prop: 'content', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {
    status: '2'
  }
  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      if (item.prop === 'date' && item?.value) {
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
  dataListUrl: announcementManagePageUrl,
  deleteUrl: '',
  queryForm: {
    status: '2'
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

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '类型', prop: 'announcementType.name' },
  { label: '标题', prop: 'title' },
  { label: '创建用户', prop: 'creator.name' },
  { label: '修改用户', prop: 'updater.name' },
  { label: '创建时间', prop: 'createTime.date' },
  { label: '修改时间', prop: 'updateTime.date' },
  { label: '状态', prop: 'statusName' }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '详情', prop: 'detail' },
  { title: '编辑', prop: 'edit' },
  { title: '再次发布', prop: 'again' },
  { title: '删除', prop: 'delete' }
]
const router = useRouter()
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'detail') {
    router.push({
      path: '/operate-center/notice-announcement/announcement-manage/history/detail',
      query: { id: row?.id }
    })
  } else if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
  } else if (command === 'again') {
    clickAgain(row?.id)
  } else if (command === 'delete') {
    deleteHandle(row?.id, '/')
  }
}
const clickAgain = (id: string) => {
  ElMessageBox.confirm('确认再次发布该通知公告？', '再次发布公告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    const params = {
      id,
      status: '1'
    }
    announcementManageEdit(params).then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('再次发布成功')
        getDataList()
      } else {
        ElMessage.error('再次发布失败')
      }
    })
  })
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '发布公告', prop: 'create', type: 'primary' },
  {
    title: '删除',
    prop: 'delete',
    type: 'primary',
    disabled: true,
    disabledText: '请选择要删除的公告'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.add
  } else if (value === 'delete') {
    handleBatch()
  }
}
const tableRef = ref()
const handleBatch = () => {
  ElMessageBox.confirm('确认删除这些通知公告？', '删除公告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    const arr = state.dataListSelections?.map((item: any) => item?.id)
    console.log('-------', arr)
    announcementBatchDelete(arr).then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('删除成功')
        tableRef.value.IdealTableList.clearSelection()
        getDataList()
      } else {
        ElMessage.error('删除失败')
      }
    })
  })
}
watch(
  () => state.dataListSelections,
  value => {
    leftButtons.value.forEach((item: any) => {
      if (item.prop === 'delete') {
        item.disabled = true
      }
    })
    if (value?.length) {
      leftButtons.value.forEach((item: any) => {
        if (item.prop === 'delete') {
          item.disabled = false
        }
      })
    }
  }
)
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
.history {
  width: calc(100% - 40px);
  padding: 20px;
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
}
</style>
