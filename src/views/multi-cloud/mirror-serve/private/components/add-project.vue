<template>
  <div class="add-tenant">
    <div class="flex-row add-tenant__tip">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <span>仅支持区域内共享镜像</span>
    </div>

    <div style="margin: 10px 0">
      请输入共享镜像接受者的项目ID。如果使用多个项目ID，请使用英文逗号间隔。
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="账号" prop="account">
        <div class="flex-column" style="width: 100%">
          <el-input v-model="form.account" type="textarea" style="width: 70%" />

          <!-- <div>镜像可共享租户配额为256，该镜像还可以共享给256个租户。</div> -->
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { mirrorShare } from '@/api/java/compute'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  account: '' // 项目ID
})

const rules = reactive<FormRules>({
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }]
})

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
    if (valid) {
      const route = useRoute()
      const imageId = route.query.id as string
      const params = {
        id: imageId,
        projectIds: form.account.split(',')
      }
      mirrorShare(params).then((res: any) => {
        const { code } = res
        if (code === 200) {
          ElMessage.success('添加成功')
          emit(EventEnum.success)
        } else {
          ElMessage.error('添加失败')
        }
      })
    }
  })
}
</script>

<style scoped lang="scss">
.add-tenant {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    padding-right: 17px;
  }
  .add-tenant__tip {
    background-color: var(--el-color-primary-light-9);
    padding: 10px 20px;
    align-items: center;
  }
  :deep(.el-form-item--default .el-form-item__label) {
    width: 96px;
  }
}
</style>
