<template>
  <div class="manage-network-create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="IP地址类型">
        <span>{{ form.ipAddressType }}</span>
      </el-form-item>

      <el-form-item prop="netType">
        <template #label>
          网络段方式
          <el-tooltip
            placement="right"
            effect="dark"
            popper-class="tooltipContent"
          >
            <template #content>
              <div>
                1、IP范围：可填写类似172.20.12.2到172.20.12.255，子网掩码填写255.255.0.0，网关填写172.20.0.1。
              </div>
              <div>2、CIDR：无类别域间路由，可填写192.168.1.0/24。</div>
              <div>注意：</div>
              <div>
                不可将网关（例如：xxx.xxx.xxx.1）、广播地址（例如：xxx.xxx.xxx.255）和网络地址（例如：xxx.xxx.xxx.0）等包含在添加的IP段中。
              </div>
            </template>
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
        </template>
        <span v-if="detail.networkCidr">{{ form.ipNetworkSegment }}</span>
        <el-radio-group v-else v-model="form.netType">
          <el-radio
            v-for="(item, index) in defaultConfig.netTypeList"
            :key="index"
            :label="item.label"
          >
            {{ item.name }}
          </el-radio>
        </el-radio-group>
        <div></div>
      </el-form-item>

      <section v-if="form.netType === 'ipScope'">
        <el-form-item label="起始IP" prop="startIp">
          <el-tooltip content="示例：192.168.0.100" placement="top">
            <el-input v-model.trim="form.startIp" class="custom-input" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="结束IP" prop="endIp">
          <el-tooltip content="示例：192.168.0.200" placement="top">
            <el-input v-model.trim="form.endIp" class="custom-input" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="子网掩码" prop="subnetMask">
          <el-tooltip content="示例：255.255.255.0" placement="top">
            <el-input v-model.trim="form.subnetMask" class="custom-input" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="网关" prop="ipGateway">
          <el-tooltip content="示例：192.168.0.1" placement="top">
            <el-input v-model.trim="form.ipGateway" class="custom-input" />
          </el-tooltip>
        </el-form-item>
      </section>

      <section v-if="form.netType === 'cidr'">
        <el-form-item label="CIDR" prop="cidr">
          <el-tooltip content="示例：192.168.1.0/24" placement="top">
            <el-input v-model.trim="form.cidr" class="custom-input" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="网关" prop="cidrGateway">
          <el-tooltip content="示例：192.168.0.1" placement="top">
            <el-input v-model.trim="form.cidrGateway" class="custom-input" />
          </el-tooltip>
        </el-form-item>
      </section>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  detail?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  detail: {}
})

const { t } = useI18n()

const formRef = ref()

const form = reactive({
  ipAddressType: 'IPv4',
  netType: 'ipScope',
  startIp: '',
  endIp: '',
  subnetMask: '',
  ipGateway: '',
  cidr: '',
  cidrGateway: '',
  ipNetworkSegment: 'IP范围'
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  layer2Network: [
    { required: true, message: '请选择二层网络', trigger: 'blur' }
  ],
  startIp: [{ required: true, message: '请选择二层网络', trigger: 'blur' }],
  endIp: [{ required: true, message: '请选择二层网络', trigger: 'blur' }],
  subnetMask: [{ required: true, message: '请选择二层网络', trigger: 'blur' }],
  ipGateway: [{ required: true, message: '请选择二层网络', trigger: 'blur' }],
  cidr: [{ required: true, message: '请输入cidr', trigger: 'blur' }],
  cidrGateway: [{ required: true, message: '请输入网关', trigger: 'blur' }]
})

interface IHooksBasic {
  tags?: any[]
  layer2NetworkName?: string
  netTypeList?: any[]
}
const defaultConfig: IHooksBasic = reactive({
  tags: [], //自动分配VLAN ID的状态
  layer2NetworkName: '',
  netTypeList: [
    { name: 'IP范围', label: 'ipScope' },
    { name: 'CIDR', label: 'cidr' }
  ]
})

/**
 * 确定、取消
 */
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}

const submitForm = (formEl: FormInstance | undefined) => {
  emit(EventEnum.success)
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
</script>

<style scoped lang="scss">
.manage-network-create {
  .custom-input {
    width: 100%;
  }
}
</style>
