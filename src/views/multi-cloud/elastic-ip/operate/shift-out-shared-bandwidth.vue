<template>
  <div class="shift-out-shared-bandwidth">
    <div class="flex-row shift-out-shared-bandwidth__tip">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <div>
        弹性公网IP移出共享带宽后，分配按带宽计费带宽，默认带宽大小5Mbit/s，您可以自定义带宽上限。
      </div>
    </div>

    <div class="shift-out-shared-bandwidth__content">
      <ul class="flex-row">
        <li v-for="(item, index) in configItems" :key="index" class="flex-row">
          <div class="ideal-tip-text custom__label">
            {{ item.label }}
          </div>
          <div>{{ rowData[item.prop] }}</div>
        </li>
      </ul>
    </div>

    <div class="shift-out-eip_specification">
      <p class="shift-out-eip_specification-title">EIP移出后规格</p>
      <el-form :model="specificationForm" label-position="left">
        <el-form-item label="计费模式" prop="bandwidthName">
          <el-radio-group
            v-model="specificationForm.billingMode"
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
          <el-input-number
            v-model="specificationForm.bandwidthSize"
            class="custom-margin-right"
          >
          </el-input-number>
          <span class="ideal-warning-text ideal-default-margin-left">带宽范围:1-2,000 Mbit/s</span>
        </el-form-item>

        <el-form-item label="公网带宽费用"
          ><span class="price-info"> ￥{{ price }}</span
          >/小时
        </el-form-item>
      </el-form>
    </div>
    <div class="flex-row ideal-submit-button" style="justify-content: center">
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
interface PowerOnProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<PowerOnProps>(), {
  rowData: () => ({})
})

const configItems = [
  { label: '弹性公网IP', prop: 'ip' },
  { label: '共享带宽', prop: 'sharedBandwidth' },
  { label: '类型', prop: 'bandwidthType' },
  { label: '带宽大小', prop: 'bandwidthSize' },
  { label: '已绑定实例', prop: 'bindInstance' }
]
const specificationForm = reactive({
  bandwidthName: '',
  billingMode: 1,
  bandwidthSize: ''
})
const detailInfo: any = ref({})
const chargeModeList = [
  { label: 1, name: '按带宽计费' },
  { label: 0, name: '按流量计费' }
]
const price = ref(0.315)
onMounted(() => {})

interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const cancelForm = () => {
  emit(EventEnum.cancel)
}
const submitForm = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.shift-out-shared-bandwidth__tip {
  background-color: var(--custom-information-bg-color);
  border: 1px solid var(--el-color-primary);
  padding: 15px 20px;
}
.shift-out-shared-bandwidth__content {
  background-color: var(--custom-information-bg-color);
  margin-top: 20px;
  padding: 20px;
  ul {
    flex-wrap: wrap;
  }
  ul li {
    list-style-type: none;
    width: 50%;
    line-height: 40px;
  }
  .custom__label {
    width: 50%;
  }
}
.shift-out-eip_specification-title {
  font-weight: 500;
  font-size: 14px;
  margin: 20px 0;
}
.price-info {
  color: $error6-light;
}
</style>
