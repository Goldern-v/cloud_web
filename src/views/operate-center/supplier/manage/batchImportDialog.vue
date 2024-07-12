<template>
  <el-dialog
    v-model="dialogVisible"
    width="40%"
    :append-to-body="true"
    :before-close="handleClose"
    :show-close="false"
  >
    <template #header="{ titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">批量信息导入</h4>
        <div class="down-icon" @click="downloadFile">
          <el-icon><Download /></el-icon>
          下载模板
        </div>
      </div>
    </template>
    <el-form ref="formRef" :model="form" label-position="left" label-width="70">
      <el-form-item label="文件上传" prop="vpcName">
        <el-upload
          ref="uploadRef"
          class="upload-Sty"
          drag
          action="#"
          :auto-upload="false"
          :http-request="handleUpload"
          accept=".xlsx"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
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
  </el-dialog>
</template>

<script setup lang="ts">
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import type { FormInstance } from 'element-plus'
import { Download, UploadFilled } from '@element-plus/icons-vue'
import type { UploadInstance } from 'element-plus'
import { supplierExcelImport } from '@/api/java/operate-center'
import { ElMessage } from 'element-plus/es'
const uploadRef = ref<UploadInstance>()

const { t } = useI18n()

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined | string // 操作按钮类型
  //   rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  //   rowData: null
})

const form = {
  remark: ''
}
// 弹框
// const dialogTitle = ref('')
const dialogVisible = ref(true)

// 下载
const downloadFile = () => {
  // window.location.href = 'http://10.8.0.208:18884' + /images/ + props.type;
  window.location.href = `/images/${props.type}`
}
// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const formRef = ref<FormInstance>()
//取消
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  dialogVisible.value = false
  emit(EventEnum.close)
}
// 上传文件
const handleUpload = async (file: any) => {
  const fd = new FormData()
  fd.append('file', file.file)
  // 这里是请求上传接口
  // const data: any =
  await supplierExcelImport(fd)
    .then(res => {
      if (res.data == '' || res.data == null) {
        ElMessage.success('导入成功')
        emit(EventEnum.refresh)
      } else {
        ElMessage.error(res.data || '导入失败')
      }
    })
    .catch(err => {
      ElMessage.error(err.data || '导入失败')
    })
  // return data
}
//确定
const submitForm = (formEl: FormInstance | undefined) => {
  uploadRef.value?.submit()
}

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
</script>

<style scoped lang="scss">
.my-header {
  display: flex;
  justify-content: space-between;
}
.down-icon {
  cursor: pointer;
  color: var(--el-color-primary);
}
.upload-Sty {
  width: 100%;
}
</style>
