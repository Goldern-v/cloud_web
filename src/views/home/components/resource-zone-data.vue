<template>
  <div class="flex-row zone">
    <div class="flex-column zone-data">
      <div class="zone-data-title">{{ zoneData.label }}</div>

      <div class="flex-row flex-row-between">
        <div class="flex-row zone-data-text">
          <div class="flex-row flex-row-center">
            <svg-icon :icon="zoneData.totalIcon" color="#86909C" />
            <div class="zone-data-label">总量</div>
          </div>
          <el-divider
            class="horizontal-divider"
            border-style="dashed"
          />
        </div>

        <div>{{ zoneData.total }}<span class="zone-grey">{{ zoneData.unit }}</span></div>
      </div>

      <div class="flex-row flex-row-between">
        <div class="flex-row zone-data-text">
          <div class="flex-row flex-row-center">
            <svg-icon :icon="zoneData.allocIcon" color="#86909C" />
            <div class="zone-data-label">分配量</div>
          </div>
          <el-divider
            class="horizontal-divider"
            border-style="dashed"
          />
        </div>
        <div>{{ zoneData.alloc }}<span class="zone-grey">{{ zoneData.unit }}</span></div>
      </div>
    </div>

    <div class="zone-progress">
      <el-progress type="circle" :percentage="zoneData.rates" color="var(--el-color-primary)">
        <template #default="{ percentage }">
          <span class="percentage-value">{{ percentage }}<span style="font-size: 12px;">%</span></span>
          <span class="percentage-label">{{ zoneData.ratesLabel }}</span>
        </template>
      </el-progress>
    </div>
  </div>
</template>

<script setup lang="ts">

interface ZoneProps {
  zoneData?: any
}
withDefaults(defineProps<ZoneProps>(), {
  zoneData: () => ({})
})

</script>

<style scoped lang="scss">
.zone {
  width: 100%;
  .flex-row-center {
    align-items: center;
  }
  .flex-row-between {
    align-items: center;
    justify-content: space-between;
  }
  .zone-data {
    width: 70%;
    .zone-data-title {
      color: #000;
      font-size: 14px;
      font-weight: 500;
    }
    .zone-data-label {
      color: #1d2129;
      font-size: 12px;
      font-weight: 400;
    }
    .zone-data-text {
      align-items: center;
      justify-content: space-between;
      width: 70%;
      .horizontal-divider {
        width: 65%;
      }
      :deep(.el-divider--horizontal) {
        margin: 24px 0;
      }
    }
  }
  .zone-progress {
    width: 30%;
    padding: $idealPadding;
    .percentage-value {
      display: block;
      margin-top: 10px;
      font-size: 24px;
      font-size: 18px;
      font-weight: 500;
    }
    .percentage-label {
      display: block;
      margin-top: 10px;
      font-size: 12px;
      font-weight: 500;
      color: #86909C;
    }
  }
  .zone-grey {
    color: #86909C;
    font-size: 12px;
  }
}
</style>