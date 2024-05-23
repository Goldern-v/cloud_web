<template>
  <div class="select-cloud-host">
    <div class="flex-row select-cloud-host-tip">
      <svg-icon icon="info-warning" class="ideal-svg-margin-right"/>
      <div>您只能选择运行中或关机状态的云服务器创建伸缩配置。</div>
    </div>

    <div class="flex-row select-cloud-host-search ideal-large-margin-top">
      <el-input v-model="searchValue" class="ideal-default-margin-right" style="width: 50%;">
        <template #prepend>
          <el-select
            v-model="searchKey"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in searchList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>

        <template #suffix>
          <svg-icon icon="search-icon" @click="clickSearch"/>
        </template>
      </el-input>

      <svg-icon icon="refresh-icon"/>
    </div>

    <ideal-table-list
      row-key="uuid"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :is-radio="true"
      :show-pagination="false"
      @clickTableCellRow="clickTableCellRow"
    >

      <template #status>
        <el-table-column label="状态" >
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.status"
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row footer-button ideal-large-margin-top">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum, EmitsEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
import { isEmpty, isUnDef } from '@/utils/is'
import emits from '@/utils/emits'

const { t } = useI18n()
const searchValue = ref('')
const searchKey = ref('')
const searchList = ref<any[]>([
  { label: '名称', value: 'name' },
  { label: 'ID', value: 'id' }
])
const clickSearch = () => {
  getDataList()
}
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { getDataList } = useCrud(state)
state.dataList = [
{
    name: 'vpn跳板-不要动',
    uuid: 'e916a919-9dae-439f-a24a-becdfa7ab9ce',
    status: '运行中',
    statusStr: 'using',
    statusType: 'status-success',
    spec: 's7.small.1 | 1vCPUs | 1GiB',
    mirror: 'Ubuntu 18.04 server 64bit',
    createTime: '2023-10-20 10:20:32',
    billingMode: '按需计费',
    safeGroup: 'Sys-FullAccess (入方向:TCP | 出方向: - ) Sys-WebServer (入方向:ICMP; TCP | 出方向: - )'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '规格', prop: 'spec' },
  { label: '镜像', prop: 'mirror' },
  { label: '创建时间', prop: 'createTime' }
]
const rowData = ref()
const clickTableCellRow = (row: any) => {
  rowData.value = row
}
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const cancelForm = () => {
  emit(EventEnum.cancel)
}
const submitForm = () => {
  if (isEmpty(rowData.value) || isUnDef(rowData.value)) {return ElMessage.error('请选择云服务器')}
  emits.emit(EmitsEnum.HandleSuccess, { row: rowData.value })
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.select-cloud-host {
  width: 100%;
  .select-cloud-host-tip {
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary);
    border-radius: $circleRadiusSize;
    padding: 10px $idealPadding;
  }
  .select-cloud-host-search {
    justify-content: flex-end;
    align-items: center;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
