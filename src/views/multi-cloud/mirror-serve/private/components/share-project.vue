<template>
  <div class="share-tenant">
    <!-- <div class="ideal-tip-text">您还可以添加245个租户。</div> -->

    <ideal-button-events
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.shareStatus"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
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
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus/es'
import dialogBox from '../dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import { mirrorShareRelationUrl, mirrorShareCancel } from '@/api/java/compute'

const route = useRoute()
const imageId = (route.query.id as string)
onMounted(() => {
  if (imageId) {
    state.queryForm.id = imageId
    query()
  }
})

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: mirrorShareRelationUrl,
  createdIsNeed: false,
  isPage: false,
  primaryKey: 'projectId',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  query,
} = useCrud(state)

watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusText = RESOURCE_STATUS[item?.shareStatus]
        item.statusIcon = RESOURCE_STATUS_ICON[item?.shareStatus]
      })
    }
  }
)
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '项目ID', prop: 'projectId' },
  { label: '状态', prop: 'status', useSlot: true }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '删除', prop: 'delete' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'delete') {
    rowData.value = row
    clickDelete()
  }
}

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '全部删除',prop: 'delete', disabled: true, disabledText: '还未选择租户' },
  { title: '添加项目', prop: 'addProject' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'addProject') {
    showDialog.value = true
    dialogType.value = 'addProject'
  } else if (value === 'delete') {
    clickDelete('multi')
  }
}
const clickDelete = (type: string = 'single') => {
  ElMessageBox.confirm(
    '确认删除所选租户?',
    '删除',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      handleDelete(type)
    })
}
const handleDelete = (type: string) => {
  const params: {[key: string]: any} = {
    id: imageId
  }
  if (type === 'single') {
    params.projectIds = [rowData.value.projectId]
  } else {
    params.projectIds = state.dataListSelections
  }
  mirrorShareCancel(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
  })
}
// 监听多选结果,修改绑定按钮是否可操作
watch(() => state.dataListSelections, value => {
  leftButtons.value[0].disabled = true
  if (value?.length) {
    leftButtons.value[0].disabled = false
  }
})
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'refresh',
    icon: 'refresh-icon'
  }
]
const clickRightEvent = (value: string | number | object) => {}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  query()
}
</script>

<style scoped lang="scss">
.share-tenant {
  width: calc(100% - 40px);
  background-color: white;
  padding: 0 20px 20px;
}
</style>
