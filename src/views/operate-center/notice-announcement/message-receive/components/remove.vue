<template>
  <div>
    <ideal-table-list
      ref="tableRef"
      :table-data="dataArray"
      :table-headers="tableHeaders"
      :show-pagination="false"
      is-multiple
      @handleSelectionChange="selectionChangeHandle"
    ></ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
import { messageReceiveConfigDeleteBatch } from '@/api/java/operate-center'

const { t } = useI18n()

// 属性值
interface AddProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<AddProps>(), {
  rowData: null
})
const dataArray = ref<any[]>([])
onMounted(() => {
  dataArray.value = props.rowData?.messageReceptionItemsList
})
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '当前接收人', prop: 'name' }
]
const multiArray = ref<any[]>([])
const selectionChangeHandle = (selections: any[]) => {
  multiArray.value = selections
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
  deleteReceiver()
}
const deleteReceiver = () => {
  const id = props.rowData.id
  const userIdList: any[] = []
  multiArray.value.forEach((item: any) => {
    userIdList.push(item.messageReceptionPersonId)
  })
  const params = [
    { id, userIdList }
  ]
  messageReceiveConfigDeleteBatch(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('移除成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('移除失败')
    }
  })
}
</script>

<style scoped lang="scss">

</style>
