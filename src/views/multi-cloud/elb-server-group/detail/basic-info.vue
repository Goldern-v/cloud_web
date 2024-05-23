<template>
  <div>
    <div class="basic-info">
      <ideal-detail-info
        :label-array="labelArray"
        label-position="left"
        :show-colon="false"
        :detail-info="detailInfo"
      >
        <template #editProtect>
          <div class="flex-row" style="align-items: center">
            <span class="ideal-default-margin-right">{{
              detailInfo.protect ? '已开启' : '未开启'
            }}</span>
            <el-text type="primary">设置</el-text>
          </div>
        </template>
      </ideal-detail-info>
    </div>

    <!-- v-if="Object.keys(healthInfo).length" -->
    <div class="basic-info">
      <p class="basic-info-tile">
        <span class="ideal-default-margin-right">健康检查</span
        ><svg-icon
          icon="info-warning"
          color="#F3AD3C"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <el-text type="primary">(异常后端服务器：{{ abnormalNum }})</el-text>
      </p>
      <ideal-detail-info
        :label-array="healthCheckLabel"
        label-position="left"
        :show-colon="false"
        :detail-info="healthInfo"
      >
      </ideal-detail-info>
    </div>
  </div>
</template>
<script lang="ts" setup>
const labelArray = ref([
  { label: '名称', prop: 'name', isEdit: true },
  { label: 'ID', prop: 'uuid', isCopy: true },
  { label: '后端协议', prop: 'protocol' },
  { label: '负载均衡器', prop: 'balancer', isSkip: true },
  { label: '监听器', prop: 'listener', isSkip: true },
  { label: '分配策略类型', prop: 'strategyType' },
  { label: '会话保持', prop: 'session', useSlot: true },
  { label: '描述', prop: 'remark', isEdit: true },
  {
    label: '修改保护',
    prop: 'editProtect',
    useSlot: true,
    icon: 'question-icon'
  }
])
const healthCheckLabel = ref([
  { label: '健康检查', prop: 'healthCheck' },
  { label: '健康检查协议', prop: 'protocol' },
  { label: '健康检查端口', prop: 'port' },
  { label: '检查间隔（秒）', prop: 'interval' },
  { label: '超时时间（秒）', prop: 'overtime' },
  { label: '最大重试次数', prop: 'retryTimes' }
])

const detailInfo: any = ref({})
const route = useRoute()
onMounted(() => {
  detailInfo.value = JSON.parse(route.query.detail as any)
})

//健康检查信息
const healthInfo: any = ref({
  healthCheck: '已开启',
  protocol: 'TCP',
  port: '使用后端服务器默认业务端口',
  interval: 5,
  overtime: 5,
  retryTimes: 3
})
const abnormalNum = ref(1)
</script>
<style lang="scss" scoped>
.basic-info {
  margin: $idealMargin 0;
  background-color: #fff;
  padding: $idealPadding;
  .skip-text {
    color: var(--el-color-primary);
    font-size: $defaultFontSize;
    cursor: pointer;
  }
  .basic-info-tile {
    font-size: $mediumFontSize;
    margin: 0 20px 20px;
  }
}
</style>
