<template>
  <div class="overview">
    <div class="basic-info">
      <div class="overview-title">基本信息</div>

      <ideal-detail-info
        :label-array="labelArray"
        :detail-info="detailInfo"
      ></ideal-detail-info>
    </div>

    <div class="monitor-alarm ideal-large-margin-top">
      <div class="flex-row" style="justify-content: space-between">
        <div class="overview-title">监控告警</div>
        <el-button link>
          <svg-icon icon="setting-icon" />
          查看详情
        </el-button>
      </div>

      <div class="monitor-alarm-box">
        <div
          v-for="(item, index) of alarmData"
          :key="index"
          class="flex-row monitor-alarm-item"
        >
          <div>{{ item.label }}</div>
          <div class="ideal-error-text monitor-alarm-item-title">
            {{ item.count }}
          </div>
        </div>
      </div>
    </div>

    <div class="use-analysis ideal-large-margin-top">
      <div class="overview-title">用量分析</div>

      <div class="use-analysis-box">
        <div
          v-for="(item, index) of analysisData"
          :key="index"
          class="flex-column use-analysis-item"
        >
          <div class="flex-row" style="justify-content: space-between">
            <div class="use-analysis-item-title">{{ item.title }}</div>
            <div class="flex-row" style="cursor: pointer">
              <div>{{ item.sumText }}</div>
              <svg-icon
                icon="down-arrow"
                class-name="use-analysis-item-icon"
                class="ideal-svg-margin-left"
              />
            </div>
          </div>

          <div class="flex-row ideal-default-margin-top" style="align-items: flex-end">
            <div class="use-analysis-item-count">{{ item.count }}</div>
            <div class="use-analysis-item-unit">{{ item.unit }}</div>
            <div class="ideal-tip-text">月环比</div>
            <div class="use-analysis-item-ratio">
              <svg-icon icon="arrow-up" class-name="arrow-up" />
              {{ item.ratio }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="basic-setting ideal-large-margin-top">
      <div class="overview-title">基础配置</div>

      <div class="basic-setting-box">
        <div
          v-for="(item, index) of basicData"
          :key="index"
          class="flex-row basic-setting-item"
        >
          <div>{{ item.title }}</div>
          <div class="flex-row" style="align-items: center">
            <div>{{ item.status }}</div>
            <div class="basic-setting-dot"></div>
            <svg-icon icon="right-arrow" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const labelArray = ref([
  { label: '对象个数', prop: 'number' },
  { label: '桶策略', prop: 'bucketPolicy' },
  { label: '桶版本号', prop: 'bucketVersion' },
  { label: '多版本控制状态', prop: 'status' },
  { label: '集群类型', prop: 'type' },
  { label: '账号ID', prop: 'uuid' }
])
const detailInfo = ref({
  number: '0',
  bucketPolicy: '私有桶',
  bucketVersion: '3.0',
  status: '未启用',
  type: '公共集群',
  uuid: '39a93d9c-93ab-cd32-19af2c65'
})
// 监控告警
const alarmData = ref<any[]>([
  { label: '紧急告警', count: 0 },
  { label: '重要告警', count: 0 },
  { label: '次要告警', count: 0 },
  { label: '提示告警', count: 0 }
])
// 用量分析
const analysisData = ref<any[]>([
  {
    title: '存储',
    sumText: '总存储量',
    count: '0',
    unit: 'byte',
    ratio: '0.00'
  },
  {
    title: '流量',
    sumText: '总下载流量',
    count: '30.55',
    unit: 'KB',
    ratio: '0.00'
  },
  {
    title: '请求',
    sumText: '总请求数',
    count: '174',
    unit: '次',
    ratio: '0.00'
  }
])
// 基础配置
const basicData = ref<any[]>([
  { title: '生命周期规则', status: '未配置' },
  { title: '静态网站托管', status: '未配置' },
  { title: 'CORS规则', status: '未配置' },
  { title: '防盗链', status: '未配置' },
  { title: '标签', status: '未配置' },
  { title: '日志记录', status: '未配置' },
  { title: '默认加密', status: '未配置' },
  { title: '归档数据直读', status: '未配置' },
  { title: 'WORM保留策略', status: '不支持' },
  { title: '多版本控制', status: '未启用' }
])
</script>

<style scoped lang="scss">
.overview {
  width: 100%;
  .overview-title {
    font-size: $largeFontSize;
    font-weight: 500;
  }
  .basic-info,
  .monitor-alarm,
  .use-analysis,
  .basic-setting {
    background-color: white;
    padding: $idealPadding;
    border-radius: $circleRadiusSize;
  }
  .monitor-alarm-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .monitor-alarm-item {
      border-radius: $circleRadiusSize;
      background-color: $gray1-light;
      justify-content: space-between;
      margin: 10px 10px 0;
      padding: 10px;
      width: calc(25% - 40px);
      .monitor-alarm-item-title {
        font-size: $largeFontSize;
        font-weight: 500;
      }
    }
  }
  .use-analysis-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .use-analysis-item {
      margin: 10px $idealMargin;
      width: calc(33.3% - $idealMargin * 2);
      :deep(.use-analysis-item-icon) {
        color: $gray5-light;
      }
      .use-analysis-item-title {
        font-weight: 500;
      }
      .use-analysis-item-count {
        font-size: $largeFontSize;
        font-weight: 500;
        margin-right: 5px;
      }
      .use-analysis-item-unit {
        font-weight: 500;
        margin-right: 5px;
      }
      .use-analysis-item-ratio {
        margin-left: 5px;
        padding: 2px 5px;
        background-color: $errorColorLight;
        color: $errorColor;
      }
      :deep(.arrow-up) {
        color: $errorColor;
      }
    }
  }
  .basic-setting-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .basic-setting-item {
      border-radius: $circleRadiusSize;
      background-color: $gray1-light;
      justify-content: space-between;
      align-items: center;
      width: calc(25% - 40px);
      margin: 10px;
      padding: 10px;
    }
  }
  .basic-setting-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: $gray5-light;
    margin: 0 5px;
  }
}
</style>
