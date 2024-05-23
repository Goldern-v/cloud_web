<template>
  <div>
    <ideal-table-list
      :table-data="tableArray"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip width="270">
          <template #default="props">
            <div>{{ props.row.name }}</div>
            <div>{{ props.row.uuid }}</div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
// 属性值
interface deleteProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<deleteProps>(), {
  rowData: null
})

const { t } = useI18n()
/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})

const tableArray = [props.rowData]
const tableHeaders = ref<IdealTableColumnHeaders[]>([
  { label: '名称', prop: 'name', useSlot: true },
  { label: '网卡', prop: 'nic' },
  { label: '类型', prop: 'type' },
  { label: 'VLAN ID/VNI', prop: 'vlan' },
  { label: '共享模式', prop: 'shareMode' },
  { label: '创建时间', prop: 'createTime' }
])

const { sizeChangeHandle, currentChangeHandle, getDataList, query } =
  useCrud(state)

/**
 * 确定、取消
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
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss"></style>
