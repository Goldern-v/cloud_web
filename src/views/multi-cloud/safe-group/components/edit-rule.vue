<template>
  <div class="edit-rule">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="安全组">
        <div>{{ form.safeGroup }}</div>
      </el-form-item>

      <el-form-item>
        <ideal-table-list
          :table-data="form.ruleList"
          :table-headers="tableHeaders"
          :show-pagination="false"
        >
          <template #priority>
            <el-table-column label="优先级">
              <template #default="props">
                <el-input
                  v-model="props.row.priority"
                  placeholder="1-100"
                  oninput="value=value.replace(/[^0-9]/g,'')"
                />
              </template>
            </el-table-column>
          </template>

          <template #policy>
            <el-table-column label="策略">
              <template #default="props">
                <el-select v-model="props.row.policy">
                  <el-option
                    v-for="(item, idx) of policyList"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </template>

          <template #type>
            <el-table-column label="类型">
              <template #default="props">
                <el-select v-model="props.row.type" disabled>
                  <el-option
                    v-for="(item, idx) of typeList"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </template>

          <template #port>
            <el-table-column label="端口协议">
              <template #default="props">
                <el-select v-model="props.row.portProtocol">
                  <el-option
                    v-for="(item, idx) of portProtocols"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>

                <el-input
                  v-model="props.row.port"
                  placeholder="1-65535"
                  style="margin-top: 5px"
                  oninput="value=value.replace(/[^0-9]/g,'')"
                />
              </template>
            </el-table-column>
          </template>

          <template #address>
            <el-table-column label="源地址">
              <template #default="props">
                <el-select v-model="props.row.addressType">
                  <el-option
                    v-for="(item, idx) of addressTypes"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>

                <el-input
                  v-if="props.row.addressType === '1'"
                  v-model="props.row.address"
                  style="margin-top: 5px"
                />

                <el-select
                  v-else-if="props.row.addressType === '2'"
                  v-model="props.row.address"
                  style="margin-top: 5px"
                >
                  <el-option
                    v-for="(item, idx) of safeGroupList"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>

                <el-select
                  v-else
                  v-model="props.row.address"
                  style="margin-top: 5px"
                >
                  <el-option
                    v-for="(item, idx) of ipAddresses"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </template>

          <template #description>
            <el-table-column label="描述">
              <template #default="props">
                <el-input v-model="props.row.description" />
              </template>
            </el-table-column>
          </template>

          <template #operation>
            <el-table-column label="操作" width="125">
              <template #default="props">
                <ideal-table-operate
                  :buttons="operateBtns"
                  @clickMoreEvent="clickOperateEvent($event, props.$index)"
                >
                </ideal-table-operate>
              </template>
            </el-table-column>
          </template>
        </ideal-table-list>
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
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { isEmpty } from '@/utils/is'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'

const { t } = useI18n()
interface EditRuleProp {
  rowData?: any
}
const props = withDefaults(defineProps<EditRuleProp>(), {
  rowData: () => ({})
})

const formRef = ref<FormInstance>()
const form = reactive({
  safeGroup: 'Sys-defaultAccess', // 安全组
  ruleList: [] as any[]
})
const rules = reactive<FormRules>({})

onMounted(() => {
  if (!isEmpty(props.rowData)) {
    form.ruleList = [props.rowData]
  }
})
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '优先级', prop: 'priority', useSlot: true },
  { label: '策略', prop: 'policy', useSlot: true },
  { label: '类型', prop: 'type', useSlot: true },
  { label: '端口协议', prop: 'port', useSlot: true },
  { label: '源地址', prop: 'address', useSlot: true },
  { label: '描述', prop: 'description', useSlot: true }
]
const operateBtns = ref<IdealTableColumnOperate[]>([
  { title: '确认', prop: 'submit' },
  { title: '取消', prop: 'cancel' }
])
const clickOperateEvent = (
  command: string | number | object,
  index: number
) => {
  if (command === 'submit') {
  } else if (command === 'cancel') {
  }
}
// 策略
const policyList = [
  { label: '允许', value: 'allow' },
  { label: '拒绝', value: 'refuse' }
]
// 类型
const typeList = [
  { label: 'IPv4', value: 'IPv4' },
  { label: 'IPv6', value: 'IPv6' }
]
// 端口协议
const portProtocols: any = ref([])
// 源地址
const addressTypes = [
  { label: 'IP地址', value: '1' },
  { label: '安全组', value: '2' },
  { label: 'IP地址组', value: '3' }
]
// 安全组
const safeGroupList: any = []
// IP地址组
const ipAddresses: any = []
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
.edit-rule {
  width: 100%;
  .edit-rule__tip {
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary);
    padding: 10px;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
