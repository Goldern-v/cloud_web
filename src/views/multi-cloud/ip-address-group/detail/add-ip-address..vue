<template>
  <div class="create-ip-address-group">
    <el-form ref="formRef" :model="form" label-position="left">
      <el-form-item label="IP地址">
        <el-input
          v-model="form.ip"
          placeholder="每个IP地址组最多可添加300个IP地址或网段"
          type="textarea"
          :autosize="{ minRows: 8, maxRows: 12 }"
          style="font-size: 12px"
        ></el-input>
        <div>
          支持的IP地址格式如下:
          <ul style="margin-left: 15px">
            <li>每行一个IP地址或网段,以回车键换行。</li>
            <li>
              每个IP地址或网段都可以用“|”分隔添加备注,如“192.168.10.10 |
              ECS01”。
            </li>
            <li>备注长度范围是0到255字符,不能包含&lt;&gt;。</li>
          </ul>
        </div>
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
import { EventEnum, OperateEventEnum } from '@/utils/enum'

interface dialogProp {
  type?: OperateEventEnum | undefined // 操作按钮类型
  multipleSelection?: string[] //多选
}

const props = withDefaults(defineProps<dialogProp>(), {
  type: undefined,
  multipleSelection: () => []
})
const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  ip: ''
})

// 方法
interface EmitEvent {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvent>()
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}
//创建/编辑vdc
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
}
</script>

<style scoped lang="scss"></style>
