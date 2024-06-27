<template>
  <div class="key-pair-bind">
    <div class="flex-row key-pair-bind__tip">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <span
        >系统将对服务器进行密钥对配置，执行此操作后可直接使用密钥登录服务器。出于安全考虑，建议关闭服务器的密码登录方式，只使用密钥登录服务器。</span
      >
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item v-if="isMultiple" label="操作类型">
        <div class="flex-column">
          <el-radio-group
            v-model="form.type"
            class="ideal-default-margin-right"
          >
            <el-radio-button label="1">一键绑定</el-radio-button>
            <el-radio-button label="2">单独绑定</el-radio-button>
          </el-radio-group>

          <div v-if="isOnekey">
            适用于多个需要绑定的云服务器root密码均相同，可一键选择密钥对并输入密码。
          </div>
          <div v-else>
            适用于多个需要绑定的云服务器root密码不同，可一键选择密钥对并输入不同服务器的root密码。
          </div>
        </div>
      </el-form-item>

      <el-form-item label="密钥对" prop="keyPair">
        <el-select v-model="form.keyPair" class="input-width">
          <el-option
            v-for="(item, index) of keyPairList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="isMultiple && isOnekey" label="root密码" prop="root">
        <el-input
          v-model="form.root"
          type="password"
          show-password
          class="input-width"
        />
      </el-form-item>

      <el-form-item v-if="isMultiple && isOnekey" label="端口" prop="port">
        <el-input v-model="form.port" class="input-width" />
      </el-form-item>
    </el-form>

    <ideal-table-list
      :table-data="table.dataArray"
      :table-headers="table.headers"
      :show-pagination="false"
      style="padding: 0px 17px"
    >
      <template #status>
        <el-table-column label="状态" width="100">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.status"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <template #keyPair>
        <el-table-column label="密钥对" width="180">
          <template #default="props">
            <el-select v-model="props.row.keyPair" disabled class="input-width">
              <el-option
                v-for="(item, index) of keyPairList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </template>

      <template #root>
        <el-table-column label="root密码" width="180">
          <template #default="props">
            <el-input
              v-model="props.row.root"
              type="password"
              :disabled="isMultiple && isOnekey"
              show-password
            />
          </template>
        </el-table-column>
      </template>

      <template #port>
        <el-table-column label="端口" width="80">
          <template #default="props">
            <el-input
              v-model="props.row.port"
              :disabled="isMultiple && isOnekey"
            />
          </template>
        </el-table-column>
      </template>

      <template #close>
        <el-table-column label="关闭" width="60">
          <template #default="props">
            <el-checkbox v-model="props.row.close" />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row flex-row-center">
      <el-checkbox
        v-model="collocation"
        label="我同意讲密钥对私钥托管到理想多云。"
      />
      <div class="ideal-theme-text">了解详情</div>
    </div>
    <div class="flex-row flex-row-center">
      <el-checkbox v-model="agree" label="我已经阅读并同意" />
      <div class="ideal-theme-text">《密钥对管理服务免责声明》</div>
    </div>

    <div class="flex-row footer-button">
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
interface BindProps {
  dataList?: any[]
}
const props = withDefaults(defineProps<BindProps>(), {
  dataList: () => []
})
// 表单
const formRef = ref<FormInstance>()
const form = reactive({
  type: '1', // 操作类型
  keyPair: '', // 密钥对
  root: '', // root密码
  port: '' // 端口
})
const rules = reactive<FormRules>({
  keyPair: [{ required: true, message: '请选择密钥对', trigger: 'blur' }],
  root: [{ required: true, message: '请输入root密码', trigger: 'blur' }],
  port: [{ required: true, message: '请输入端口', trigger: 'blur' }]
})
// true多个云服务器选择一键绑定还是单独绑定 false默认单独绑定
const isMultiple = computed(() => props.dataList.length > 1)
// 密钥对
const keyPairList: any = ref([
  { label: '1', value: '1' },
  { label: '2', value: '2' }
])

const collocation = ref(false)
const agree = ref(false)
// 是否一键绑定
const isOnekey = computed(() => form.type === '1')

onMounted(() => {
  initTableData()
})
const initTableData = () => {
  table.dataArray = props.dataList.map((item: any) => {
    item.name = item.name
    item.ip = item.privateIp
    item.status = item.status
    item.keyPair = ''
    item.root = ''
    item.port = ''
    item.close = false
    return item
  })
}
// 列表
const table = reactive({
  dataArray: [] as any[],
  headers: [] as IdealTableColumnHeaders[]
})
table.headers = [
  { label: 'ECS名称', prop: 'name' },
  { label: 'IP', prop: 'ip' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '密钥对', prop: 'keyPair', useSlot: true },
  { label: 'root密码', prop: 'root', useSlot: true },
  { label: '端口', prop: 'port', useSlot: true },
  { label: '关闭', prop: 'close', useSlot: true }
]
watch(
  () => [form.keyPair, form.root, form.port],
  (newValue, oldValue) => {
    if (newValue[0] !== oldValue[0]) {
      table.dataArray.forEach((item: any) => (item.keyPair = newValue[0]))
    }
    if (newValue[1] !== oldValue[1]) {
      table.dataArray.forEach((item: any) => (item.root = newValue[1]))
    }
    if (newValue[2] !== oldValue[2]) {
      table.dataArray.forEach((item: any) => (item.port = newValue[2]))
    }
  }
)
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
.key-pair-bind {
  width: 100%;
  .flex-row-center {
    align-items: center;
    margin: 0 17px;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    padding-right: 17px;
  }
  .input-width {
    width: 70%;
  }
  .key-pair-bind__tip {
    background-color: var(--el-color-primary-light-9);
    padding: 10px 20px;
    align-items: center;
    margin: 0 17px;
  }
}
</style>
