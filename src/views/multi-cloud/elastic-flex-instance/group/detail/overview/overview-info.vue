<template>
  <div class="info flex-row">
    <div style="width: 50%; margin-right: 10px;">
      <div class="info-item">
        <div class="info-title">基本信息</div>
        <ideal-detail-info
          :label-array="basicLabels"
          :item-number="1"
          :detail-info="basicInfo"
          label-position="left"
        >
          <template #name>
            <div class="flex-row">
              <div>{{ basicInfo.name }}</div>
              <svg-icon icon="edit-pen" class="ideal-svg-margin-left"/>
            </div>
          </template>

          <template #status>
            <div class="flex-row" style="justify-content: flex-start;">
              <ideal-status-icon
                status-icon="loading"
                :status-text="basicInfo.status"
              />
            </div>
          </template>
        </ideal-detail-info>
      </div>

      <div class="info-item ideal-large-margin-top">
        <div class="info-title">网络信息</div>
        <ideal-detail-info
          :label-array="networkLabels"
          :item-number="1"
          :detail-info="networkInfo"
          label-position="left"
        >
        </ideal-detail-info>
      </div>
    </div>

    <div style="width: 50%; margin-left: 10px;">
      <div class="info-item">
        <div class="info-title">伸缩配置</div>
        <ideal-detail-info
          :label-array="configLabels"
          :item-number="1"
          :detail-info="configInfo"
          label-position="left"
        >
        </ideal-detail-info>
      </div>

      <div class="info-item ideal-large-margin-top">
        <div class="info-title">策略信息</div>
        <ideal-detail-info
          :label-array="policyLabels"
          :item-number="1"
          :detail-info="policyInfo"
          label-position="left"
        >
        </ideal-detail-info>
      </div>

      <div class="info-item ideal-large-margin-top">
        <div class="info-title">健康检查</div>
        <ideal-detail-info
          :label-array="healthLabels"
          :item-number="1"
          :detail-info="healthInfo"
          label-position="left"
        >
        </ideal-detail-info>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

// 基本信息
const basicLabels = ref([
  { label: '名称', prop: 'name', useSlot: true },
  { label: 'ID', prop: 'imageId' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '创建时间', prop: 'createTime' },
  { label: '可用区', prop: 'availableZone' },
  { label: '冷却时间(秒)', prop: 'coolingTime' },
  { label: '委托', prop: 'delegation' }
])
const basicInfo: { [key: string]: any} = ref({
  name: '测试2222',
  imageId: '2390-f3d4-093b-f431',
  status: '创建中',
  createTime: '2023-07-23 19:02:30',
  availableZone: '可用区1，可用区3',
  coolingTime: '300',
  delegation: '--'
})
// 网络信息
const networkLabels = ref([
  { label: 'VPC', prop: 'vpc' },
  { label: '子网', prop: 'subnet' },
  { label: '监听器', prop: 'monitor' }
])
const networkInfo: { [key: string]: any} = ref({
  vpc: 'vpc-default',
  subnet: 'subnet-default',
  monitor: '--'
})
// 伸缩配置
const configLabels = ref([
  { label: '配置名称', prop: 'name' },
  { label: '配置ID', prop: 'imageId' }
])
const configInfo: { [key: string]: any} = ref({
  name: '测试2222',
  imageId: '2390-f3d4-093b-f431'
})
// 策略信息
const policyLabels = ref([
  { label: '实例移出策略', prop: 'policy' },
  { label: '弹性公网IP', prop: 'eip' },
  { label: '数据盘', prop: 'dataDisk' },
  { label: '多可用区扩展策略', prop: 'multiple' }
])
const policyInfo: { [key: string]: any} = ref({
  policy: '根据较早创建的配置较早创建的实例',
  eip: '随实例释放',
  dataDisk: '随实例释放',
  multiple: '均衡分布'
})
// 健康检查
const healthLabels = ref([
  { label: '健康检查方式', prop: 'mode' },
  { label: '健康检查间隔', prop: 'interval' },
  { label: '健康状况检查宽限期(秒)', prop: 'limit' }
])
const healthInfo: { [key: string]: any} = ref({
  mode: '云服务器健康检查',
  interval: '5分钟',
  limit: '600'
})
</script>

<style scoped lang="scss">
.info {
  // width: 100%;
  .info-title {
    font-weight: 500;
    font-size: 16px;
  }
  .info-item {
    background-color: white;
    padding: $idealPadding;
  }
}
</style>
