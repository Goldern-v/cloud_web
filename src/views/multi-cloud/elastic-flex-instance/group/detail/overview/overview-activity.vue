<template>
  <div class="activity">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) of activities"
        :key="index"
        :color="activity.color"
      >
        {{ activity.content }}
        <div>暂无活动</div>
      </el-timeline-item>
    </el-timeline>

    <div class="flex-row activity-all">
      <el-button link type="primary">查看全部活动</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">

const activities = [
  {
    content: '正在进行的活动',
    color: '#0bbd87'
  },
  {
    content: '上一次的活动',
    color: ''
  }
]
</script>

<style scoped lang="scss">
.activity {
  background-color: white;
  .activity-all {
    justify-content: flex-end;
    align-items: flex-end;
  }
}
</style>
