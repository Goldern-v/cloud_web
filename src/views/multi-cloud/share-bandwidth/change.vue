<template>
  <div class="change">
    <div class="flex-row change-tip">
      <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-default-margin-right"></svg-icon>
      <div class="ideal-default-margin-right">变更须知</div>
      <div>
        <div>按需付费弹性公网IP支持修改带宽名称、大小和计费方式。</div>
        <div>带宽计费方式：按带宽计费将按固定带宽大小收费，按流量收费将按带宽实际使用的流量收费。</div>
        <div>降低带宽大小：可能会影响业务流量造成丢包，请确认对业务产生的影响，谨慎操作。</div>
      </div>
    </div>

    <div class="change-info">
      <div class="change-info-current">
        <el-descriptions title="当前配置" :column="2">
          <el-descriptions-item label="带宽名称">bandwidth-023a</el-descriptions-item>
          <el-descriptions-item label="带宽大小(Mbit/s)">5</el-descriptions-item>
          <el-descriptions-item label="计费方式">按带宽计费</el-descriptions-item>
          <el-descriptions-item label="带宽类型">共享</el-descriptions-item>
        </el-descriptions>
      </div>
      
      <div class="change-info-title">变更规格</div>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
        <el-form-item label="带宽名称" prop="name">
          <el-select
            v-model="form.name"
            placeholder="请选择"
            class="ideal-default-margin-right"
          >
            <el-option
              v-for="item of bandwidthList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计费方式" prop="chargeMode">
          <el-radio-group v-model="form.chargeMode" class="ideal-default-margin-right">
            <el-radio-button
              v-for="(item, index) of chargeModeList"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="带宽大小(Mbit/s)" prop="bandwidthSize">
          <el-radio-group
            v-model="form.bandwidthSize"
            class="ideal-default-margin-right"
          >
            <el-radio-button
              v-for="(item, index) in bandwidthSizes"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
          
          <div>自定义：</div>
          <el-input-number
            v-model="form.bandwidthSize"
            class="ideal-default-margin-right"
            :min="5"
            :max="2000"
          />
          <div class="ideal-warning-text">带宽范围：5-2,000 Mbit/s</div>
        </el-form-item>
      </el-form>
    </div>

    <div class="change-footer">
      <div class="flex-row flex-row-between">
        <div class="flex-row ideal-large-margin-left">
          <div>变更后费用：</div>
          <div class="change-footer-price">¥{{ price }}</div>
          <div>/小时</div>
          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="变更费用"
            placement="right"
          >
            <svg-icon icon="question-icon" class="ideal-svg-margin-left"></svg-icon>
          </el-tooltip>
        </div>

        <div class="flex-row ideal-large-margin-right">
          <el-button @click="clickCancel">{{ t('cancel') }}</el-button>
          <el-button type="primary">{{ t('submit') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 带宽名称
  chargeMode: '', // 计费方式
  bandwidthSize: 1 // 带宽大小
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请选择带宽', trigger: 'blur' }],
  chargeMode: [{ required: true, message: '请选择计费方式', trigger: 'blur' }],
  bandwidthSize: [{ required: true, message: '请选择带宽大小', trigger: 'blur' }]
})
const bandwidthList: any = ref([])
const chargeModeList = [
  { label: '1', value: '按带宽计费' },
]
const bandwidthSizes = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '100', value: 100 },
  { label: '200', value: 200 }
]
const price = ref(22.835)
const router = useRouter()
const clickCancel = () => {
  router.back()
}
</script>

<style scoped lang="scss">
$bottomHeight: 60px;
.change {
  margin: $idealMargin $idealMargin ($bottomHeight + 20px);
  .change-tip {
    background-color: var(--el-color-primary-light-9);
    padding: 20px;
    border-radius: $circleRadiusSize;
    border: 1px solid var(--el-color-primary);
  }
  .change-info {
    background-color: white;
    border-radius: $circleRadiusSize;
    padding: 20px;
    margin-top: 20px;
    .change-info-current {
      background-color: var(--el-color-primary-light-9);
      padding: 20px 20px 10px;
    }
    :deep(.el-descriptions__body .el-descriptions__table:not(.is-bordered) .el-descriptions__cell) {
      background-color: var(--el-color-primary-light-9);
    }
  }
  .change-info-title {
    font-size: 16px;
    font-weight: 600;
    margin: 20px 20px 0;
  }
  .flex-row-between {
    justify-content: space-between;
    align-items: center;
  }
  .change-footer {
    position: fixed;
    width: calc(100% - $sidebarWidth);
    bottom: 0;
    left: $sidebarWidth;
    background: #fff;
    z-index: 2000;
    box-shadow: 5px 5px 17px 9px #e5e9ea;
    text-align: right;
    overflow: hidden;
    height: $bottomHeight;
    line-height: $bottomHeight;
    .change-footer-price {
      color: $error6-light;
      font-size: 18px;
    }
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
