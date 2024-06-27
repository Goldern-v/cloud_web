<template>
  <div class="share">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="分享策略">
        <el-radio-group
          v-model="form.policy"
          class="ideal-default-margin-right"
        >
          <el-radio-button
            v-for="(item, index) of policies"
            :key="index"
            :label="item.label"
          >
            {{ item.value }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="文件名">
        <div>{{ fileName }}</div>
      </el-form-item>

      <el-form-item label="URL有效期">
        <div>
          <div class="flex-row">
            <el-input
              v-model="form.time"
              style="width: 150px"
              class="ideal-default-margin-right"
            />

            <el-select
              v-model="form.timeUnit"
              clearable
              placeholder="选择"
              :popper-append-to-body="false"
              class="custom-input ideal-default-margin-right"
            >
              <el-option
                v-for="(item, index) of timeUnits"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="ideal-tip-text">
            URL有效期的提取值范围为1分钟到18小时。
          </div>
          <div class="ideal-tip-text">
            如要分享有效期时长更长的链接，建议使用客户端工具OBS Browser+。
          </div>
        </div>
      </el-form-item>

      <el-form-item label="提取码">
        <el-input
          v-model="form.code"
          placeholder="请输入6位数字提取码"
          style="width: 150px"
        />
      </el-form-item>

      <el-form-item label="链接信息">
        <el-radio-group v-model="form.link" class="ideal-default-margin-right">
          <el-radio-button
            v-for="(item, index) of links"
            :key="index"
            :label="item.label"
          >
            {{ item.value }}
          </el-radio-button>
        </el-radio-group>
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

interface ShareProps {
  rowData?: any
}
const props = withDefaults(defineProps<ShareProps>(), {
  rowData: null
})

const { t } = useI18n()

const fileName = ref('')
onMounted(() => {
  fileName.value = props.rowData?.name || ''
})

const formRef = ref<FormInstance>()
const form = reactive({
  policy: 'code', // 分享策略
  time: '', // URL有效期
  timeUnit: '',
  code: '', // 提取码
  link: '' // 链接信息
})
const rules = reactive<FormRules>({})
// 分享策略
const policies = [
  { label: 'code', value: '提取码分享' },
  { label: 'direct', value: '直接分享' }
]
const timeUnits = [
  { label: '分钟', value: 'min' },
  { label: '小时', value: 'hour' }
]
const links = [{ label: 'create', value: '创建分享' }]
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
    emit(EventEnum.success)
  })
}
</script>

<style scoped lang="scss">
.share {
  width: 100%;
}
</style>
