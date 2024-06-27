<template>
  <div class="copy-multi">
    <div class="flex-row copy-multi-tip">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <span>复制的镜像大小不能超过128GiB。</span>
    </div>

    <div class="ideal-middle-margin-top ideal-middle-margin-bottom">
      已选去{{ selectionList?.length }}个可跨域复制的镜像。
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

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="名称">
        <el-input v-model="form.name" style="width: 70%" />
      </el-form-item>

      <el-form-item label="目的项目" prop="project">
        <el-select v-model="form.project" style="width: 70%">
          <el-option
            v-for="(item, index) of projectList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.description"
          type="textarea"
          style="width: 70%"
          maxlength="1024"
          show-word-limit
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
  name: '', // 名称
  project: '', // 目的项目
  description: ''
})
const rules = reactive<FormRules>({
  project: [{ required: true, message: '请选择目的项目', trigger: 'blur' }]
})
const projectList = ref<any[]>([])
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
.copy-multi {
  width: 100%;
  .copy-multi-tip {
    border: 1px solid var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    padding: 10px;
  }
}
</style>
