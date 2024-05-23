<template>
  <div class="delete">
    <div>即将删除文件夹{{ fileName }}</div>
    <div>·开启多版本控制时，被选中的文件夹及其中的文件删除后会存放在已删除对象中。您可以在需要时通过取消删除其中的文件来取回文件夹。</div>
    <div>·未开启多版本控制时，被选中的文件夹及其中的文件将永远被删除。</div>

    <ideal-table-list
      :table-data="tableArray"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #name>
        <el-table-column label="名称">
          <template #default="props">
            <div class="ideal-theme-text">{{ props.row.name }}</div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
    
    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'

interface ShareProps {
  rowData?: any 
}
const props = withDefaults(defineProps<ShareProps>(), {
  rowData: null
})

const { t } = useI18n()

const fileName = ref('')
const tableArray = ref<any[]>([])
onMounted(() => {
  fileName.value = props.rowData?.name || ''
  tableArray.value = [props.rowData]
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '存储类别', prop: 'storageClass' },
  { label: '大小', prop: 'size' }
]

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
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.delete {
  width: 100%;
}
</style>
