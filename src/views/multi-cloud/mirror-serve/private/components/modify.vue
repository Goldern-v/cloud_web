<template>
  <div class="modify">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="input-width" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.description"
          type="textarea"
          class="input-width"
          maxlength="1024"
          show-word-limit
        />
      </el-form-item>

      <!-- <el-form-item label="最小内存">
        <div class="flex-column">
          <div class="ideal-error-text">扩大镜像最小内存后，如果需要对原镜像创建的云服务器进行重装操作系统，需要修改镜像最小内存至原始值。</div>
          <el-radio-group v-model="form.minRam">
            <el-radio-button
              v-for="(item, index) of minRamArray"
              :key="index"
              :label="item.label"
              >{{ item.value }}</el-radio-button
            >
          </el-radio-group>
        </div>
      </el-form-item>

      <el-form-item label="最大内存">
        <el-radio-group v-model="form.maxRam">
          <el-radio-button
            v-for="(item, index) of maxRamArray"
            :key="index"
            :label="item.label"
            >{{ item.value }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item label="网卡多队列">
        <el-radio-group v-model="form.multiQueue">
          <el-radio-button label="1">支持</el-radio-button>
          <el-radio-button label="2">不支持</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="启动方式">
        <div class="flex-column">
          <el-radio-group v-model="form.mode">
            <el-radio-button label="1">BIOS</el-radio-button>
            <el-radio-button label="2">UEFI</el-radio-button>
          </el-radio-group>

          <div class="ideal-tip-text">请确保选择的启动方式与镜像文件中的启动方式一致，否则，使用该镜像创建的弹性云服务器无法启动。</div>
        </div>
      </el-form-item> -->
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
import { privateMirrorEdit } from '@/api/java/compute'

const { t } = useI18n()

interface ModifyProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<ModifyProps>(), {
  rowData: null
})

onMounted(() => {
  if (props.rowData) {
    form.name = props.rowData.name
    form.description = props.rowData.description
  }
})

// 表单
const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 名称
  description: '', // 描述
  minRam: '', // 最小内存
  maxRam: '', // 最大内存
  multiQueue: '', // 网卡多队列
  mode: '' //启动方式
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})
// 最小内存
const minRamArray = [
  { label: '1', value: '不支持' },
  { label: '2', value: '1GiB' },
  { label: '3', value: '2GiB' },
  { label: '4', value: '4GiB' },
  { label: '5', value: '8GiB' },
  { label: '6', value: '16GiB' },
  { label: '7', value: '32GiB' },
  { label: '8', value: '64GiB' },
  { label: '9', value: '128GiB' }
]
// 最大内存
const maxRamArray = [
  { label: '1', value: '不支持' },
  { label: '2', value: '4GiB' },
  { label: '3', value: '32GiB' },
  { label: '4', value: '64GiB' },
  { label: '5', value: '128GiB' }
]
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
    handleEdit()
  })
}
const handleEdit = () => {
  const params = {
    id: props.rowData.id,
    name: form.name,
    description: form.description
  }
  privateMirrorEdit(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('编辑成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('编辑失败')
    }
  })
}
</script>

<style scoped lang="scss">
.modify {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    padding-right: 17px;
  }
  .input-width {
    width: 100%;
  }
}
</style>
