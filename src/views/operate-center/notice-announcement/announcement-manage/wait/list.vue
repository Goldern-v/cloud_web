<template>
  <div class="wait">
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
  announcementPublish,
  announcementManageDeleteUrl
} from '@/api/java/operate-center'
// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '日期', prop: 'date', type: FiltrateEnum.date },
  { label: '公告标题', prop: 'title', type: FiltrateEnum.input },
  { label: '公告内容', prop: 'content', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {
    status: '0'
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
  deleteUrl: announcementManageDeleteUrl,
  queryForm: {
    status: '0'
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
        item.statusText = item.status === 1
      })
    }
  }
)
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
  { title: '编辑', prop: 'edit' },
  { title: '发布', prop: 'publish' },
  { title: '删除', prop: 'delete' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
  } else if (command === 'publish') {
    handlePublish(row)
  } else if (command === 'delete') {
    deleteHandle(row?.id, '/')
  }
}
const handlePublish = (row: any) => {
  ElMessageBox.confirm('确认发布该通知公告？', '发布公告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    announcementPublish([row?.id]).then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('发布成功')
      } else {
        ElMessage.error('发布失败')
      }
      getDataList()
    })
  })
}
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  { title: '发布公告', prop: 'create', type: 'primary' }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.add
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
.wait {
  width: calc(100% - 40px);
  padding: 20px;
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
}
</style>
