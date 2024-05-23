<template>
  <div class="vpc--edit">
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="rules"
      label-position="left"
    >
      <div class="flex-row vpc--edit__tip">
        <svg-icon icon="info-warning" color="var(--el-color-primary)"></svg-icon>
        <span>IPV4拓展网段不能与高阶服务规划的子网网段冲突。</span>
      </div>

      <ideal-table-list
        :table-data="editForm.dataList"
        :table-headers="tableHeaders"
        :show-pagination="false">
        <template #ipv4Gateway>
          <el-table-column label="IPV4网段">
            <template #default="props">
              <div v-if="props.$index === 0">{{ props.row.ipv4Gateway }}</div>
              <el-input v-else v-model="props.row.ipv4Gateway"/>
            </template>
          </el-table-column>
        </template>

        <template #operation>
          <el-table-column label="操作">
            <template #default="props">
              <el-button link :disabled="props.$index===0" @click="handleNetworkCardDelete(props.$index)">
                <svg-icon icon="delete-icon"></svg-icon>
              </el-button>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </el-form>

    <el-button link class="vpc--edit-add-button" @click="handleNetworkCardAdd">
      <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
      <span>添加IPV4拓展网段</span>
    </el-button>

    <div class="flex-row vpc-button--edit">
      <el-button type="info" @click="cancelForm(editFormRef)"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm(editFormRef)"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  dataList: [{ ipv4Gateway: '192.168.0.0/16' }] // 列表数据
})

const rules = reactive<FormRules>({})

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'IPV4网段', prop: 'ipv4Gateway', useSlot: true }
]
// 添加IPV4拓展网段
const handleNetworkCardAdd = () => {
  editForm.dataList.push({ ipv4Gateway: '' })
}
// 删除IPV4拓展网段
const handleNetworkCardDelete = (index: number) => {
  editForm.dataList.splice(index, 1)
}

interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(valid => {
    if (valid) {
      console.log('submit!')
      emit(EventEnum.success)
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.vpc--edit {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .vpc--edit__tip {
    background-color: var(--custom-information-bg-color);
    align-items: center;
    padding: 20px;
    margin-bottom: 10px;
    border-radius: $circleRadiusSize;
  }
  .vpc-button--edit {
    justify-content: flex-end;
    align-items: center;
  }
  .vpc--edit-add-button {
    margin: 5px 0;
  }
}
</style>
