<template>
  <div class="acl-add-rule">
    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #direction>
        <el-table-column label="方向" width="120px">
          <template #default="props">
            <el-select
              v-model="props.row.direction"
              placeholder="请选择"
              :disabled="type === 'setRule'"
              @change="directionChange"
            >
              <el-option
                v-for="item in directionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </template>

      <template #action>
        <el-table-column label="策略" width="120px">
          <template #default="props">
            <el-select
              v-model="props.row.action"
              placeholder="请选择"
              :disabled="props.row.noEdit"
            >
              <el-option
                v-for="item in strategyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </template>

      <template #protocol>
        <el-table-column label="协议" width="120px">
          <template #default="props">
            <el-select
              v-model="props.row.protocol"
              placeholder="请选择"
              :disabled="props.row.noEdit"
              @change="changeProtocol($event, props.$index)"
            >
              <el-option
                v-for="item in protocolList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </template>

      <template #address>
        <el-table-column label="地址和掩码" width="560px">
          <template #default="props">
            <div class="flex-row acl-ip-address">
              <span class="title">源地址：</span>
              <ideal-ip-input
                :ip-value="props.row.sourceIpAddress"
                port-split="/"
                @listenChange="(val: any) => (props.row.sourceIpAddress = val)"
              ></ideal-ip-input>
            </div>
            <div class="flex-row acl-ip-address">
              <span class="title">目标地址：</span>
              <ideal-ip-input
                :ip-value="props.row.destinationIpAddress"
                port-split="/"
                @listenChange="(val: any) => (props.row.destinationIpAddress = val)"
              ></ideal-ip-input>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #port>
        <el-table-column label="端口范围" width="260px">
          <template #default="props">
            <div
              v-if="
                props.row.protocol === 'icmp' || props.row.protocol === 'all'
              "
            >
              <div>--</div>
              <div>--</div>
            </div>
            <div v-else>
              <div class="flex-row acl-port">
                <el-input-number
                  v-model="props.row.port1"
                  :disabled="props.row.noEdit"
                  controls-position="right"
                  :min="1"
                  :max="65535"
                  @change="listenPort(props.row)"
                ></el-input-number>
                <span>-</span>
                <el-input-number
                  v-model="props.row.port2"
                  :disabled="props.row.noEdit"
                  controls-position="right"
                  :min="parseInt(props.row.port1)"
                  :max="65535"
                  @change="listenPort(props.row)"
                ></el-input-number>
                <el-tooltip
                  content="0.0.0.0/0表示所有IP地址。源(目的)地址处于同一子网下时，该条网络ACL规则不生效。"
                  placement="right"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              <div class="flex-row acl-port">
                <el-input-number
                  v-model="props.row.port3"
                  :disabled="props.row.noEdit"
                  controls-position="right"
                  :min="1"
                  :max="65535"
                  @change="listenPort(props.row)"
                ></el-input-number>
                <span>-</span>
                <el-input-number
                  v-model="props.row.port4"
                  :disabled="props.row.noEdit"
                  controls-position="right"
                  :min="parseInt(props.row.port3)"
                  :max="65535"
                  @change="listenPort(props.row)"
                ></el-input-number>
                <el-tooltip
                  content="0.0.0.0/0表示所有IP地址。源(目的)地址处于同一子网下时，该条网络ACL规则不生效。"
                  placement="right"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #description>
        <el-table-column label="描述" width="185">
          <template #default="props">
            <el-input
              v-model="props.row.description"
              type="textarea"
              class="custom-input"
            />
          </template>
        </el-table-column>
      </template>

      <template v-if="isAddRule" #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <el-button text @click="handleDelete(props.row, props.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div v-if="isAddRule" class="acl-container--add">
      <el-button
        :disabled="noAvailable"
        text
        class="acl-container-add-button"
        @click="handleAddRule"
        >增加一条规则</el-button
      >
      <span
        >您还可以添加{{ ingressNumber + egressNumber }}条规则(入方向{{
          ingressNumber
        }}，出方向{{ egressNumber }})</span
      >
    </div>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelBtn">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitBtn">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '方向', prop: 'direction', useSlot: true },
  { label: '策略', prop: 'action', useSlot: true },
  { label: '协议', prop: 'protocol', useSlot: true },
  { label: '地址和掩码', prop: 'address', useSlot: true },
  { label: '端口范围', prop: 'port', useSlot: true },
  { label: '描述', prop: 'description', useSlot: true }
]

interface RuleProp {
  type: OperateEventEnum | string | undefined
  rowData?: any
}
const props = withDefaults(defineProps<RuleProp>(), {
  rowData: () => ({})
})

const isAddRule = computed(() => props.type === 'addRule') // 添加规则
const isSetRule = computed(() => props.type === 'setRule') // 配置规则

// 列表数据
const tableData = ref<any>([])

const ingressNumber = ref(0) // 可添加入规则数
const egressNumber = ref(0) // 可添加出规则数
const noAvailable = computed(
  () => ingressNumber.value === 0 && egressNumber.value === 0
) // 是否还有规则可添加

onMounted(() => {
  if (isAddRule.value) {
    tableData.value = [
      {
        direction: 'ingress', //props.rowData.ruleInCount < 10 ? 'ingress' : 'egress',
        action: 'accept',
        protocol: 'tcp',
        noEdit: false,
        description: '',
        sourceIpAddress: '0.0.0.0/0',
        destinationIpAddress: '0.0.0.0/0',
        port1: 20,
        port2: 60,
        port3: 20,
        port4: 60
      }
    ]
    // ingressNumber.value =
    // props.rowData.ruleInCount < 10 ? 9 - props.rowData.ruleInCount : 0
    // egressNumber.value =
    //   props.rowData.ruleInCount < 10
    //     ? 10 - props.rowData.ruleOutCount
    //     : 9 - props.rowData.ruleOutCount
    ingressNumber.value = 4
    egressNumber.value = 5
  } else if (isSetRule.value) {
    if (!props.rowData) {
      return
    }
    let ruleList = props.rowData.ingressFirewallRules.concat(
      props.rowData.egressFirewallRules
    )
    tableData.value = JSON.parse(JSON.stringify(ruleList)).filter(
      (item: any) => {
        if (item.isDefault !== 1) {
          item.port1 = item.sourcePort.split(':')[0]
          item.port2 = item.sourcePort.split(':')[1]
          item.port3 = item.destinationPort.split(':')[0]
          item.port4 = item.destinationPort.split(':')[1]
          return item
        }
      }
    )
  }
})

// 方向数组
const directionList = [
  {
    label: '入方向',
    value: 'ingress',
    disabled: false
  },
  {
    label: '出方向',
    value: 'egress',
    disabled: false
  }
]
// 监听入规则、出规则可添加情况,判断下拉框是否可选择
watch([ingressNumber, egressNumber], value => {
  directionList[0].disabled = value[0] <= 0
  directionList[1].disabled = value[1] <= 0
})
// 方向下拉选择
const directionChange = (val: string) => {
  if (val === 'ingress') {
    ingressNumber.value -= 1
    egressNumber.value += 1
  } else {
    ingressNumber.value += 1
    egressNumber.value -= 1
  }
}

// 策略数组
const strategyList = [
  { label: '允许', value: 'accept' },
  { label: '不允许', value: 'deny' }
]
// 协议
const protocolList = [
  { label: 'ALL', value: 'all' },
  { label: 'ICMP', value: 'icmp' },
  { label: 'TCP', value: 'tcp' },
  { label: 'UDP', value: 'udp' }
]
// 协议下拉选择
const changeProtocol = (val: string, index: number) => {
  if (val === 'icmp' || val === 'all') {
    tableData.value[index].port1 = ''
    tableData.value[index].port2 = ''
    tableData.value[index].port3 = ''
    tableData.value[index].port4 = ''
  } else {
    tableData.value[index].port1 = 20
    tableData.value[index].port2 = 60
    tableData.value[index].port3 = 20
    tableData.value[index].port4 = 60
  }
}

// 添加规则
const handleAddRule = () => {
  tableData.value.push({
    direction: ingressNumber.value > 0 ? 'ingress' : 'egress',
    action: 'accept',
    protocol: 'tcp',
    noEdit: false,
    description: '',
    sourceIpAddress: '0.0.0.0/0',
    destinationIpAddress: '0.0.0.0/0',
    port1: 20,
    port2: 60,
    port3: 20,
    port4: 60
  })
  if (ingressNumber.value > 0) {
    ingressNumber.value -= 1
  } else {
    egressNumber.value -= 1
  }
}
// 删除
const handleDelete = (row: any, index: number) => {
  tableData.value.splice(index, 1)
  if (row.direction === 'ingress') {
    ingressNumber.value += 1
  } else {
    egressNumber.value += 1
  }
}
// 端口范围: 第一个大于第二个时重置第二个端口
const listenPort = (row: any) => {
  row.port2 = row.port2 > row.port1 ? row.port2 : row.port1
  row.port4 = row.port4 > row.port3 ? row.port4 : row.port3
}

interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelBtn = () => {
  emit(EventEnum.cancel)
}

const submitBtn = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.acl-add-rule {
  width: 100%;
  .acl-port {
    align-items: center;
    margin: 5px 0;
  }
  .acl-ip-address {
    justify-content: space-between;
    margin: 5px 0;
  }
  .acl-container--add {
    padding: 0 20px;
    .acl-container-add-button {
      color: var(--el-color-primary);
      &:disabled {
        color: $gray6-light;
      }
    }
  }
}
</style>
