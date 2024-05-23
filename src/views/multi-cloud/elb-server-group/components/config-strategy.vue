<template>
  <div class="config-strategy">
    <el-form
      ref="strategyRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-card>
        <el-form-item label="负载均衡类型" prop="elbType" required>
          <div class="flex-column">
            <el-radio-group v-model="form.elbType" @change="elbTypeChange">
              <el-radio-button
                v-for="(item, index) of elbTypeList"
                :key="index"
                :label="item.label"
                >{{ item.name }}</el-radio-button
              >
            </el-radio-group>
          </div>
        </el-form-item>

        <template v-if="form.elbType === 'exclusive'">
          <el-form-item label="所属负载均衡器" prop="loadBalancerType" required>
            <div class="flex-column">
              <el-radio-group
                v-model="form.loadBalancerType"
                @change="elbTypeChange"
              >
                <el-radio
                  v-for="(item, index) of loadBalancerTypeList"
                  :key="index"
                  :label="item.label"
                  >{{ item.name }}</el-radio
                >
              </el-radio-group>
              <div
                v-if="form.loadBalancerType === 'unTouch'"
                class="ideal-warning-text"
              >
                混合类型的后端服务器组需选定虚拟私有云，并可关联至同属该虚拟私有云的独享型负载均衡器使用。
              </div>
              <div v-else style="margin-top: 18px">
                <el-select v-model="form.loadBalancer">
                  <el-option
                    v-for="(item, index) in exitLoadBalancerList"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <svg-icon
                  icon="refresh-icon"
                  class="ideal-svg-margin-left"
                ></svg-icon>
                <el-text type="primary" class="ideal-default-margin-left">查看负载均衡</el-text>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="转发模式" prop="forwardMode" required>
            <div class="flex-column">
              <el-radio-group v-model="form.forwardMode">
                <el-radio-button
                  v-for="(item, index) of forwardModeList"
                  :key="index"
                  :label="item.label"
                  >{{ item.name }}</el-radio-button
                >
              </el-radio-group>
            </div>
          </el-form-item>

          <el-form-item label="服务器组类型" prop="serverGroupType">
            <div class="flex-column">
              <el-select v-model="form.serverGroupType" class="custom-input">
                <el-option
                  v-for="(item, index) in serverGroupTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div class="ideal-tip-text">
                可以添加IP地址、服务器、辅助弹性网卡类型的后端服务器。
              </div>
            </div>
          </el-form-item>
        </template>

        <el-form-item
          v-if="form.elbType === 'share'"
          label="所属负载均衡器"
          prop="loadBalancer"
        >
          <el-select v-model="form.loadBalancer">
            <el-option
              v-for="(item, index) in exitLoadBalancerList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <svg-icon icon="refresh-icon" class="ideal-svg-margin-left"></svg-icon>
          <el-text type="primary" class="ideal-default-margin-left">查看负载均衡</el-text>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input
            v-model.trim="form.name"
            placeholder="请输入名称"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item
          v-if="form.elbType === 'exclusive'"
          label="虚拟私有云"
          prop="vpc"
        >
          <el-select v-model="form.vpc" class="custom-input">
            <el-option
              v-for="(item, index) in vpcList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <svg-icon icon="refresh-icon" class="ideal-svg-margin-left"></svg-icon>
          <el-text type="primary" class="ideal-default-margin-left">查看虚拟私有云</el-text>
        </el-form-item>

        <el-form-item label="后端协议" prop="protocol">
          <el-select v-model="form.protocol">
            <el-option
              v-for="(item, index) in protocolList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <template v-if="form.forwardMode === 'lbs'">
          <el-form-item label="分配策略类型" prop="strategyType">
            <div class="flex-column">
              <el-radio-group v-model="form.strategyType">
                <el-radio-button
                  v-for="(item, index) of typeList"
                  :key="index"
                  :label="item.label"
                  >{{ item.name }}</el-radio-button
                >
              </el-radio-group>
            </div>
          </el-form-item>

          <el-form-item
            v-if="form.strategyType !== 'source-ip'"
            label="会话保持"
          >
            <div class="flex-column">
              <span>
                <el-switch v-model="form.session" class="ideal-default-margin-right"></el-switch>
                <el-tooltip
                  popper-class="custom-tooltip"
                  effect="dark"
                  content=""
                  placement="right"
                >
                  <svg-icon icon="question-icon"></svg-icon>
                </el-tooltip>
              </span>
            </div>
          </el-form-item>
        </template>

        <template v-if="form.session">
          <el-form-item label="会话保持类型" prop="sessionType">
            <el-select v-model="form.sessionType">
              <el-option
                v-for="(item, index) in sessionTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="interval" label="会话保持时间（分钟）">
            <template class="flex-column">
              <el-input
                v-model="form.sessionTime"
                class="custom-input"
              ></el-input>
              <div class="ideal-tip-text">取值范围1~1440</div>
            </template>
          </el-form-item>
        </template>

        <el-form-item
          v-if="
            form.elbType === 'exclusive' &&
            form.forwardMode === 'lbs' &&
            form.loadBalancerType === 'unTouch'
          "
          label="慢启动"
        >
          <div class="flex-column">
            <span>
              <el-switch v-model="form.slowStart" class="ideal-default-margin-right"></el-switch>
              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                content=""
                placement="right"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </span>
          </div>
        </el-form-item>

        <el-form-item v-if="form.slowStart" label="慢启动时间（秒）">
          <template class="flex-column">
            <el-input
              v-model="form.slowStartTime"
              class="custom-input"
            ></el-input>
            <div class="ideal-tip-text">取值范围30~1200</div>
          </template>
        </el-form-item>

        <el-form-item label="描述" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入描述"
            class="custom-input"
          >
          </el-input>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { generateCode } from '@/utils/tool'

/**
 * 表单
 */
const strategyRef = ref<FormInstance>() // 校验表单
const form = reactive({
  elbType: 'exclusive',
  loadBalancerType: 'unTouch',
  loadBalancer: '',
  forwardMode: 'lbs',
  serverGroupType: 'mixed',
  name: 'server-group-' + generateCode(4), // vpc名称
  protocol: 'TCP',
  strategyType: 'weighted-polling',
  session: false,
  sessionType: '',
  sessionTime: 1,
  vpc: '',
  vpcName: '',
  slowStart: false,
  slowStartTime: 30,
  remark: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  subnetName: [{ required: true, message: '请输入子网名称', trigger: 'blur' }]
})

const elbTypeList = [
  { name: '独享型', label: 'exclusive' },
  { name: '共享型', label: 'share' }
]
const loadBalancerTypeList = [
  { name: '暂不关联', label: 'unTouch' },
  { name: '关联已有', label: 'exit' }
]
const forwardModeList: any = ref([])
const arr = [
  { name: '负载均衡', label: 'lbs' },
  { name: '主备转发', label: 'active-standby' }
]
watch(
  () => form.loadBalancerType,
  val => {
    forwardModeList.value =
      val === 'unTouch' ? arr : [{ name: '负载均衡', label: 'lbs' }]
    form.forwardMode = 'lbs'
  },
  { immediate: true }
)
const protocolList = ['TCP', 'UDP', 'HTTP', 'HTTPS']
const typeList = [
  { name: '加权轮询算法', label: 'weighted-polling' },
  { name: '加权最少连接', label: 'least-weighted' },
  { name: '源IP算法', label: 'source-ip' }
]
const serverGroupTypeList = [
  { label: '混合类型', value: 'mixed' },
  { label: 'IP类型', value: 'ip' }
]
const vpcList: any = ref([]) //vpc
const sessionTypeList: any = ref([]) //会话保持类型
const exitLoadBalancerList: any = ref([]) //共享型负载均衡器

const elbTypeChange = (val: string) => {
  form.loadBalancer = ''
}

defineExpose({
  form,
  strategyRef
})
</script>

<style scoped lang="scss">
.config-strategy {
  width: 100%;
  margin-bottom: 65px;
  :deep(.el-form) {
    padding: 0;
  }
}
.custom-input {
  width: $formInputWidth;
}
.el-text {
  font-size: 12px;
  cursor: pointer;
}
</style>
