<template>
  <div class="delete-label">
    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeader"
      :show-pagination="false"
    >
      <template #color>
        <el-table-column label="颜色">
          <template #default="props">
            <div
              class="delete-label-color"
              :style="{ backgroundColor: props.row.color }"
            ></div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import store from '@/store'
import { batchDeleteResourceLabel } from '@/api/java/business-center'

const { t } = useI18n()
interface DialogProps {
  multipleSelection?: string[] //多选
}
const props = withDefaults(defineProps<DialogProps>(), {
  multipleSelection: () => []
})

// 原有规格数据
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = props.multipleSelection
})
const tableHeader: IdealTableColumnHeaders[] = [
  { label: 'ID', prop: 'id', width: '160' },
  { label: '名称', prop: 'name' },
  { label: '颜色', prop: 'color', useSlot: true },
  { label: '资源数量', prop: 'bindResourcesCount' },
  { label: '标签所有者', prop: 'createUserName' },
  { label: '创建时间', prop: 'createTime', width: '160' },
  { label: '描述', prop: 'remark' }
]

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
  const ids = props.multipleSelection
    .map((item: any) => {
      return item.id
    })
    .join(',')
  showLoading('批量删除中...')
  batchDeleteResourceLabel(ids)
    .then((res: any) => {
      const { msg, code } = res
      if (code === 200) {
        ElMessage.success('批量删除成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error(msg || '批量删除失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.delete-label {
  width: 100%;
  .delete-label-color {
    margin-left: calc(50% - 10px);
    width: 20px;
    height: 20px;
  }
}
</style>
