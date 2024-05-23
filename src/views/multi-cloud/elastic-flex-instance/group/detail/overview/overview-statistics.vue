<template>
  <div class="statistics">
    <div class="flex-row statistics-container">
      <div class="flex-row statistics-box">
        <div class="flex-column flex-center">
          <div>0</div>
          <div>正在加入</div>
        </div>
        <el-divider direction="vertical"/>
        <div class="flex-column flex-center">
          <div>0</div>
          <div>加入挂起</div>
        </div>
      </div>

      <div>
        <div class="statistics-box">
          <div class="flex-column flex-center">
            <div>0</div>
            <div>期望实例数(台)</div>
          </div>
          <el-divider />
          <div class="flex-row flex-between">
            <div>最小：0</div>
            <div>最大：0</div>
          </div>
        </div>

        <div class="statistics-box ideal-default-margin-top">
          <div class="flex-column flex-center">
            <div>0</div>
            <div>当前实例数(台)</div>
          </div>
          <el-divider />
          <div class="flex-row flex-between">
            <div>保护中：0</div>
            <div>已备用：0</div>
          </div>
        </div>
      </div>

      <div class="flex-row statistics-box">
        <div class="flex-column flex-center">
          <div>0</div>
          <div>正在移出</div>
        </div>
        <el-divider direction="vertical"/>
        <div class="flex-column flex-center">
          <div>0</div>
          <div>移出挂起</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.statistics {
  background-color: $gray1-light;
  border-radius: $circleRadiusSize;
  .flex-center {
    justify-content: center;
    align-items: center;
  }
  .flex-between {
    justify-content: space-between;
  }
  .statistics-container {
    align-items: flex-end;
    justify-content: space-between;
    .statistics-box {
      align-items: center;
      border-radius: $circleRadiusSize;
      background-color: white;
      padding: $idealPadding;
    }
  }
}
</style>
