<template>
  <div class="create-certificate">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="证书类型">
        <el-radio-group v-model="form.type">
          <el-radio-button
            v-for="item of typeList"
            :key="item.label"
            type="text"
            :label="item.label"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <template v-if="form.type === 'server'">
        
        <el-form-item label="证书来源">
          <div class="flex-column">
            <el-radio-group v-model="form.source">
              <el-radio
                v-for="item of sourceList"
                :key="item.label"
                type="text"
                :label="item.label"
              >
                {{ item.name }}
              </el-radio>
            </el-radio-group>
            <div class="ideal-tip-text">
              <span v-show="form.source === 'scm'"
                >SSL证书管理服务提供的服务器数字证书。</span
              >
              <span v-show="form.source === 'self'"
                >用户自有服务器数字证书。</span
              >
            </div>
          </div>
        </el-form-item>

        <template v-if="form.source === 'scm'">
          <el-form-item label="证书">
            <div class="flex-column">
              <div>
                <el-select
                  v-model="form.certificate"
                  placeholder="请选择"
                  class="ideal-default-margin-right"
                >
                  <el-option
                    v-for="(item, idx) of certificateList"
                    :key="idx"
                    :label="item.name"
                    :value="item.uuid"
                  >
                  </el-option>
                </el-select>
                <svg-icon icon="refresh-icon"></svg-icon>
              </div>
              <div class="ideal-tip-text">
                您需要在<el-text type="primary">SSL证书管理</el-text
                >服务签发证书或者上传自有证书，弹性负载均衡才能进行使用。
              </div>
            </div>
          </el-form-item>
        </template>
      </template>

      <template v-if="form.source === 'self' || form.type === 'ca'">
        <el-form-item label="证书名称">
          <el-input v-model="form.name" class="custom-input-width"></el-input>
        </el-form-item>

        <el-form-item label="证书内容">
          <el-input
            v-model="form.content"
            :placeholder="certificateFormat"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            class="custom-input-width"
            style="font-size: 12px; margin-bottom: 10px"
          ></el-input>
          <svg-icon
            icon="question-icon"
            class="ideal-svg-margin-left"
          ></svg-icon>
          <div class="flex-row ideal-default-margin-top">
            <el-button>上传</el-button>
            <div class="custom-example-text">样例参考</div>
            <svg-icon
              icon="copy-icon"
              class="ideal-svg-margin-left"
              @click="clickCopy"
            ></svg-icon>
          </div>
          <div class="flex-column"></div>
        </el-form-item>

        <el-form-item
          v-if="form.source === 'self' && form.type !== 'ca'"
          label="私钥"
        >
          <el-input
            v-model="form.privateKey"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            class="custom-input-width"
            style="font-size: 12px; margin-bottom: 10px"
          ></el-input>
          <svg-icon
            icon="question-icon"
            class="ideal-svg-margin-left"
          ></svg-icon>
          <div class="flex-row ideal-default-margin-top">
            <el-button>上传</el-button>
            <div class="custom-example-text">样例参考</div>
            <svg-icon
              icon="copy-icon"
              class="ideal-svg-margin-left"
              @click="clickCopy"
            ></svg-icon>
          </div>
          <div class="flex-column"></div>
        </el-form-item>
      </template>

      <el-form-item v-if="form.type === 'server'" label="域名">
        <el-input
          v-model="form.domain"
          :disabled="form.source === 'scm'"
          class="custom-input-width"
        ></el-input>
        <div class="ideal-tip-text">如果该证书用于SNI，则需要指定域名。</div>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.remark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          maxlength="255"
          show-word-limit
          class="custom-input-width"
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
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import { generateCode } from '@/utils/tool'
import { clickCopy } from '@/utils/tool'
interface dialogProp {
  type?: OperateEventEnum | undefined // 操作按钮类型
  rowData?: object //行数据
}

const props = withDefaults(defineProps<dialogProp>(), {
  type: undefined,
  rowData: () => ({})
})

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  type: 'server', //类型
  source: 'scm', //来源
  certificate: '', //证书
  domain: '', //域名
  remark: '',
  name: 'cert-' + generateCode(4),
  content: '',
  privateKey: ''
})

const certificateFormat = ref(
  '证书内容格式:\n以"-----BEGIN CERTIFICATE-----"作为开头,"-----END CERTIFICATE"-----作为结尾，每行64字符，最后一行不超过64字符，不能有空行。'
)

const rules = reactive<FormRules>({
  elbName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})

const typeList = ref([
  { label: 'server', name: '服务器证书' },
  { label: 'ca', name: 'CA证书' }
])

const sourceList = ref([
  { label: 'scm', name: 'SCM证书' },
  { label: 'self', name: '自有证书' }
])

const certificateList: any = ref([])

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
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.create-certificate {
  .custom-example-text {
    text-decoration: underline dotted;
    text-align: center;
    margin-left: 10px;
    color: $gray7-light;
    cursor: pointer;
  }
  .custom-input-width {
    width: 95%;
  }
}
</style>
