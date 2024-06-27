<template>
  <div class="share-multi">
    <div class="flex-row share-multi-tip">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <span>仅支持区域内共享镜像。</span>
    </div>

    <div class="ideal-middle-margin-top ideal-middle-margin-bottom">
      已选去{{ selectionList?.length }}个可共享镜像。
    </div>

    <ideal-table-list
      class="ideal-middle-margin-bottom"
      :table-data="selectData"
      :table-headers="tableHeaders"
      :show-pagination="false"
      :is-multiple="true"
      style="padding: 0px 17px"
      @handleSelectionChange="selectionChangeHandle"
    ></ideal-table-list>

    <div class="ideal-middle-margin-top ideal-middle-margin-bottom">
      请输入接受者的账号，接受者接受相关信息后，可以使用系统镜像创建云服务器和使用数据盘镜像创建数据盘。
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="项目ID" prop="projectId">
        <el-input
          v-model="form.projectId"
          type="textarea"
          class="input-width"
        />
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()

interface CopyProps {
  selectData?: any[]
}
withDefaults(defineProps<CopyProps>(), {
  selectData: () => []
})

// 表单
const formRef = ref<FormInstance>()
const form = reactive({
  projectId: '' // 目的项目
})
const rules = reactive<FormRules>({
  projectId: [{ required: true, message: '请输入项目ID', trigger: 'blur' }]
})
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '操作系统', prop: 'osVersion' }
]

// 多选镜像
const selectionList = ref<any[]>([])
// 多选时镜像列表
const selectionChangeHandle = (selection: any[]) => {
  selectionList.value = selection
}
// 方法
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
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    console.log('submit!')
    emit(EventEnum.success)
  })
}
</script>

<style scoped lang="scss">
.share-multi {
  width: 100%;
  .share-multi-tip {
    border: 1px solid var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    padding: 10px;
  }
}
</style>
