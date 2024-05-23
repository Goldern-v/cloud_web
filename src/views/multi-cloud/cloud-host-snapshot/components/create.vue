<template>
  <div class="create">
    <div class="create-tip">
      快照功能仅用于应用迭代时使用，不能用作数据备份，每台云主机可以同时创建10份快照，每份快照建议创建后7天内删除。
    </div>

    <ideal-table-list
      row-key="id"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      is-radio
      :max-height="200"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    ></ideal-table-list>

    <el-form
      ref="formRef"
      class="ideal-middle-margin-top"
      :model="form"
      :rules="rules"
      label-position="left">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 50%;"/>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" style="width: 50%;"/>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="clickCancel(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="clickSave(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum } from '@/utils/enum'
import type { FormRules, FormInstance } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  query
} = useCrud(state)
state.dataList = [
  { name: 'ecm-1023', instanceName: 'ecm-1', status: '关机', expirationTime: '2023-12-02 15:00:00', id: '1' },
  { name: 'ecm-a2', instanceName: 'ecm-2', status: '运行中', expirationTime: '2023-12-12 19:30:00', id: '2' },
  { name: 'ecm-341', instanceName: 'ecm-3', status: '关机', expirationTime: '2023-12-02 10:20:00', id: '3' },
  { name: 'ecm-90a', instanceName: 'ecm-4', status: '运行中', expirationTime: '2023-12-02 20:50:00', id: '4' },
  { name: 'ecm-b2d', instanceName: 'ecm-5', status: '关机', expirationTime: '2023-12-02 11:40:00', id: '5' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '云主机名称', prop: 'instanceName' },
  { label: '状态', prop: 'status' },
  { label: '到期时间', prop: 'expirationTime' }
]

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  description: ''
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请填写名称', trigger: 'blur' }]
})
// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const clickSave = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: any) => {
    if (valid) {
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const clickCancel = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}
</script>

<style scoped lang="scss">
.create {
  width: 100%;
  .create-tip {
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary);
    padding: 10px;
  }
}
</style>
