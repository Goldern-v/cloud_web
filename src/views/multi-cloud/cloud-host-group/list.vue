<template>
  <div class="ideal-main-container cloud-host-group">
    <ideal-search
      ref="searchRef"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #expandTable>
        <el-table-column type="expand">
          <template #default="props">
            <div style="padding: 0 20px">
              <ideal-detail-info
                :label-array="labelArray"
                :item-number="2"
                :detail-info="props.row"
              />
              <cloud-host :id="props.row?.id" @clickSuccessEvent="clickSuccessEvent"/>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" fixed="right" width="150">
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
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus'
import cloudHost from './components/cloud-host.vue'
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import { instanceGroupPageUrl, instanceGroupDelete } from '@/api/java/compute'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input }
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
  dataListUrl: instanceGroupPageUrl,
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '策略', prop: 'policies' },
  { label: '云平台类别', prop: 'cloudPlatformCategory' },
  { label: '云平台类型', prop: 'cloudPlatformType' },
  { label: '云平台名称', prop: 'cloudPlatformName' },
  { label: '资源池', prop: 'resourcePoolName' },
  { label: '云服务器数量', prop: 'instanceNum' }
]
const operateBtns: IdealTableColumnOperate[] = [
  { type: 'primary', title: '添加云服务器', prop: 'expand' },
  { type: 'primary', title: '删除', prop: 'delete' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'expand') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.expand
  } else if (command === 'delete') {
    deleteEvent(row)
  }
}
const deleteEvent = (row: any) => {
  ElMessageBox.confirm('确认删除该云服务器组？', '删除', {
    confirmButtonText: '确 认',
    cancelButtonText: '取 消'
  })
    .then(() => {
      const params = {
        id: row?.id,
        resourcePoolId: row?.resourcePoolId,
        regionId: row?.regionId,
        projectId: row?.projectId,
        vdcId: row?.vdcId
      }
      instanceGroupDelete(params).then((res: any) => {
        const { code } = res
        if (code === 200) {
          ElMessage.success('删除成功')
          getDataList()
        } else {
          ElMessage.error('删除失败')
        }
      })
    })
  
}
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '新建云服务器组',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  }
}
// 列表扩张信息
const labelArray = ref([
  { label: '名称', prop: 'name' },
  { label: '已加入云服务器数量', prop: 'instanceNum' },
  { label: 'ID', prop: 'id' },
  { label: '可添加云服务器数量', prop: 'available' },
  { label: '策略', prop: 'policies' }
])
// 云服务器组移除云服务器成功后 刷新列表
const clickSuccessEvent = () => {
  getDataList()
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  if (dialogType.value === 'resourcePool') {
    dialogType.value = OperateEventEnum.create
  } else {
    showDialog.value = false
    getDataList()
  }
}

</script>

<style scoped lang="scss">
.cloud-host-group {
  padding: $idealPadding;
}
</style>
