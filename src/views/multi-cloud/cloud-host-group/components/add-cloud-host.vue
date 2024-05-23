<template>
  <div class="add">
    <div class="flex-row add__tip">
      <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-svg-margin-right"></svg-icon>
      <div>
        <div>关机状态的云服务器在加入云服务器组对过程，不可对云服务器进行开机操作。</div>
        <div>添加云服务器到云服务器组后，基于反亲和性可能会重新分配主机。再次开机时可能会由于基础资源不足无法正常开机，请移出云服务器组后重试。</div>
      </div>
    </div>

    <div style="margin: 10px 0;">云服务器组 <span>{{ rowData.name }}</span></div>

    <div class="flex-row search-box">
      <el-button link>选择云服务器</el-button>
      <ideal-select-search
        :options="searchOptions"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      />
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :show-pagination="false"
      is-radio
      @clickTableCellRow="clickTableCellRow"
      @handleSelectionChange="selectionChangeHandle">
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <!-- <template #operation>
        <el-table-column label="操作" width="80">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template> -->
    </ideal-table-list>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum } from '@/utils/enum'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { instanceGroupAvailableInstanceUrl, instanceGroupAddServerGroup } from '@/api/java/compute'

interface AddProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<AddProps>(), {
  rowData: null
})

const { t } = useI18n()
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'id' }
]
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: instanceGroupAvailableInstanceUrl,
  deleteUrl: '',
  isPage: false,
  queryForm: {
    regionId: props.rowData?.regionId,
    projectId: props.rowData?.projectId,
    vdcId: props.rowData?.vdcId,
    resourcePoolId: props.rowData?.resourcePoolId
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

watch(() => state.dataList, value => {
  if (value?.length) {
    value.forEach((item: any) => {
      item.statusText = RESOURCE_STATUS[item?.status]
      item.statusIcon = RESOURCE_STATUS_ICON[item?.status]
    })
  }
}) 

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '云服务器名称', prop: 'name' },
  { label: '可用区', prop: 'availableZone' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '镜像', prop: 'image.osVersion' }
]
const operateBtns: IdealTableColumnOperate[] = [
  { type: 'primary', title: '关机', prop: 'shutdown' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
}
const selectData = ref()
const clickTableCellRow = (row: any) => {
  selectData.value = row
}
// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  const params = {
    id: props.rowData?.id, // 云主机组id
    instanceUuid: selectData.value?.uuid,// 云主机uuid
    resourcePoolId: props.rowData?.resourcePoolId, // 资源池id
    regionId: props.rowData?.regionId, // 区域id
    projectId: props.rowData?.projectId, // 项目id
    vdcId: props.rowData?.vdcId
  }
  instanceGroupAddServerGroup(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('添加成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('添加失败')
    }
  })
}
</script>

<style scoped lang="scss">
.add {
  width: 100%;
  .add__tip {
    background-color: var(--el-color-primary-light-9);
    padding: 20px;
    align-items: center;
  }
  .search-box {
    justify-content: space-between;
    align-items: center;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
    margin-top: 10px;
  }
}
</style>