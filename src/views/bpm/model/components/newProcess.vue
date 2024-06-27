<template>
  <div class="new">
    <el-form
      ref="newFormRef"
      :model="newForm"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="流程标识" prop="key">
        <el-input
          v-model="newForm.key"
          class="custom-input"
          placeholder="请输入流程标识"
        />
      </el-form-item>
      <el-form-item label="流程名称" prop="name">
        <el-input
          v-model="newForm.name"
          class="custom-input"
          placeholder="请输入流程名称"
        />
      </el-form-item>
      <el-form-item label="流程描述" prop="description">
        <el-input
          v-model="newForm.description"
          class="custom-input"
          placeholder="请输入流程描述"
        />
      </el-form-item>
    </el-form>

    <div class="flex-row vpc-button--new">
      <el-button type="info" @click="cancelForm(newFormRef)">取消</el-button>
      <el-button
        v-loading="formLoading"
        type="primary"
        @click="submitForm(newFormRef)"
        >确认</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { createModel } from '@/api/java/bpm/model'
import { EventEnum } from '@/utils/enum'
import { FormVO } from '@/types/bpm-form'
import { encodeConf, encodeFields } from '@/utils/form-create'
import { bpmFormCreate, bpmFormUpdate } from '@/api/java/bpm/form'

interface CreateProps {
  rowData?: any
}

const props = withDefaults(defineProps<CreateProps>(), {
  rowData: () => ({})
})
const formLoading = ref(false) // 表单的加载中:提交的按钮禁用

const newFormRef = ref<FormInstance>()
const newForm = reactive({
  name: '',
  key: '',
  description: ''
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
  key: [{ required: true, message: '请输入流程标识', trigger: 'change' }]
})

onMounted(() => {})

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
    formLoading.value = true
    try {
      const data: any = newForm
      createModel(data)
        .then((res: any) => {
          let data = res
          if (data.code === 200) {
            const content =
              '<p><span style="font-weight: 600">新建模型成功！</span>后续需要执行如下 4 个步骤:<br/>' +
              '1. 点击【修改流程】按钮，配置流程的分类、表单信息<br/>' +
              '2. 点击【设计流程】按钮，绘制流程图<br/>' +
              '3. 点击【分配规则】按钮，设置每个用户任务的审批人<br/>' +
              '4. 点击【发布流程】按钮，完成流程的最终发布<br/>' +
              '另外，每次流程修改后，都需要点击【发布流程】按钮，才能正式生效！！！</p>'
            ElMessageBox.alert(content, '重要提示', {
              type: 'success',
              dangerouslyUseHTMLString: true
            })
            ElMessage.success('新建模型成功')
            emit(EventEnum.success)
          }
        })
        .catch((err: any) => {
          console.log('新建模型失败')
        })
    } finally {
      formLoading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.new {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .new__tip {
    background-color: var(--custom-information-bg-color);
    align-items: center;
    padding: 20px;
    margin-bottom: 10px;
    border-radius: $circleRadiusSize;
  }
  .vpc-button--new {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
