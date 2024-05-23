<template>
  <div class="add-rule">
    <div class="flex-row add-rule__tip">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <div>
        <div>
          安全组规则对不同规格云服务器的生效情况不同，为了避免您的安全组规则不生效，请您添加规则前，单击此处了解详情。
        </div>
        <div>
          当源地址选择IP地址时，您可以在一个IP地址框内同时输入多个IP地址，一个IP地址对应一条安全组规则。
        </div>
      </div>
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="安全组" prop="ipVersion">
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
                <el-tooltip
                  :visible="props.row.verifyPriority.mark"
                  trigger="click"
                  placement="right"
                >
                  <template #content>
                    <svg-icon
                      icon="close"
                      class="ideal-svg-margin-right"
                      color="var(--el-color-danger)"
                    ></svg-icon>
                    <span>{{ props.row.verifyPriority.text }}</span>
                  </template>
                  <el-input
                    v-model="props.row.priority"
                    placeholder="1-100"
                    oninput="value=value.replace(/[^0-9]/g,'')"
                    @blur="checkPriority(props.row)"
                  />
                </el-tooltip>
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

          <template #port>
            <el-table-column label="端口协议">
              <template #default="props">
                <el-select v-model="props.row.portProtocol">
                  <el-option
                    v-for="(item, idx) of portProtocols"
                    :key="idx"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>

                <div class="flex-row" style="align-items: center">
                  <el-tooltip
                    :visible="props.row.verifyPort.mark"
                    trigger="click"
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
                      v-model="props.row.port"
                      placeholder="1-65535"
                      style="margin-top: 5px"
                      @blur="checkPort(props.row)"
                    />
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </template>

          <template #address>
            <el-table-column label="源地址">
              <template #default="props">
                <el-select
                  v-model="props.row.addressType"
                  @change="addressTypeChange"
                >
                  <el-option
                    v-for="(item, idx) of addressTypes"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>

                <template v-if="props.row.addressType === '1'">
                  <el-tooltip
                    :visible="props.row.verifyAddress.mark"
                    trigger="click"
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
                      v-model="props.row.address"
                      style="margin-top: 5px"
                      @blur="checkAddress(props.row)"
                    />
                  </el-tooltip>
                </template>

                <el-select
                  v-else-if="props.row.addressType === '2'"
                  v-model="props.row.safeAddress"
                  style="margin-top: 5px"
                >
                  <el-option
                    v-for="(item, idx) of safeGroupList"
                    :key="idx"
                    :label="item.name"
                    :value="item.uuid"
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
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { ElMessage } from 'element-plus/es'
import { showLoading, hideLoading } from '@/utils/tool'
import { safeGroupRuleCreate, querySafeGroupList } from '@/api/java/network'

const { t } = useI18n()
interface addRuleProps {
  direction?: string // 操作按钮类型
}
const props = withDefaults(defineProps<addRuleProps>(), {
  direction: ''
})

const addEntryRule = computed(() => props.direction === 'enter') //添加入方向规则

const formRef = ref<FormInstance>()
const form = reactive({
  safeGroup: 'Sys-defaultAccess', // 安全组
  ruleList: [
    {
      priority: '',
      policy: 'allow',
      type: 'IPv4',
      portProtocol: 'TCP',
      port: '',
      addressType: '1',
      address: '0.0.0.0/0',
      description: '',
      verifyPriority: {
        mark: false,
        text: ''
      }, //优先级校验
      verifyAddress: {
        mark: false,
        text: ''
      }, //ip源地址校验
      verifyPort: {
        mark: false,
        text: ''
      } //端口校验
    }
  ]
})
const rules = reactive<FormRules>({})
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
const portProtocols: any = ref(['ICMP', 'TCP', 'UDP', 'ICMPV6'])

// IP地址组
const clickAddRule = () => {
  //优先级校验
  form.ruleList.forEach((ele: any) => {
    checkPriority(ele)
    checkPort(ele)
    checkAddress(ele)
  })
  const priority = form.ruleList.some(ele => ele.verifyPriority.mark === true)
  const address = form.ruleList.some(ele => ele.verifyAddress.mark === true)
  const port = form.ruleList.some(ele => ele.verifyPort.mark === true)
  if (priority || address || port) {
    return
  }
  form.ruleList.push({
    priority: '',
    policy: 'allow',
    type: 'IPv4',
    portProtocol: 'TCP',
    port: '',
    addressType: '1',
    address: '0.0.0.0/0',
    description: '',
    verifyPriority: {
      mark: false,
      text: ''
    }, //优先级校验
    verifyAddress: {
      mark: false,
      text: ''
    }, //ip源地址校验
    verifyPort: {
      mark: false,
      text: ''
    } //端口校验
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

// 源地址类型
const addressTypes = [
  { label: 'IP地址', value: '1' },
  { label: '安全组', value: '2' }
]
const addressTypeChange = (value: string) => {
  if (value === '2') {
    querySafeGroup()
  }
}

// 安全组
const safeGroupList: any = ref([])
const querySafeGroup = () => {
  const params = {
    ...commonParams()
  }
  querySafeGroupList(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      safeGroupList.value = data
    } else {
      safeGroupList.value = []
    }
  })
}

const route = useRoute()
const {
  uuid,
  resourcePoolId,
  regionId,
  projectId,
  vdcId,
  cloudPlatformCategoryCode,
  cloudPlatformTypeCode
} = route.query

//公共参数
const commonParams = () => {
  const params = {
    resourcePoolId,
    regionId,
    projectId
  }
  return params
}
//校验优先级
const checkPriority = (val: any) => {
  let text: string = ''
  if (!val.priority) {
    text = '输入不能为空'
  } else if (val.priority > 100) {
    text = '输入值不能超过100'
  } else {
    text = ''
  }
  val.verifyPriority.mark = text ? true : false
  val.verifyPriority.text = text
}
//校验端口
const checkPort = (val: any) => {
  val.verifyPort.mark = val.port ? false : true
  val.verifyPort.text = val.port ? '' : '输入不能为空'
}
//校验源地址
const checkAddress = (val: any) => {
  val.verifyAddress.mark = val.address ? false : true
  val.verifyAddress.text = val.port ? '' : '输入不能为空'
}

/**
 * 确定/取消
 */
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
  //优先级校验
  form.ruleList.forEach((ele: any) => {
    checkPriority(ele)
    checkPort(ele)
    checkAddress(ele)
  })
  const priority = form.ruleList.some(ele => ele.verifyPriority.mark === true)
  const address = form.ruleList.some(ele => ele.verifyAddress.mark === true)
  const port = form.ruleList.some(ele => ele.verifyPort.mark === true)
  if (priority || address || port) {
    return
  }
  const rules = form.ruleList.map((item: any) => {
    const obj: { [key: string]: any } = {
      direction: addEntryRule.value ? 'ingress' : 'egress',
      protocol: item.portProtocol,
      description: item.description,
      action: item.policy,
      priority: item.priority,
      ethertype: item.type
    }
    if (item.addressType === '1') {
      obj.remote_ip_prefix = item.address
    } else if (item.addressType === '2') {
      obj.remote_group_id = item.safeAddress
    }
    //阿里云和天翼公有云分开传最大端口和最小端口
    if (
      RegExp(/PUBLIC/).test(cloudPlatformCategoryCode as string) &&
      RegExp(/ALI_CLOUD|CTYUN/).test(cloudPlatformTypeCode as string)
    ) {
      const port = item.port.split('-')
      obj.portRangeMin = port[0]
      obj.portRangeMax = port[port.length - 1]
    } else {
      obj.multiport = item.port
    }
    return obj
  })
  const params: { [key: string]: any } = {
    rules,
    securityGroupId: uuid,
    ...commonParams()
  }
  if (
    RegExp(/PUBLIC/).test(cloudPlatformCategoryCode as string) &&
    RegExp(/ALI_CLOUD/).test(cloudPlatformTypeCode as string)
  ) {
    params.vdcId = vdcId
  }
  showLoading('创建中...')
  safeGroupRuleCreate(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        ElMessage.success('创建成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('创建失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
  // }
  return
}
</script>

<style scoped lang="scss">
.add-rule {
  width: 100%;
  .add-rule__tip {
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
