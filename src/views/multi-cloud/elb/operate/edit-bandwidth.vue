<template>
  <div class="edit-bandwidth">
    <div class="flex-row edit-bandwidth__tip">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <div>变更须知</div>
      <ul>
        <li>按需付费弹性公网IP支持修改带宽名称、大小和计费方式。</li>
        <li>
          带宽计费方式：按带宽计费将按固定带宽大小收费，按流量计费将按带宽实际使用的流量收费。
        </li>
        <li>
          降低带宽大小，可能会影响业务流量造成丢包，请确认对业务产生的影响，谨慎操作。
        </li>
      </ul>
    </div>

    <div v-if="stepsIndex === 1" class="edit-bandwidth__content">
      <div class="edit-bandwidth__content-config">
        <div class="current-config__before">
          <p class="edit-bandwidth__content-title">当前配置</p>

          <div>
            <ul class="flex-row">
              <li class="flex-row">
                <div class="ideal-tip-text current-config__label">
                  带宽名称
                </div>
                <div>{{ detailInfo.bandwidthName }}</div>
              </li>
              <li class="flex-row">
                <div class="ideal-tip-text current-config__label">
                  弹性公网IP
                </div>
                <div>19.9.175</div>
              </li>
            </ul>
          </div>
        </div>

        <el-divider border-style="dashed" />

        <div class="current-config__after">
          <ul class="flex-row">
            <li
              v-for="(item, index) in configItems"
              :key="index"
              class="flex-row"
            >
              <div class="ideal-tip-text current-config__label">
                {{ item.label }}
              </div>
              <div>{{ detailInfo[item.prop] }}</div>
            </li>
          </ul>
        </div>
      </div>

      <div class="change-specification">
        <p class="edit-bandwidth__content-title">变更规格</p>

        <el-form :model="configForm" label-position="left">
          <el-form-item label="带宽名称" prop="bandwidthName">
            <el-input v-model="configForm.bandwidthName" class="custom-input">
            </el-input>
          </el-form-item>

          <el-form-item label="计费方式" prop="billingMode">
            <el-radio-group
              v-model="configForm.billingMode"
              class="custom-radio"
            >
              <el-radio-button
                v-for="item of chargeModeList"
                :key="item.label"
                type="text"
                :label="item.label"
                >{{ item.name }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="带宽大小(MBit/s)">
            <el-radio-group
              v-model="configForm.bandwidthSize"
              class="number-radio ideal-default-margin-right"
            >
              <el-radio-button
                v-for="(item, index) of sizeList"
                :key="index"
                type="text"
                :label="item"
                >{{ item }}
              </el-radio-button>
            </el-radio-group>
            <span class="ideal-default-margin-right">自定义</span>
            <el-input-number v-model="configForm.bandwidthSize" class="ideal-default-margin-right">
            </el-input-number>
            <span class="ideal-warning-text">带宽范围:1-2,000 Mbit/s</span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <ideal-table-list
      v-if="stepsIndex === 2"
      :table-data="basicData"
      :table-headers="tableHeaders"
      :show-pagination="false"
      style="padding: 20px"
    >
    </ideal-table-list>

    <price-info
      :steps-index="stepsIndex"
      @clickPrevious="clickPrevious"
      @clickNext="clickNext"
      @clickComplete="clickComplete"
    >
    </price-info>
  </div>
</template>

<script setup lang="ts">
import priceInfo from './price-info.vue'
import { bandwidthInfo } from './edit-bandwidth'

const {
  configItems,
  detailInfo,
  chargeModeList,
  sizeList,
  configForm,
  basicData,
  tableHeaders
} = bandwidthInfo()

const stepsIndex = ref(1)
const clickPrevious = () => {
  if (stepsIndex.value === 1) {
    return
  }
  stepsIndex.value--
}
const clickNext = () => {
  if (stepsIndex.value === 1) {
    stepsIndex.value++
  }
}
const clickComplete = () => {}
</script>

<style scoped lang="scss">
.edit-bandwidth {
  margin: $idealMargin $idealMargin 80px;
  .custom-input {
    width: 352px;
  }
  .edit-bandwidth__tip {
    background-color: var(--custom-information-bg-color);
    border: 1px solid var(--el-color-primary);
    padding: 15px 20px;
    margin-bottom: 20px;
    ul {
      margin-left: 25px;
    }
  }
  .edit-bandwidth__content {
    background-color: #fff;
    padding: 20px;
    ul {
      flex-wrap: wrap;
    }
    ul li {
      list-style-type: none;
      width: 50%;
      line-height: 40px;
    }
    .edit-bandwidth__content-title {
      font-weight: 600;
      font-size: 15px;
    }
    .current-config__label {
      width: 50%;
    }
    .edit-bandwidth__content-config {
      background-color: var(--custom-information-bg-color);
      .current-config__before {
        padding: 20px 20px 0 20px;
      }
      .current-config__after {
        padding: 0 20px 20px 20px;
      }
    }
    .change-specification {
      padding: 20px;
      :deep(.number-radio .el-radio-button__inner) {
        width: 70px;
      }
    }
  }
}
</style>
