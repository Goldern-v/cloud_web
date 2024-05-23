<template>
  <div class="unbind">
    <div>确定解绑弹性网卡吗？</div>

    <div class="flex-row unbind-tip">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <span>中止时删除功能开启时，解绑后将默认删除弹性网卡。</span>
    </div>

    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    ></ideal-table-list>

    <el-checkbox v-model="save" label="保留弹性网卡"/>

    <div class="flex-row ideal-submit-button">
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
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

interface UnbindProps {
  rowData?: any
}
const props = withDefaults(defineProps<UnbindProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

const tableData = ref<any[]>([])
onMounted(() => {
  if (props.rowData) {
    tableData.value = [props.rowData]
  }
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '私有IP地址', prop: 'fixedIp' },
  { label: '弹性公网IP', prop: 'publicIp' },
  { label: '已绑定云服务器', prop: 'bind' }
]
const save = ref(false)

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
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.unbind {
  width: 100%;
  .unbind-tip {
    margin-top: 10px;
    border: 1px solid var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    padding: 10px;
  }
}
</style>
