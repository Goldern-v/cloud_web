<template>
  <div>
    <p>配置健康检查</p>
    <el-form :model="form" label-position="left">
      <el-form-item label="是否开启">
        <div class="flex-column">
          <el-switch v-model="form.enable"></el-switch>
          <div>
            健康检查用于检查后端服务器的业务可用性，负载均衡能自动排除健康状况异常的后端服务器。
            <span style="color: var(--el-color-primary)">了解更多</span>
          </div>
        </div>
      </el-form-item>

      <el-form-item>
        <template #label>
          参数配置
          <svg-icon
            icon="edit-pen"
            class="ideal-svg-margin-left"
            @click="showEdit = !showEdit"
          ></svg-icon>
        </template>
        <ideal-detail-info
          v-if="!showEdit"
          :label-array="labelArray"
          label-position="left"
          :show-colon="false"
          :detail-info="form"
          class="basic-info"
        >
        </ideal-detail-info>
      </el-form-item>

      <template v-if="showEdit">
        <el-form-item prop="protocol" required>
          <template #label>
            健康检查协议
            <el-tooltip
              effect="dark"
              placement="right"
              content=""
              popper-class="vdc-form--create__tooltip"
            >
              <svg-icon
                icon="question-icon"
                class="ideal-svg-margin-left"
              ></svg-icon>
            </el-tooltip>
          </template>
          <div class="flex-column">
            <el-select v-model="form.protocol">
              <el-option
                v-for="(item, index) of protocolList"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="健康检查域名">
          <el-radio-group v-model="form.domain">
            <el-radio
              v-for="(item, index) of domainList"
              :key="index"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="健康检查端口">
          <el-radio-group v-model="form.port">
            <el-radio
              v-for="(item, index) of portList"
              :key="index"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="path">
          <template #label>
            健康检查路径
            <el-tooltip
              effect="dark"
              placement="right"
              content=""
              popper-class="vdc-form--create__tooltip"
            >
              <svg-icon
                icon="question-icon"
                class="ideal-svg-margin-left"
              ></svg-icon>
            </el-tooltip>
          </template>
          <div class="flex-column">
            <el-input v-model="form.path" class="custom-input"></el-input>
            <div class="ideal-tip-text">{{ checkCondition }}</div>
          </div>
        </el-form-item>

        <el-form-item prop="interval">
          <template #label>
            检查间隔(秒)
            <el-tooltip
              effect="dark"
              placement="right"
              content=""
              popper-class="vdc-form--create__tooltip"
            >
              <svg-icon
                icon="question-icon"
                class="ideal-svg-margin-left"
              ></svg-icon>
            </el-tooltip>
          </template>
          <template class="flex-column">
            <el-input v-model="form.interval" class="custom-input"></el-input>
            <div class="ideal-tip-text">取值范围1~50</div>
          </template>
        </el-form-item>

        <el-form-item prop="timeout">
          <template #label>
            超时时间(秒)
            <el-tooltip
              effect="dark"
              placement="right"
              content=""
              popper-class="vdc-form--create__tooltip"
            >
              <svg-icon
                icon="question-icon"
                class="ideal-svg-margin-left"
              ></svg-icon>
            </el-tooltip>
          </template>
          <template class="flex-column">
            <el-input v-model="form.timeout" class="custom-input"></el-input>
            <div class="ideal-tip-text">取值范围1~50</div>
          </template>
        </el-form-item>

        <el-form-item prop="time">
          <template #label>
            最大重试次数
            <el-tooltip
              effect="dark"
              placement="right"
              content=""
              popper-class="vdc-form--create__tooltip"
            >
              <svg-icon
                icon="question-icon"
                class="ideal-svg-margin-left"
              ></svg-icon>
            </el-tooltip>
          </template>
          <template class="flex-column">
            <el-input v-model="form.time" class="custom-input"></el-input>
            <div class="ideal-tip-text">取值范围1~10</div>
          </template>
        </el-form-item>

        <el-form-item prop="code">
          <template #label>
            健康检查返回码
            <el-tooltip
              effect="dark"
              placement="right"
              content=""
              popper-class="vdc-form--create__tooltip"
            >
              <svg-icon
                icon="question-icon"
                class="ideal-svg-margin-left"
              ></svg-icon>
            </el-tooltip>
          </template>
          <template class="flex-column">
            <el-input v-model="form.code" class="custom-input"></el-input>
            <div class="ideal-tip-text">输入范围2XX-5XX</div>
          </template>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
/**
 * 配置检查表单
 */

const form = reactive({
  enable: '',
  protocol: 'HTTP',
  port: 'default',
  portName: '使用后端服务器默认端口业务',
  interval: 5,
  timeout: 3,
  time: 3,
  domain: 'offer',
  domainName: '使用后端服务器的内网IP为域名',
  path: '/',
  code: 200
})

const labelArray = [
  { label: '健康检查协议', prop: 'protocol' },
  { label: '健康检查域名', prop: 'domainName' },
  { label: '健康检查端口', prop: 'portName' },
  { label: '健康检查路径', prop: 'path' },
  { label: '检查间隔(秒)', prop: 'interval' },
  { label: '超时时间(秒)', prop: 'timeout' },
  { label: '最大重试次数', prop: 'time' },
  { label: '健康检查返回码', prop: 'code' }
]

const showEdit = ref(false)
const protocolList = ['HTTP', 'HTTPS', 'TCP']
const domainList = [
  { label: '使用后端服务器的内网IP为域名', value: 'offer' },
  { label: '指定特定域名', value: 'specific' }
]
const portList = [
  { label: '使用后端服务器默认业务端口', value: 'default' },
  { label: '指定特定域名端口', value: 'specific' }
]

const domainFormat: any = {
  offer: '使用后端服务器的内网IP为域名',
  specific: '指定特定域名'
}
const portFormat: any = {
  default: '使用后端服务器默认业务端口',
  specific: '指定特定域名端口'
}

const checkCondition = ref(
  "必须以/开头,长度限制为1~80个字符。支持使用英文字母、数字和字符-/.%?&#以及扩展字符集_;~!()*[]@$^:',+。"
)
watch(
  () => form,
  value => {
    value.domainName = domainFormat[value.domain]
    value.portName = portFormat[value.port]
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.custom-input {
  width: $formInputWidth;
}
</style>
