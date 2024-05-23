<template>
  <div class="confirm-config">
    <el-card>
      <div class="custom-warning-box">
        <svg-icon
          icon="info-warning"
          color="var(--el-color-primary)"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span>后端服务器组没有添加后端服务器,请创建完成后添加后端服务器。</span>
      </div>
      <div>
        <p class="ideal-medium-text detail-title">
          监听器<svg-icon
            icon="edit-pen"
            class="ideal-svg-margin-left"
          ></svg-icon>
        </p>
        <ideal-detail-info
          :label-array="monitorLabel"
          label-position="left"
          :show-colon="false"
          :detail-info="detailInfo"
          class="basic-info"
        >
        </ideal-detail-info>

        <el-divider border-style="dashed" />

        <p class="ideal-medium-text detail-title">
          配置后端分配策略<svg-icon
            icon="edit-pen"
            class="ideal-svg-margin-left"
          ></svg-icon>
        </p>
        <ideal-detail-info
          :label-array="strategyLabel"
          label-position="left"
          :show-colon="false"
          :detail-info="detailInfo"
          class="basic-info"
        >
        </ideal-detail-info>

        <el-divider border-style="dashed" />

        <p class="ideal-medium-text detail-title">
          添加后端服务器<svg-icon
            icon="edit-pen"
            class="ideal-svg-margin-left"
          ></svg-icon>
        </p>
        <ideal-detail-info
          :label-array="serverLabel"
          label-position="left"
          :show-colon="false"
          :detail-info="detailInfo"
          class="basic-info"
        >
        </ideal-detail-info>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const monitorLabel = ref([
  { label: '名称', prop: 'name' },
  { label: '前端协议', prop: 'vpc' },
  { label: '前端端口', prop: 'uuid' },
  { label: '访问控制', prop: 'ipv4' },
  { label: '获取客户端IP', prop: 'instanceType' },
  { label: '空闲超时时间(秒)', prop: 'propertyMode' },
  { label: '描述', prop: 'billingMode' }
])

const strategyLabel = ref([
  { label: '名称', prop: 'name' },
  { label: '后端协议', prop: 'vpc' },
  { label: '分配策略类型', prop: 'vpc' },
  { label: '会话保持', prop: 'vpc' },
  { label: '描述', prop: 'vpc' }
])

const serverLabel = ref([
  { label: '健康检查', prop: 'name' },
  { label: '健康检查协议', prop: 'vpc' },
  { label: '健康检查端口', prop: 'vpc' },
  { label: '检查间隔', prop: 'vpc' },
  { label: '超时时间', prop: 'vpc' },
  { label: '最大重试次数', prop: 'vpc' }
])

const detailInfo: any = ref({})
</script>

<style scoped lang="scss">
.confirm-config {
  .custom-warning-box {
    background-color: var(--custom-information-bg-color);
    padding: 10px 20px;
    align-items: center;
  }
  .detail-title {
    margin: 10px;
    font-weight: 600;
  }
}
</style>
