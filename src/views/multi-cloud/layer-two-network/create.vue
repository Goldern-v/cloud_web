<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      style="padding-right: 10px"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model.trim="form.name"
          style="width: 95%"
          show-word-limit
          maxlength="32"
        />
        <el-tooltip placement="right">
          <template #content>
            <div style="line-height: 25px">
              1.二层网络对应了二层广播域，进行二层相关的隔离，一般以设备编号进行识别。
              <br />2.二层网络目前只支持一种类型：L2VlanNetwork。
              <br />3.创建二层网络，需注意： <br />a. 创建 NoVLAN 或 VLAN
              二层网络，挂载的集群内物理机需存在此网络设备。 <br />b. 创建软件
              SDN 类型 VXLAN Pool，挂载的集群内物理机需存在 VTEP IP。 <br />c.
              创建硬件 SDN 类型 VXLAN Pool，挂载的集群内物理机网卡应与 SDN
              控制器管理下的交换机相连。<br />
              4、{{ vmwarePrompt.MAZ_MIDDLE_NAME }}
            </div>
          </template>
          <svg-icon
            icon="question-icon"
            class="ideal-svg-margin-left"
          ></svg-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          show-word-limit
          maxlength="128"
          style="width: 95%"
        />
        <el-tooltip placement="right">
          <template #content>{{ vmwarePrompt.DESC }}</template>
          <svg-icon
            icon="question-icon"
            class="ideal-svg-margin-left"
          ></svg-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="form.type"
          clearable
          placeholder="请选择类型"
          style="width: 100%"
          :loading="defaultConfig.loading"
        >
          <el-option
            v-for="item in defaultConfig.typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="allocateStatus ? 'VLAN ID' : '网络类型'"
        :prop="allocateStatus ? 'vlanId' : 'networkType'"
      >
        <div class="flex-column">
          <div>
            <el-input-number
              v-if="allocateStatus"
              v-model="form.vlanId"
              :min="1"
              :max="4096"
            />
            <el-tooltip
              v-if="allocateStatus"
              content="不能超过4096的数字"
              placement="right"
            >
              <svg-icon
                icon="question-icon"
                class="ideal-svg-margin-left ideal-svg-margin-right"
              ></svg-icon>
            </el-tooltip>
            <el-select
              v-if="!allocateStatus"
              v-model="form.networkType"
              clearable
              placeholder="请选择网络类型"
              :loading="defaultConfig.loading"
              style="margin-right: 5px"
              @change="changeNetworkType"
            >
              <el-option
                v-for="(val, key) in networkTypeList"
                :key="key"
                :label="val"
                :value="key"
              ></el-option>
            </el-select>
            <el-button v-if="allocateStatus" @click="autoAllocate"
              >自动分配VLAN ID</el-button
            >
            <el-button v-if="!allocateStatus" @click="cancelAutoAllocate"
              >取消自动分配VLAN ID</el-button
            >
          </div>
          <div>
            <el-button
              v-if="allocateStatus"
              style="margin-top: 10px"
              @click="checkVlanIdStatus"
              >检测VLAN ID是否可用</el-button
            >
          </div>
        </div>
      </el-form-item>
      <el-form-item label="网卡名称" prop="nicName">
        <el-select
          v-model="form.nicName"
          style="width: 95%"
          filterable
          allow-create
          default-first-option
          placeholder="请选择网卡名称"
        >
          <el-option
            v-for="item in defaultConfig.nicList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-tooltip
          content="请填写系统管理员分配的bond，格式类似于bond0、bond1,否则填不对创建不了"
          placement="right"
        >
          <svg-icon
            icon="question-icon"
            class="ideal-svg-margin-left"
          ></svg-icon>
        </el-tooltip>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { vmwarePrompt } from '@/utils/prompt'

const { t } = useI18n()

const form = reactive({
  name: '',
  description: '',
  type: '',
  vlanId: '',
  networkType: '',
  networkTypeName: '',
  nicName: ''
})
const formRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: vmwarePrompt.MAZ_MIDDLE_NAME,
      trigger: 'blur'
    }
  ]
})

interface IHooksBasic {
  loading?: boolean
  typeList?: any[]
  networkTypeList?: any[]
  allocateStatus?: boolean
  nicList?: any[]
}
const defaultConfig: IHooksBasic = reactive({
  loading: false,
  typeList: [],
  networkTypeList: [],
  allocateStatus: true, //自动分配VLAN ID的状态
  nicList: [] //自动分配VLAN ID的状态
})
const networkTypeList: any = ref([])
const allocateStatus = ref(true)

const changeNetworkType = () => {
  form.networkTypeName = networkTypeList[form.networkType]
}
//自动分配
const autoAllocate = () => {
  allocateStatus.value = false
}

//取消自动分配
const cancelAutoAllocate = () => {
  allocateStatus.value = true
}

//检测vlanId使用状态
const checkVlanIdStatus = () => {}

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}
const submitForm = () => {}
</script>

<style scoped lang="scss"></style>
