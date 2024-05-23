<template>
  <div class="confirm-config">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-card>
        <el-form-item label="确认配置">
          <div class="flex-column" style="width: 100%;">
            <div class="flex-row">
              <div>基本配置</div>
              <svg-icon icon="edit-pen" @click="clickStep(1)"></svg-icon>
            </div>
            <div class="confirm-info">
              <div
                v-for="(item, index) of basicInfo"
                :key="index"
                class="flex-row confirm-info-item"
              >
                <div class="confirm-info-item--label">{{ item.label }}：</div>
                <div class="confirm-info-item--value">{{ basicData[item.value] }}</div>
              </div>
            </div>

            <div class="flex-row">
              <div>网络配置</div>
              <svg-icon icon="edit-pen" @click="clickStep(2)"></svg-icon>
            </div>
            <div class="confirm-info">
              <div
                v-for="(item, index) of networkInfo"
                :key="index"
                class="flex-row confirm-info-item"
              >
                <div class="confirm-info-item--label">{{ item.label }}：</div>
                <div class="confirm-info-item--value">{{ networkData[item.value] }}</div>
              </div>
            </div>

            <div class="flex-row">
              <div>高级配置</div>
              <svg-icon icon="edit-pen" @click="clickStep(3)"></svg-icon>
            </div>
            <div class="confirm-info">
              <div
                v-for="(item, index) of highInfo"
                :key="index"
                class="flex-row confirm-info-item"
              >
                <div class="confirm-info-item--label">{{ item.label }}：</div>
                <div class="confirm-info-item--value">{{ highData[item.value] }}</div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item v-if="isPackage" label="购买时长" prop="buyTime">
          <div class="flex-column">
            <el-radio-group
              v-model="form.buyTime"
              class="ideal-default-margin-right"
            >
              <el-radio-button
                v-for="(item, index) of timeValues"
                :key="index"
                :label="item.value"
              >
                {{ item.title }}
              </el-radio-button>
            </el-radio-group>

            <div class="flex-row">
              <el-checkbox v-model="form.monitor" label="开启详情监控" />
              <div><span class="custom-theme-button">扣款规则</span>和<span class="custom-theme-button">续费时长</span></div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="购买数量">
          <el-input-number
            v-model="form.count"
            class="ideal-default-margin-right"
            :min="1"
            :max="10"
          />
          <div>
            您最多可以创建200台裸金属服务器。
            申请更多裸金属服务器配额请单击<span class="custom-theme-button">申请扩大配额</span>。
          </div>
        </el-form-item>

        <el-form-item label="协议">
          <el-checkbox v-model="form.monitor" label="我已阅读并同意" />
          <div>《镜像免责声明》</div>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import store from '@/store'
import { timeValues } from './common'
import { BillingEnum } from '@/utils/enum'

const formRef = ref<FormInstance>()
const form = reactive({
  buyTime: 1,
  monitor: false,
  count: 0
})
// 监听底部购买时长选择
watch(() => store.commonStore.buyTime, value => {
  if (value) {
    form.buyTime = value
  }
})
const rules = reactive<FormRules>({
  buyTime: [{ required: true, message: '包年包月请选择购买时长', trigger: 'blur'}]
})
enum EventEnum {
  edit = 'clickStep'
}
interface EventEmits {
  (e: EventEnum.edit, v: number): void
}
const emits = defineEmits<EventEmits>()
// 跳转相应页面编辑
const clickStep = (index: number) => {
  emits(EventEnum.edit, index)
}
interface ConfirmProps {
  basicData?: any
  highData?: any
  networkData?: any
}
const props = withDefaults(defineProps<ConfirmProps>(), {
  basicData: () => ({}),
  highData: () => ({}),
  networkData: () => ({})
})

const isPackage = computed(() => props.basicData.billingMode === BillingEnum.PACKAGE)
watch(() => props.basicData, value => {
}, {
  deep: true
})
// 基本配置
const basicInfo = [
  { label: '计费模式', value: 'billingModeName' },
  { label: '区域', value: 'regionName' },
  { label: '可用区', value: 'availableZoneName' },
  { label: '规格', value: 'specification' },
  { label: '镜像', value: 'mirrorName' },
  { label: '主机安全', value: '免费开启主机安全基础防护' },
  { label: '系统盘', value: 'systemDiskName' }
]
// 网络配置
const networkInfo = [
  { label: '虚拟私有云', value: 'vpcInfo' },
  { label: '安全组', value: 'safeGroupInfo' },
  { label: '主网卡', value: 'subnetInfo' },
  { label: '弹性公网IP', value: 'eipInfo' }
]
// 高级配置
const highInfo = [
  { label: '裸金属服务器名称', value: 'cloudHostName' },
  { label: '登录凭证', value: 'loginCredentialsName' }
]

defineExpose({
  formRef,
  form
})
</script>

<style scoped lang="scss">
.confirm-config {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .confirm-info {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .confirm-info-item {
      width: 31%;
      font-size: 14px;
      .confirm-info-item--label {
        color: #8b8b8b;
        width: 120px;
        text-align: right;
      }
      .confirm-info-item--value {
        color: #000000;
        width: calc(100% - 120px);
      }
    }
  }
  .custom-theme-button {
    cursor: pointer;
    color: var(--el-color-primary);
  }
  :deep(.el-card__body) {
    padding: 20px 20px 0;
  }
}
</style>
