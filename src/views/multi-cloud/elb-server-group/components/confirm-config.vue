<template>
  <div class="confirm-config">
    <ideal-table-list
      :table-data="basicData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #configContent>
        <el-table-column label="配置内容">
          <template #default="props">
            <div
              v-for="(item, index) in props.row.configuration"
              :key="index"
              class="flex-row"
            >
              <div class="confirm-config-product-spec__label">
                {{ item.label }}
              </div>
              <div class="custom-normal-content">
                {{ props.row[item.prop] }}
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <el-card class="confirm-config-tab ideal-large-margin-top">
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="item in tabControllers"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
          <ideal-table-list
            :table-data="serverData"
            :table-headers="item.header"
            :show-pagination="false"
          >
          </ideal-table-list>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
interface basicConfig {
  configInfo?: any //基础配置信息
}
const props = withDefaults(defineProps<basicConfig>(), {
  configInfo: () => ({})
})

const activeName = ref('cloudServer')

/**
 * tab页
 */
const cloudServer: IdealTableColumnHeaders[] = [
  { label: '云服务器', prop: 'cloudServer' },
  { label: '私网IP地址', prop: 'privateIp' },
  { label: '业务端口', prop: 'servicePort' },
  { label: '权重', prop: 'weight' }
]

const acrossVpc: IdealTableColumnHeaders[] = [
  { label: '跨VPC后端IP', prop: 'ipAddress' },
  { label: '业务端口', prop: 'servicePort' },
  { label: '权重', prop: 'weight' }
]

const elasticNetCard: IdealTableColumnHeaders[] = [
  { label: '私网IP地址', prop: 'ipAddress' },
  { label: '所属弹性网卡', prop: 'elasticNetCard' },
  { label: '子网', prop: 'subnet' },
  { label: '业务端口', prop: 'servicePort' },
  { label: '权重', prop: 'weight' }
]

const tabControllers = ref([
  { label: '云服务器', name: 'cloudServer', header: cloudServer },
  { label: '跨VPC后端', name: 'acrossVpc', header: acrossVpc },
  { label: '辅助弹性网卡', name: 'elasticNetCard', header: elasticNetCard }
])

/**
 * 分配策略数据
 */
const basicData: any = ref([])
watch(
  () => props.configInfo,
  value => {
    const strategy = value.strategy //策略配置
    if (value) {
      const strategyTypeFormat: any = {
        'weighted-polling': '加权轮询算法',
        'least-weighted': '加权最少连接',
        'source-ip': '源IP算法'
      }
      const strategyInfo: any = Object.assign(
        {
          configItem: '后端分配策略',
          elbTypeText: strategy.elbType === 'exclusive' ? '独享型' : '共享型',
          loadBalancerTypeText:
            strategy.loadBalancerType === 'unTouch' ? '暂不关联' : '关联已有',
          forwardModeText:
            strategy.forwardMode === 'lbs' ? '负载均衡' : '主备转发',
          serverGroupTypeText:
            strategy.serverGroupType === 'mixed' ? '混合类型' : 'IP类型',
          strategyTypeText: strategyTypeFormat[strategy.strategyType],
          sessionText: strategy.session ? '已开启' : '未开启',
          slowStartText: strategy.slowStart ? '已开启' : '未开启'
        },
        strategy
      )
      if (!strategy.session) {
        strategyInfo.configuration = strategyConfiguration.filter(
          item => item.prop !== 'sessionTypeText' && item.prop !== 'sessionTime'
        )
      }
      if (!strategy.slowStart) {
        strategyInfo.configuration = strategyConfiguration.filter(
          item => item.prop !== 'slowTime'
        )
      } else {
        strategyInfo.configuration = strategyConfiguration
      }
      const healthCheckInfo = {
        configItem: '健康检查',
        configuration: healthCheckConfiguration,
        count: 1
      }
      basicData.value[0] = strategyInfo
      basicData.value[1] = healthCheckInfo
    }
  },
  { deep: true }
)
onMounted(() => {})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '配置项', prop: 'configItem' },
  { label: '配置内容', prop: 'configContent', useSlot: true },
  { label: '数量', prop: 'count' }
]

//后端分配策略配置内容
// const strategyConfiguration: any = ref([])
const strategyConfiguration = [
  { label: '名称', prop: 'name', isShow: true },
  { label: '负载均衡类型', prop: 'elbTypeText', isShow: true },
  { label: '所属负载均衡器', prop: 'loadBalancerTypeText', isShow: true },
  { label: '转发模式', prop: 'forwardModeText', isShow: true },
  { label: '服务器组类型', prop: 'serverGroupTypeText', isShow: true },
  { label: '虚拟私有云', prop: 'vpcName', isShow: true },
  { label: '后端协议', prop: 'protocol', isShow: true },
  { label: '分配策略类型', prop: 'strategyTypeText', isShow: true },
  { label: '会话保持', prop: 'sessionText', isShow: true },
  { label: '会话保持类型', prop: 'sessionTypeText', isShow: true },
  { label: '会话保持时间（分钟）', prop: 'sessionTime', isShow: true },
  { label: '慢启动', prop: 'slowStartText', isShow: true },
  { label: '慢启动时间（秒）', prop: 'slowTime', isShow: true },
  { label: '描述', prop: 'remark', isShow: true }
]
//健康检查配置内容
const healthCheckConfiguration = [
  { label: '健康检查', prop: 'name' },
  { label: '健康检查协议', prop: 'elbTypeText' },
  { label: '健康检查域名', prop: 'netType' },
  { label: '健康检查端口', prop: 'vpc' },
  { label: '健康检查路径', prop: 'instanceType' },
  { label: '检查间隔(秒)', prop: 'propertyMode' },
  { label: '超时时间(秒)', prop: 'tsg' },
  { label: '分配策略类型', prop: 'remark' },
  { label: '健康检查返回码', prop: 'remark' }
]

/**
 * 后端服务器数据
 */
const serverData: any = ref([])
</script>

<style scoped lang="scss">
.confirm-config {
  width: 100%;

  .confirm-config-product-spec__label {
    color: $textColorSecondary;
    width: 160px;
    text-align: left;
  }
  .custom-normal-content {
    color: $textColorPrimary;
  }
  :deep(.el-table__row) {
    color: $textColorPrimary;
    font-size: $defaultFontSize;
  }
}
</style>
