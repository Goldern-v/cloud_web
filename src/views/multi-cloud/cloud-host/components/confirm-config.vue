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
            <div class="flex-row confirm-title" @mouseenter="basicMouseEnter" @mouseleave="basicMouseLeave">
              <div>基本配置</div>
              <svg-icon v-if="showBasic" icon="edit-pen" class="ideal-svg-margin-left" @click="clickStep(0)"></svg-icon>
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

            <div class="flex-row confirm-title" @mouseenter="networkMouseEnter" @mouseleave="networkMouseLeave">
              <div>网络配置</div>
              <svg-icon v-if="showNetwork" icon="edit-pen" class="ideal-svg-margin-left" @click="clickStep(1)"></svg-icon>
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

            <div class="flex-row confirm-title" @mouseenter="highMouseEnter" @mouseleave="highMouseLeave">
              <div>高级配置</div>
              <svg-icon v-if="showHigh" icon="edit-pen" class="ideal-svg-margin-left" @click="clickStep(2)"></svg-icon>
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
              @change="changeBuyTime"
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
            :max="vmQuota"
          />
          <div>
            您最多可以创建{{ vmQuota }}台云服务器。
          </div>
        </el-form-item>

        <el-form-item label="协议">
          <el-checkbox v-model="form.agree" label="我已阅读并同意" />
          <el-button link type="primary" @click="clickProtocol">《镜像免责声明》</el-button>
        </el-form-item>
      </el-card>
    </el-form>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import type { FormInstance, FormRules } from 'element-plus'
import store from '@/store'
import { OperateEventEnum, BillingEnum } from '@/utils/enum'
import { timeValues } from './common'
import { useConfirm } from './confirm-config'

interface ConfirmProps {
  basicData?: any // 基础配置信息
  highData?: any // 高级配置信息
  networkData?: any // 网络配置信息
  quotaData?: any[] // 配额信息
}
const props = withDefaults(defineProps<ConfirmProps>(), {
  basicData: () => ({}),
  highData: () => ({}),
  networkData: () => ({}),
  quotaData: () => []
})

const vmQuota = computed(() => {
  const vm = props.quotaData.find((item: any) => item.type === 'VM')
  return vm?.total
})

const formRef = ref<FormInstance>()
const form = reactive({
  buyTime: 1,
  monitor: false,
  agree: false,
  count: 0
})
const rules = reactive<FormRules>({
  buyTime: [{ required: true, message: '包年包月请选择购买时长', trigger: 'blur'}]
})

const {
  basicInfo,
  networkInfo,
  highInfo
} = useConfirm()

const showBasic = ref(false)
const basicMouseEnter = () => {
  showBasic.value = true
}
const basicMouseLeave = () => {
  showBasic.value = false
}
const showNetwork = ref(false)
const networkMouseEnter = () => {
  showNetwork.value = true
}
const networkMouseLeave = () => {
  showNetwork.value = false
}
const showHigh = ref(false)
const highMouseEnter = () => {
  showHigh.value = true
}
const highMouseLeave = () => {
  showHigh.value = false
}

const isPackage = computed(() => props.basicData.billingMode === BillingEnum.PACKAGE)

// 监听底部购买时长选择
watch(() => store.commonStore.buyTime, value => {
  if (value) {
    form.buyTime = value
  }
})
const changeBuyTime = (value: any) => {
  store.commonStore.setBuyTime(value)
}
const clickProtocol = () => {
  showDialog.value = true
  dialogType.value = 'protocol'
}
// 跳转相应页面编辑
const clickStep = (index: number) => {
  emits(EventEnum.edit, index)
}
// 方法
enum EventEnum {
  edit = 'clickStep'
}
interface EventEmits {
  (e: EventEnum.edit, v: number): void
}
const emits = defineEmits<EventEmits>()
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
  dialogType.value = ''
}
const clickRefreshEvent = () => {
  showDialog.value = false
  dialogType.value = ''
}

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
  .confirm-title {
    width: 150px;
    cursor: pointer;
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
        width: 90px;
        text-align: left;
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
