<template>
  <div class="subnet-config">
    <el-card class="ideal-large-margin-top">
      <el-form
        ref="subnetRef"
        :model="form"
        :rules="rules"
        label-position="left"
      >
        <el-form-item>
          <div class="flex-row ideal-header-container">
            <el-divider direction="vertical" />
            <div v-if="subnetIndex === 0">默认子网</div>
            <div v-else>
              子网{{ subnetIndex
              }}<svg-icon
                style="color: var(--el-color-primary)"
                icon="delete-icon"
                class="ideal-svg-margin-left"
                @click="reduceSubnet(subnetIndex)"
              ></svg-icon>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="可用区" prop="availableZone">
          <el-radio-group v-model="form.availableZone" class="ideal-default-margin-right">
            <el-radio-button
              v-for="(item, index) of availableZoneList"
              :key="index"
              :label="item.code"
              >{{ item.name }}
            </el-radio-button>
          </el-radio-group>

          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="可用区"
            placement="right"
          >
            <svg-icon icon="question-icon"></svg-icon>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="名称" prop="subnetName">
          <el-input v-model="form.subnetName" class="custom-input" />
        </el-form-item>

        <el-form-item label="子网IPv4网段">
          <div class="flex-column" style="width: 100%">
            <ideal-ip-input
              :ip-value="form.subnetIp4vCidr"
              port-split="/"
              :select-cidr="form.subnetIp4vCidr"
              :port-options="state.portOptions"
              @listenChange="subnetIp4vChangeEvent"
            ></ideal-ip-input>
            <div class="ideal-tip-text">
              可用IP数：251 子网创建完成后，子网网段无法修改
            </div>
          </div>
        </el-form-item>

        <el-form-item label="子网IPv6网段">
          <el-checkbox v-model="form.openIpv6" label="开启IPv6" class="ideal-default-margin-right" />
          <el-tooltip
            effect="dark"
            placement="right"
            content="开启IPv6"
            popper-class="basic-config__tooltip"
          >
            <svg-icon icon="question-icon"></svg-icon>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="子网IPv6网段">
          <div class="ideal-default-margin-right">默认</div>
          <el-tooltip
            effect="dark"
            placement="right"
            content="子网IPv6网段"
            popper-class="basic-config__tooltip"
          >
            <svg-icon icon="question-icon"></svg-icon>
          </el-tooltip>
        </el-form-item>

        <el-divider border-style="dashed" />

        <el-form-item label="高级配置">
          <template #label>
            <div class="flex-row">
              <div>高级配置</div>
              <svg-icon
                v-if="!state.subnetHighConfig"
                icon="down-arrow"
                class="ideal-svg-margin-left"
                @click="state.subnetHighConfig = !state.subnetHighConfig"
              ></svg-icon>
              <svg-icon
                v-if="state.subnetHighConfig"
                icon="up-arrow"
                class="ideal-svg-margin-left"
                @click="state.subnetHighConfig = !state.subnetHighConfig"
              ></svg-icon>
            </div>
          </template>

          <div>网关 | DNS服务器地址 | 标签 | 描述</div>
        </el-form-item>
        <template v-if="state.subnetHighConfig">
          <el-form-item label="网关" prop="gateway">
            <ideal-ip-input
              :ip-value="form.gateway"
              :ip-disabled="ipDisabled"
              :select-cidr="form.gateway"
              @listenChange="gatewayChangeEvent"
            ></ideal-ip-input>
          </el-form-item>

          <el-form-item label="DNS服务器地址" prop="dnsServer">
            <div class="flex-column custom-form-item">
              <div class="flex-row">
                <el-input v-model="form.dnsServer" clearable />
                <el-button link>重置</el-button>
                <svg-icon icon="question-icon"></svg-icon>
              </div>

              <div class="ideal-tip-text">
                DNS服务器地址最多支持2个IP，请以英文逗号隔开。
              </div>
            </div>
          </el-form-item>

          <el-form-item label="描述">
            <el-input
              v-model="form.subnetDesc"
              type="textarea"
              placeholder="请输入内容"
              show-word-limit
              maxlength="150"
              class="custom-input"
            />
          </el-form-item>
        </template>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'

interface SubnetProps {
  availableZoneList?: any //可用区
  subnetItem?: any
  subnetIndex?: number //子网索引
}

const props = withDefaults(defineProps<SubnetProps>(), {
  availableZoneList: () => [],
  subnetItem: () => ({}),
  subnetIndex: 0
})

const form = computed(() => props.subnetItem as any)

const rules = reactive<FormRules>({
  availableZone: [{ required: true, message: '选择可用区', trigger: 'blur' }],
  subnetName: [{ required: true, message: '请输入子网名称', trigger: 'blur' }]
})

const state = reactive({
  subnetHighConfig: false, //是否显示子网高级配置
  availableZoneList: [] as any[], //可用区
  portOptions: [
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 29
  ] //可选择的端口
})

const subnetIp4vChangeEvent = (val: string) => {
  emit('subnetIp4vChange', val, props.subnetIndex)
}
const gatewayChangeEvent = (val: string) => {
  emit('gatewayChange', val, props.subnetIndex)
}

const ipDisabled: any = ref({
  0: true,
  1: true,
  2: true,
  3: false
})

// 方法
interface EventEmits {
  (e: 'reduceSubnet', v: number): void
  (e: 'subnetIp4vChange', v: string, index: number): void
  (e: 'gatewayChange', v: string, index: number): void
}
const emit = defineEmits<EventEmits>()
const reduceSubnet = (index: number) => {
  emit('reduceSubnet', index)
}
defineExpose({
  form
})
</script>

<style scoped lang="scss">
.subnet-config {
  .custom-input,
  .custom-form-item {
    width: 20%;
  }
  .ideal-header-container {
    width: 100%;
  }
}
</style>
