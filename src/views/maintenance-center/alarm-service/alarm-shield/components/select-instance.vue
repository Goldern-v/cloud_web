<template>
  <div>
    <ideal-select-search
      :options="searchOptions"
      class="flex-row header-select"
    >
    </ideal-select-search>
    <ideal-table-list
      row-key="id"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      is-radio
      @clickTableCellRow="clickTableCellRow"
    >
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import store from '@/store'
import { getAssociatedInstanceList } from '@/api/java/maintenance-center'

const { t } = useI18n()

/**
 * 已选择的联系人
 */
interface contactPerson {
  resourceType?: string
  multiContactPerson?: string[] //选中的联系人
}
const props = withDefaults(defineProps<contactPerson>(), {
  resourceType: '',
  multiContactPerson: () => []
})

const searchOptions = [
  { label: '主机名', prop: 'name' },
  { label: '实例ID', prop: 'id' }
]
/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: getAssociatedInstanceList,
  deleteUrl: '',
  queryForm: {
    support: store.commonStore.type,
    resourcePoolId: store.commonStore.resourcePool
  }
})
const { sizeChangeHandle, getDataList, selectionChangeHandle } = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '实例ID', prop: 'id' },
  { label: '主机名', prop: 'name' },
  { label: 'IP地址', prop: 'fixedIp' }
]
const rowData = ref()
const clickTableCellRow = (row: any) => {
  rowData.value = row
}
/**
 * 确定/取消
 */
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const cancelForm = () => {
  emit(EventEnum.cancel)
}
const submitForm = () => {
  store.commonStore.setTempArray(state.dataList)
  store.commonStore.setTempObject(rowData.value)
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.header-select {
  justify-content: end;
}
</style>
