<template>
  <div class="create-form">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="计费模式">
          <el-radio-group v-model="form.billingMode">
            <el-radio-button
              v-for="(item, index) of billingModeList"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="区域">
          <div>
            <el-select
              v-model="form.region"
              placeholder="请选择"
              class="ideal-default-margin-right"
            >
              <el-option
                v-for="item of regionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <div class="ideal-tip-text">
              不同区域的资源之间内网不互通。请选择靠近您客户的区域，可以降低网络延迟、提供访问速度。
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="线路">
          <el-radio-group v-model="form.line" class="ideal-default-margin-right">
              <el-radio-button label="普通带宽"></el-radio-button>
            </el-radio-group>
            
            <el-tooltip
              popper-class="custom-tooltip"
              effect="dark"
              content="线路"
              placement="right"
            >
              <svg-icon icon="question-icon"></svg-icon>
            </el-tooltip>
        </el-form-item>

        <el-form-item label="计费方式">
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

        <el-form-item label="带宽大小(Mbit/s)">
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

          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="带宽大小"
            placement="right"
          >
            <svg-icon icon="question-icon" class="ideal-svg-margin-right"></svg-icon>
          </el-tooltip>
          
          <div>自定义：</div>
          <el-input-number
            v-model="form.bandwidthSize"
            class="ideal-default-margin-right"
            :min="5"
            :max="2000"
          />
          <div class="ideal-warning-text">带宽范围：5-2,000 Mbit/s</div>
        </el-form-item>

        <el-form-item label="名称">
          <el-input v-model="form.name"/>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="购买时长">
          <div class="flex-column">
            <el-radio-group v-model="form.buyTime" class="ideal-default-margin-right">
              <el-radio-button
                v-for="(item, index) in timeValues"
                :key="index"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>

            <el-checkbox v-model="form.autoRenew" label="自动续费" />
          </div>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { BillingEnum } from '@/utils/enum'

const formRef = ref<FormInstance>()
const form = reactive({
  billingMode: BillingEnum.ON_DEMAND, // 计费模式
  region: '', // 区域
  line: '', // 线路
  chargeMode: '', // 计费方式
  bandwidthSize: 5,
  name: '', // 名称
  buyTime: 1,
  autoRenew: false // 自动续费
})
const rules = reactive<FormRules>({
  repositorySize: [
    { required: true, message: '请选择存储库容量大小', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请选择存储库名称', trigger: 'blur' }]
})
const regionList: any = ref([
  { label: '华南-广州一', value: '1' }
])
const billingModeList = [
  { label: BillingEnum.PACKAGE, value: '包年包月' },
  { label: BillingEnum.ON_DEMAND, value: '按需收费' }
]
const chargeModeList = [
  { label: '1', value: '按带宽计费' },
]
const bandwidthSizes = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '100', value: 100 },
  { label: '200', value: 200 }
]

onMounted(() => {
  form.name = 'bandwidth-' + Math.random().toString(36).substring(9)
})

// 购买时长
const timeValues = [
  { label: '1月', value: 1 },
  { label: '2月', value: 2 },
  { label: '3月', value: 3 },
  { label: '4月', value: 4 },
  { label: '5月', value: 5 },
  { label: '6月', value: 6 },
  { label: '7月', value: 7 },
  { label: '8月', value: 8 },
  { label: '9月', value: 9 },
  { label: '10月', value: 10 },
  { label: '11月', value: 11 },
  { label: '1年', value: 12 },
  { label: '2年', value: 13 },
  { label: '3年', value: 14 },
  { label: '4年', value: 15 },
  { label: '5年', value: 16 }
]

defineExpose({
  formRef,
  form
})
</script>

<style scoped lang="scss">
.create-form {
  width: 100%;
  :deep(.el-card__body) {
    padding: 20px 20px 0;
  }
  :deep(.el-table) {
    height: 196px;
  }
  :deep(.el-table__header) {
    height: 49px;
  }
  :deep(.el-table tr) {
    height: 49px;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
