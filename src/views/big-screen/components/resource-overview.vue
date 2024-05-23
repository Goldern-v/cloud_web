<template>
  <div class="resource">
    <div>资源总览</div>
    <div class="flex-row">
      <div>云资源总数：70</div>
      <div>宿主机总数：3</div>
    </div>

    <div v-for="(item,index) of arr" :key="index">
      <div class="flex-row">
        <div style="width: 100px;">{{ item.label }}</div>
        <div style="width: calc(100% - 100px);">
          <el-progress
            :percentage="item.count">
            <el-button text>{{ item.count }}/个</el-button>
          </el-progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const arr = [
  { label: '云服务器', count: 5 },
  { label: '弹性伸缩组', count: 2 },
  { label: '云硬盘', count: 10 },
  { label: '对象存储', count: 3 },
  { label: '弹性文件', count: 4 },
  { label: '虚拟私有云', count: 23 },
  { label: '对等连接', count: 10 },
  { label: '弹性公网IP', count: 8 },
  { label: '弹性负载均衡', count: 6 }
]
</script>

<style scoped lang="scss">
.resource {
  padding: $idealPadding;
}
</style>
