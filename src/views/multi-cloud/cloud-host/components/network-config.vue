<template>
  <div class="network-config">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="网络" required>
          <div class="flex-column" style="width: 100%">
            <div class="flex-row flex-row-start-center" style="width: 100%">
              <el-form-item prop="vpc" style="width: 15%">
                <el-select
                  v-model="form.vpc"
                  placeholder="请选择虚拟私有云"
                  class="ideal-default-margin-right"
                >
                  <el-option
                    v-for="item of state.vpcList"
                    :key="item.uuid"
                    :label="item.name"
                    :value="item.uuid"
                  />
                </el-select>
              </el-form-item>

              <svg-icon
                icon="refresh-icon"
                class="ideal-svg-margin-right"
                style="cursor: pointer"
                @click="clickRefreshVpc"
              ></svg-icon>

              <el-form-item prop="subnet" style="width: 15%">
                <el-select
                  v-model="form.subnet"
                  placeholder="请选择子网"
                  class="ideal-default-margin-right"
                >
                  <el-option
                    v-for="item of state.subnetList"
                    :key="item.uuid"
                    :label="item.name"
                    :value="item.uuid"
                  />
                </el-select>
              </el-form-item>

              <svg-icon
                icon="refresh-icon"
                style="cursor: pointer"
                @click="clickRefreshSubnet"
              ></svg-icon>
            </div>

            <div class="ideal-tip-text ideal-large-margin-top">
              如需创建新的虚拟私有云，您可前往<el-button
                link
                type="primary"
                @click="clickCreateVpc"
                >创建链接</el-button
              >。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="扩展网卡">
          <div class="flex-column" style="width: 100%">
            <div
              v-for="(item, index) of form.expand"
              :key="index"
              class="flex-row flex-row-start-center"
              style="margin-bottom: 10px"
            >
              <svg-icon
                icon="circle-close"
                class="ideal-default-margin-right"
                @click="clickExpandDelete(index)"
              ></svg-icon>

              <el-select
                v-model="item.subnet"
                placeholder="请选择子网"
                class="ideal-default-margin-right"
                style="width: 20%"
              >
                <el-option
                  v-for="item in state.expandSubnetList"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.uuid"
                />
              </el-select>

              <el-select
                v-model="item.autoIp"
                placeholder="请选择"
                class="ideal-default-margin-right"
                style="width: 20%"
              >
                <el-option
                  v-for="item of state.ipGenerateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>

              <svg-icon
                v-if="item.autoIp === '1'"
                icon="refresh-icon"
                style="cursor: pointer"
                class="ideal-svg-margin-right"
                @click="clickRefreshAutoIp(index)"
              ></svg-icon>

              <ideal-ip-input
                v-if="item.autoIp === '2'"
                :ip-value="item.manualIp"
                @listenChange="listenIpAddress($event, index)"
              />
            </div>

            <div class="flex-row ideal-default-text">
              <el-button
                link
                type="primary"
                :disabled="networkCardQuota - form.expand.length < 1"
                @click="onClickAddNetworkCard"
              >
                +添加网卡
              </el-button>
              <span class="ideal-tip-text"
                >你还可以增加{{
                  networkCardQuota - form.expand.length
                }}块网卡</span
              >
            </div>
          </div>
        </el-form-item>

        <el-form-item label="源/目的检查">
          <el-switch v-model="form.sourceCheck"></el-switch>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="安全组" :required="isPrivateHuawei || isTencent || isAliyun" prop="safeGroup">
          <div class="flex-column" style="width: 100%">
            <div class="flex-row flex-row-start-center">
              <el-select
                v-model="form.safeGroup"
                multiple
                collapse-tags
                placeholder="请选择安全组"
                class="ideal-default-margin-right"
                style="width: 20%"
              >
                <el-option
                  v-for="item in state.safeGroupList"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.uuid"
                />
              </el-select>

              <svg-icon
                icon="refresh-icon"
                style="cursor: pointer"
                class="ideal-svg-margin-right"
                @click="clickRefreshSafeGroup"
              ></svg-icon>

              <el-button link type="primary" @click="clickCreateSafeGroup"
                >新建安全组</el-button
              >
            </div>

            <div class="ideal-default-text">
              安全组类似防火墙功能，是一个逻辑上的分组，用于设置网络访问控制。
            </div>
            <div class="flex-row">
              <div class="ideal-warning-text">
                请确保所选安全组已放通22端口（Linux
                SSH登录），3389端口（Windows远程登录）和 ICMP 协议（Ping）。
              </div>
              <el-button link type="primary" @click="clickToSafeGroup"
                >配置安全组规则</el-button
              >
            </div>

            <div class="flex-row rule-direction-container">
              <div class="flex-row">
                <div
                  v-if="showSafeRule"
                  class="rule-direction-item"
                  :class="
                    directionType === directionEnum.ingress
                      ? 'rule-direction-active'
                      : ''
                  "
                  @click="clickRuleDirection(directionEnum.ingress)"
                >
                  入方向规则
                </div>
                <div
                  v-if="showSafeRule"
                  class="rule-direction-item"
                  :class="
                    directionType === directionEnum.egress
                      ? 'rule-direction-active'
                      : ''
                  "
                  @click="clickRuleDirection(directionEnum.egress)"
                >
                  出方向规则
                </div>
              </div>
              <el-button style="height: 54px" link @click="clickHideSafeRule">{{
                safeRuleBtn
              }}</el-button>
            </div>

            <ideal-table-list
              v-if="showSafeRule"
              class="safe-group-rule-table"
              :loading="state.tableState?.dataListLoading"
              :table-data="state.tableState?.dataList"
              :table-headers="tableHeaders"
              :show-border="true"
              :show-pagination="false"
              :merge-data="state.mergeData"
              :merge-column="[0]"
            >
            </ideal-table-list>
          </div>
        </el-form-item>
      </el-card>
      <!-- 华为私有云暂未联调此功能，暂时屏蔽 -->
      <el-card v-if="isPublic" class="ideal-large-margin-top">
        <el-form-item label="弹性公网IP">
          <div class="flex-column">
            <el-radio-group v-model="form.ipMode">
              <el-radio label="1">现在购买</el-radio>
              <el-radio label="2">使用已有</el-radio>
              <el-radio label="3">暂不够买</el-radio>
            </el-radio-group>

            <div v-if="form.ipMode === '2'" class="ideal-tip-text">
              为云服务器分配已有弹性公网IP，不能批量创建云服务器
            </div>
            <div v-if="form.ipMode === '3'" class="ideal-warning-text">
              不使用弹性公网IP的云服务器不能与互联网互通，仅可作为私有网络中部署业务或者集群所需云服务器进行使用。不使用弹性公网IP的云服务器不能与互联网互通，仅可作为私有网络中部署业务或者集群所需云服务器进行使用。
            </div>

            <div v-if="form.ipMode === '2'" class="flex-row">
              <el-select
                v-model="form.exitEip"
                placeholder="请选择弹性公网IP"
                class="ideal-default-margin-right"
              >
                <el-option
                  v-for="item of state.exitEipList"
                  :key="item.uuid"
                  :label="item.ipAddress"
                  :value="item.uuid"
                />
              </el-select>
              <svg-icon
                icon="refresh-icon"
                style="cursor: pointer"
                @click="clickRefreshEip"
              />
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="form.ipMode === '1'" label="线路">
          <el-radio-group
            v-if="form.ipMode === '1'"
            v-model="form.line"
            class="ideal-default-margin-right"
          >
            <el-radio-button
              v-for="(item, index) of state.lineList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form.ipMode === '1'" label="公网带宽">
          <div class="flex-column">
            <div class="flex-row">
              <el-radio-group v-model="form.bandwidthType" class="ideal-default-margin-right">
                <el-radio-button
                  v-for="(item, index) of state.bandwidthTypeList"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>
            </div>

            <div class="ideal-tip-text">
              指定带宽上限，按实际使用的出公网流量计费，与使用时间无关。
            </div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="form.ipMode === '1' && form.bandwidthType === 'bandwidth'"
          label="带宽大小"
        >
          <el-radio-group v-model="form.bandwidthSize" class="ideal-default-margin-right">
            <el-radio-button
              v-for="(item, index) in state.bandWidthList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>

          <div>自定义：</div>
          <el-input-number
            v-model="form.bandwidthSize"
            class="ideal-default-margin-right"
            :min="1"
            :max="2000"
          />
          <div class="ideal-warning-text">带宽范围：1-2,000 Mbit/s</div>
        </el-form-item>

        <el-form-item
          v-if="form.ipMode === '1' && form.bandwidthType === 'traffic'"
          label="带宽大小"
        >
          <el-radio-group v-model="form.bandwidthSize" class="ideal-default-margin-right">
            <el-radio-button
              v-for="(item, index) in state.flowBandWidthList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>

          <div>自定义：</div>
          <el-input-number
            v-model="form.bandwidthSize"
            class="ideal-default-margin-right"
            :min="1"
            :max="300"
          />
          <div class="ideal-warning-text">带宽范围：1-3,00 Mbit/s</div>
        </el-form-item>

        <el-form-item
          v-if="form.ipMode === '1' && form.bandwidthType === 'shareBandwidth'"
          label="带宽名称"
        >
          <el-select
            v-model="form.shareBandwidth"
            placeholder="请选择带宽名称"
            class="ideal-default-margin-right"
            style="width: 20%"
          >
            <el-option
              v-for="item of state.shareBandwidth"
              :key="item.uuid"
              :label="item.name"
              :value="item.uuid"
            />
          </el-select>
          <svg-icon
            icon="refresh-icon"
            style="cursor: pointer"
            class="ideal-svg-margin-right"
            @click="clickRefreshBandwidth"
          />
          <el-button link type="primary">新建共享带宽</el-button>
          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="弹性公网IP加入到包年包月的共享带宽，如果到期后不续费，则会自动给弹性公网IP分配一个按流量计费的独享带宽。"
            placement="right"
          >
            <svg-icon icon="question-icon"></svg-icon>
          </el-tooltip>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { useNetwork } from './network-config'
import { IHooksNetwork } from './interface'
import { useResourcePool } from '@/utils/common/resource'

const { isPublic, isPrivateHuawei, isTencent, isAliyun } = useResourcePool()

const checkSafeGroup = (rule: any, value: any, callback: (e?: Error) => any) => {
  // 华为私有云 腾讯公有云 安全组为必选项
  if ((isPrivateHuawei.value || isTencent.value || isAliyun.value) && !value.length) {
    callback(new Error('请选择安全组'))
  }
  callback()
}

const formRef = ref<FormInstance>() // 校验表单
const rules = reactive<FormRules>({
  vpc: [{ required: true, message: '请选择虚拟私有云', trigger: 'blur' }],
  subnet: [{ required: true, message: '请选择子网', trigger: 'blur' }],
  safeGroup: [{ validator: checkSafeGroup, trigger: 'blur' }]
})

// 表单
const form = reactive({
  regionId: '', // 区域
  resourceId: '', // 资源池id
  projectId: '',
  vpc: '', // 虚拟私有云
  vpcInfo: '', // 虚拟私有云(供确认配置界面使用)
  subnet: '', // 子网
  subnetInfo: '', // 子网(供确认配置界面使用)
  expand: [] as any, // 扩展网卡
  sourceCheck: false, // 源/目的检查
  safeGroup: [], // 安全组
  safeGroupInfo: '无', // 安全组(供确认配置界面使用)
  direction: 'ingress', // 安全组规则方向
  ipMode: '1', // 弹性公网IP
  eipInfo: '', // 弹性公网(供确认配置界面使用)
  exitEip: '', // 现有ip
  line: '5_bgp', // 线路
  bandwidthType: 'bandwidth', // 公网带宽
  bandwidthSize: 5, // 带宽大小
  shareBandwidth: '' // 带宽名称（共享）
})

const state: IHooksNetwork = reactive({
  form
})
const useData = useNetwork(state)
const {
  clickExpandDelete,
  onClickAddNetworkCard,
  getDataList,
  listenIpAddress,
  clickRefreshVpc,
  clickRefreshSubnet,
  clickRefreshSafeGroup,
  clickRefreshEip,
  clickRefreshBandwidth,
  clickCreateVpc
} = useData

const networkCardQuota = ref(1)
// 安全组表头
const tableHeaders = ref<IdealTableColumnHeaders[]>([
  { label: '安全组名称', prop: 'securitygroupName' },
  { label: '优先级', prop: 'priority' },
  { label: '策略', prop: 'strategy' },
  { label: '协议端口', prop: 'protocolPort' },
  { label: '类型', prop: 'ethertype' },
  { label: '源地址', prop: 'address' }
])
watch(
  () => form.direction,
  value => {
    if (value === 'ingress') {
      tableHeaders.value[5].label = '源地址'
    } else {
      tableHeaders.value[5].label = '目标地址'
    }
  }
)
// 规则方向
enum directionEnum {
  ingress = 'ingress', // 入
  egress = 'egress' // 出
}
// 规则方向选择
const directionType = ref(directionEnum.ingress)
const clickRuleDirection = (v: directionEnum) => {
  directionType.value = v
  form.direction = v
  getDataList()
}
// 显示安全组规则
const showSafeRule = ref(true)
const safeRuleBtn = ref('隐藏安全组规则')
// 隐藏安全组规则
const clickHideSafeRule = () => {
  showSafeRule.value = !showSafeRule.value
  safeRuleBtn.value = '显示安全组规则'
}
const clickRefreshAutoIp = (index: number) => {
  form.expand[index].autoIp = ''
}
const router = useRouter()
const clickToSafeGroup = () => {
  router.push({ path: '/multi-cloud/safe-group/list' })
}
// 事件
enum EventEnum {
  drawer = 'clickDrawer'
}
interface EventEmits {
  (e: EventEnum.drawer, v: string): void
}
const emit = defineEmits<EventEmits>()
const clickCreateSafeGroup = () => {
  emit(EventEnum.drawer, 'createSafeGroup')
}
defineExpose({
  formRef,
  form
})
</script>

<style lang="scss" scoped>
.network-config {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .flex-row-start-center {
    justify-content: flex-start;
    align-items: center;
  }
  .rule-direction-container {
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.5px solid #8b8b8b;
    .rule-direction-item {
      padding: 10px;
      cursor: pointer;
    }
    .rule-direction-active {
      color: var(--el-color-primary);
      border-bottom: 2px solid var(--el-color-primary);
    }
  }
  .safe-group-rule-table {
    width: 100%;
    margin-bottom: 20px;
    :deep(.el-table) {
      max-height: 320px !important;
      overflow: auto;
      border-bottom: 1px solid #ebeef5;
    }
    :deep(.el-table__header-wrapper) {
      position: sticky;
      top: 0;
      z-index: 2;
    }
  }
  .network-card-button--add {
    cursor: pointer;
    color: var(--el-color-primary);
  }
  :deep(.el-slide-scale) {
    width: 80%;
    .el-slider-label {
      right: 0 !important;
    }
  }
  :deep(.el-card__body) {
    padding: 20px 20px 0;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
