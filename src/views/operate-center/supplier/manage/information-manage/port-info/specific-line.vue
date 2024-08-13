<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="专线价格" prop="price">
        <div class="flex-row" style="width: 70%">
          <el-form-item prop="NRC" class="flex-row">
            <div class="flex-row"><el-input v-model="form.nrc" />/NRC，</div>
          </el-form-item>
          <el-form-item prop="MRC">
            <div class="flex-row"><el-input v-model="form.mrc" />/MRC</div>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="专线方案" prop="option">
        <el-input v-model="form.option" :rows="4" type="textarea" />
        <el-upload
          ref="uploadRef"
          class="upload-Sty"
          action="#"
          :auto-upload="false"
          :http-request="handleUpload"
          accept=".doc,.docx,.pdf,.ppt,.pptx"
          :limit="1"
        >
          <template #trigger>
            <div class="add_option">
              <svg-icon
                icon="circle-add"
                color="var(--el-color-primary)"
              ></svg-icon>
              上传附件
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { Plus } from '@element-plus/icons-vue'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage, UploadInstance } from 'element-plus'
const uploadRef = ref<UploadInstance>()
const { t } = useI18n()
const formRef = ref<FormInstance>() // 校验表单
const form: { [key: string]: any } = reactive({
  nrc: '',
  mrc: ''
})
const rules = reactive<FormRules>({})
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}

// 上传文件
const handleUpload = async (file: any) => {
  //   const fd = new FormData()
  //   fd.append('file', file.file)
  //   // 这里是请求上传接口
  //   // const data: any =
  //   await supplierExcelImport(fd)
  //     .then(res => {
  //       if (res.data === '' || res.data == null) {
  //         ElMessage.success('导入成功')
  //         emit(EventEnum.refresh)
  //       } else {
  //         ElMessage.error(res.data || '导入失败')
  //       }
  //     })
  //     .catch(err => {
  //       ElMessage.error(err.data || '导入失败')
  //     })
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  //   uploadRef.value?.submit()
  //   formEl.validate(async valid => {
  //     if (valid) {
  //       const params: { [key: string]: any } = {
  //         portType: 'SPECIALIZED',
  //         nodeId: form.nodeId,
  //         equipmentId: form.equipmentId
  //       }
  //         params.specializedPortItems = form.portData.map((item: any) => {
  //           return {
  //             portName: item.portName,
  //             portSpeed: item.portSpeed,
  //             portUuid: item.uuid
  //           }
  //         })
  //         showLoading('创建中...')
  //         portAdd(params)
  //           .then((res: any) => {
  //             if (res.code === 200) {
  //               ElMessage.success('创建专用端口成功')
  //               emit(EventEnum.success)
  //             } else {
  //               ElMessage.error('创建专用端口失败')
  //             }
  //             hideLoading()
  //           })
  //           .catch((err: any) => {
  //             hideLoading()
  //           })
  //     }
  //   })
}
</script>
<style lang="scss" scoped>
.flex-row {
  display: flex;
}
.input-width {
  width: 30%;
}
.add_option {
  cursor: pointer;
  color: var(--el-color-primary);
}
</style>
