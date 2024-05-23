<template>
  <div class="add-rule">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="网络ACL" prop="name">
        <div>{{ form.name }}</div>
      </el-form-item>

      <el-form-item>
        <ideal-table-list
          :table-data="form.ruleList"
          :table-headers="tableHeaders"
          :show-pagination="false"
        >
          <template #type>
            <el-table-column label="类型">
              <template #default="props">
                <el-select v-model="props.row.type">
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

          <template #protocol>
            <el-table-column label="协议">
              <template #default="props">
                <el-select v-model="props.row.protocol">
                  <el-option
                    v-for="(item, idx) of protocolList"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </template>

          <template #originAddress>
            <el-table-column label="源地址">
              <template #default="props">
                <el-select
                  v-model="props.row.originAddressType"
                >
                  <el-option
                    v-for="(item, idx) of originAddressTypes"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>

                <template v-if="props.row.originAddressType === '1'">
                  <el-tooltip
                    :visible="props.row.originVerifyAddress"
                    placement="right"
                  >
                    <template #content>
                      <svg-icon
                        icon="close"
                        class="ideal-svg-margin-right"
                        color="var(--el-color-danger)"
                      ></svg-icon>
                      <span>输入不能为空</span>
                    </template>
                    <el-input
                      v-model="props.row.originAddress"
                      style="margin-top: 5px"
                      @blur="checkOriginAddress(props.row)"
                    />
                  </el-tooltip>
                </template>

                <el-select
                  v-else-if="props.row.originAddressType === '2'"
                  v-model="props.row.aclAddress"
                  style="margin-top: 5px"
                >
                  <el-option
                    v-for="(item, idx) of aclList"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </template>

          <template #originPort>
            <el-table-column label="源端口范围">
              <template #default="props">
                <el-select v-model="props.row.originPort">
                  <el-option
                    v-for="(item, idx) of originPorts"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </template>

          <template #goalAddress>
            <el-table-column label="目的地址">
              <template #default="props">
                <el-select
                  v-model="props.row.goalAddressType"
                >
                  <el-option
                    v-for="(item, idx) of goalAddressTypes"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>

                <template v-if="props.row.goalAddressType === '1'">
                  <el-tooltip
                    :visible="props.row.originVerifyAddress"
                    placement="right"
                  >
                    <template #content>
                      <svg-icon
                        icon="close"
                        class="ideal-svg-margin-right"
                        color="var(--el-color-danger)"
                      ></svg-icon>
                      <span>输入不能为空</span>
                    </template>
                    <el-input
                      v-model="props.row.goalAddress"
                      style="margin-top: 5px"
                      @blur="checkGoalAddress(props.row)"
                    />
                  </el-tooltip>
                </template>

                <el-select
                  v-else-if="props.row.goalAddressType === '2'"
                  v-model="props.row.goalAclAddress"
                  style="margin-top: 5px"
                >
                  <el-option
                    v-for="(item, idx) of aclList"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </template>

          <template #goalPort>
            <el-table-column label="目的端口范围">
              <template #default="props">
                <el-select v-model="props.row.goalPort">
                  <el-option
                    v-for="(item, idx) of goalPorts"
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
        <el-button link type="primary" class="ideal-default-margin-top" @click="clickAddRule"
          >增加1条规则</el-button
        >
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import store from '@/store'
import { ElMessage } from 'element-plus/es'
// import { showLoading, hideLoading } from '@/utils/tool'

interface addRuleProps {
  direction?: string // 操作按钮类型
}
const props = withDefaults(defineProps<addRuleProps>(), {
  direction: ''
})

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  name: 'fw-b4f3', // 安全组
  ruleList: [
    {
      type: 'IPv4',
      policy: 'allow',
      protocol: '',
      originAddressType: '1',
      originAddress: '0.0.0.0/0',
      aclAddress: '',
      goalAddressType: '1',
      goalAddress: '0.0.0.0/0',
      goalAclAddress: '',
      description: '',
      originVerifyPriority: false,
      originVerifyAddress: false,
      goalVerifyPriority: false,
      goalVerifyAddress: false
    }
  ]
})
const rules = reactive<FormRules>({})
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '类型', prop: 'type', useSlot: true },
  { label: '策略', prop: 'policy', useSlot: true },
  { label: '协议', prop: 'protocol', useSlot: true },
  { label: '源地址', prop: 'originAddress', useSlot: true },
  { label: '源端口范围', prop: 'originPort', useSlot: true },
  { label: '目的地址', prop: 'goalAddress', useSlot: true },
  { label: '目的端口范围', prop: 'goalPort', useSlot: true },
  { label: '描述', prop: 'description', useSlot: true }
]
const operateBtns = ref<IdealTableColumnOperate[]>([
  { title: '复制', prop: 'copy' },
  { title: '删除', prop: 'delete', disabled: true, disabledText: '最少一条' }
])
const clickOperateEvent = (
  command: string | number | object,
  index: number
) => {
  if (command === 'delete') {
    form.ruleList.splice(index, 1)
  } else if (command === 'copy') {
    const obj = JSON.parse(JSON.stringify(form.ruleList[index]))
    form.ruleList.push(obj)
  }
}
// 类型
const typeList = [
  { label: 'IPv4', value: 'IPv4' },
  { label: 'IPv6', value: 'IPv6' }
]
// 策略
const policyList = [
  { label: '允许', value: 'allow' },
  { label: '拒绝', value: 'refuse' }
]
// 协议
const protocolList = ref<any[]>([])
// 源地址类型
const originAddressTypes = [
  { label: 'IP地址', value: '1' },
  { label: 'acl', value: '2' }
]
// 源端口范围
const originPorts = ref<any[]>([])
const goalAddressTypes = [
  { label: 'IP地址', value: '1' },
  { label: 'acl', value: '2' }
]
// 目的端口
const goalPorts = ref<any[]>([])
const aclList = ref<any[]>([])

const clickAddRule = () => {
  form.ruleList.push({
    type: 'IPv4',
    policy: 'allow',
    protocol: '',
    originAddressType: '1',
    originAddress: '0.0.0.0/0',
    aclAddress: '',
    goalAddressType: '1',
    goalAddress: '0.0.0.0/0',
    goalAclAddress: '',
    description: '',
    originVerifyPriority: false,
    originVerifyAddress: false,
    goalVerifyPriority: false,
    goalVerifyAddress: false
  })
}
// 监听
watch(
  () => form.ruleList,
  value => {
    operateBtns.value[1].disabled = true
    if (value.length > 1) {
      operateBtns.value[1].disabled = false
    }
  },
  { deep: true }
)

//公共参数
const { resourcePoolInfo, regionInfo } = storeToRefs(store.resourceStore)
const commonParams = () => {
  const params = {
    resourcePoolId: resourcePoolInfo.value?.id,
    poolTypeUuid: resourcePoolInfo.value?.vendorCode,
    regionId: regionInfo.value?.code,
    regionName: regionInfo.value?.name,
    projectId: store.resourceStore.projectId,
    projectUuid: store.resourceStore.cloudProjectId,
    vdcId: store.userStore.user.vdcId,
    vdcCode: store.userStore.user.vdcCode
  }
  return params
}

const checkOriginAddress = (val: any) => {
  val.originVerifyAddress = val.originAddress ? false : true
}
const checkGoalAddress = (val: any) => {
  val.goalVerifyAddress = val.goalAddress ? false : true
}

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
  ElMessage.success('创建成功')
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.add-rule {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
