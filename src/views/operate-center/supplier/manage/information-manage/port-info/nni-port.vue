<template>
  <div class="specific-port">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <!-- 单端口创建或编辑 -->
      <el-form-item v-if="portOnly" label="端口名称" prop="name">
        <el-input
          v-model="form.name"
          class="custom-input"
          placeholder="请输入端口名称"
        >
        </el-input>
      </el-form-item>
      <!-- 信息录入 -->
      <el-form-item v-else prop="portId" label="端口名称">
        <el-select
          v-model="form.portId"
          filterable
          clearable
          placeholder="请输入或选择端口名称"
          allow-create
          default-first-option
          class="custom-input"
        >
          <el-option
            v-for="(item, index) of state.portList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="端口ID" prop="uuid">
        <el-input
          v-model="form.uuid"
          class="custom-input"
          placeholder="请输入端口ID"
          :disabled="isApproved || isSelect"
        >
        </el-input>
      </el-form-item>

      <template v-if="portOnly">
        <el-form-item
          v-if="!isSupplierManager"
          label="所属供应商"
          prop="vendorId"
        >
          <el-select
            v-model="form.vendorId"
            placeholder="请选择所属供应商"
            class="custom-input"
            @change="handleVendorChange"
          >
            <el-option
              v-for="(item, index) of state.supplierList"
              :key="index"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所属节点" prop="nodeId">
          <el-select
            v-model="form.nodeId"
            placeholder="请选择所属节点"
            class="custom-input"
            @change="handleNodeChange"
          >
            <el-option
              v-for="(item, index) of state.nodeList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所属设备" prop="equipmentId">
          <el-select
            v-model="form.equipmentId"
            placeholder="请选择所属设备"
            class="custom-input"
          >
            <el-option
              v-for="(item, index) of state.deviceList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </template>

      <el-form-item label="端口状态" prop="portStatus">
        <el-select
          v-model="form.portStatus"
          placeholder="请选择端口状态"
          class="custom-input"
          :disabled="isApproved || isSelect"
        >
          <el-option
            v-for="(item, index) of portStatusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="端口速率" prop="speed">
        <el-select
          v-model="form.speed"
          placeholder="请选择速率"
          class="custom-input"
          :disabled="isApproved || isSelect"
        >
          <el-option
            v-for="(item, index) of speedList"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="线路带宽" prop="bandwidth">
        <el-input
          v-model.number="form.bandwidth"
          class="custom-input"
          placeholder="请输入带宽"
          :disabled="isApproved || isSelect"
        >
          <template #append>
            <el-select
              v-model="form.bandwidthUnit"
              placeholder="Select"
              style="width: 115px"
            >
              <el-option
                v-for="(item, index) in unitList"
                :key="index + 'asd'"
                :label="item.label"
                :value="item.value"
              />
              >
            </el-select>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="对端端口" prop="remotePort">
        <el-input
          v-model="form.remotePort"
          class="custom-input"
          placeholder="请输入对端端口"
          :disabled="isApproved || isSelect"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="对端设备" prop="remoteDevice">
        <el-input
          v-model="form.remoteDevice"
          class="custom-input"
          placeholder="请输入对端设备"
          :disabled="isApproved || isSelect"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="可分配VLAN段" prop="vlan">
        <el-input
          v-model="form.vlan"
          class="custom-input"
          type="textarea"
          :auto-size="{ minRows: 3 }"
          placeholder="请输入VLAN段"
          :disabled="isApproved || isSelect"
        >
        </el-input>
      </el-form-item>
    </el-form>

    <div v-if="portOnly" class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { PortBasic } from '../information-entry/interface'
import { EventEnum } from '@/utils/enum'
import { isSupplierManager } from '@/utils/role'
import { ElMessage } from 'element-plus'
import store from '@/store'
import { hideLoading, showLoading } from '@/utils/tool'
import {
  getNodeList,
  getEquipmentList,
  portAdd,
  portEdit,
  getSupplierList
} from '@/api/java/operate-center'
import { speedList, portStatusList, unitList } from '../common'

interface PortProps {
  type?: undefined | string
  rowData?: any
  exitPorts?: any //信息录入时查询设备下已存在所有端口
  entryPorts?: any //编辑录入信息时已录入端口
}
const props = withDefaults(defineProps<PortProps>(), {
  type: '',
  rowData: () => {},
  exitPorts: () => [],
  entryPorts: () => [] //编辑录入信息时已录入端口
})

const { t } = useI18n()

const isEdit = computed(() => props.type === 'editNniPort')
const portOnly = computed(() =>
  RegExp(/createNniPort|editNniPort/).test(props.type as string)
) //仅单独NNI端口创建或编辑

//供应商录入信息
const route = useRoute()
const isSupplierEntry = computed(() => route.query?.type === 'entry')

const formRef = ref<FormInstance>() // 校验表单
const form: { [key: string]: any } = reactive({
  name: '',
  uuid: '',
  vendorId: '',
  nodeId: '',
  equipmentId: '',
  portStatus: '',
  speed: '',
  bandwidth: '',
  remotePort: '',
  remoteDevice: '',
  vlan: '',
  bandwidthUnit: 'Mbps'
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入端口名称', trigger: 'blur' }],
  uuid: [{ required: true, message: '请输入端口ID', trigger: 'blur' }],
  portId: [{ required: true, message: '请输入端口名称', trigger: 'blur' }],
  vendorId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  nodeId: [{ required: true, message: '请选择所属节点', trigger: 'change' }],
  equipmentId: [
    { required: true, message: '请输入所属设备', trigger: 'change' }
  ],
  portStatus: [
    { required: true, message: '请选择端口状态', trigger: 'change' }
  ],
  speed: [{ required: true, message: '请选择速率', trigger: 'change' }],
  bandwidth: [{ required: true, message: '请输入带宽', trigger: 'blur' }],
  remotePort: [{ required: true, message: '请输入对端端口', trigger: 'blur' }],
  remoteDevice: [
    { required: true, message: '请输入对端设备', trigger: 'blur' }
  ],
  vlan: [{ required: true, message: '请输入VLAN段', trigger: 'blur' }]
})

const defaultOptions: PortBasic = {}

const state = reactive(defaultOptions)

onMounted(() => {
  //供应商角色取当前登录用户id
  if (isSupplierManager.value) {
    form.vendorId = store.userStore.user.id
  } else if (portOnly.value) {
    querySupplier()
  }
  if (isEdit.value) {
    Object.keys(form).forEach((key: string) => {
      if (key !== 'vendorId') {
        form[key] = props.rowData[key]
        if (key === 'bandwidth') {
          form[key] = parseInt(props.rowData.bandwidth)
        } else if (key === 'bandwidthUnit') {
          form[key] = props.rowData.bandwidth.match(/[A-Za-z]+$/)
            ? props.rowData.bandwidth.match(/[A-Za-z]+$/)[0]
            : 'Mbps'
        }
      } else {
        form.vendorId = parseInt(props.rowData.vendorId)
      }
    })
  }
})

//查询供应商
const querySupplier = async () => {
  try {
    const res = await getSupplierList()
    state.supplierList = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}

watch(
  () => form.vendorId,
  val => {
    if (val) {
      queryNode()
    }
  }
)
const handleVendorChange = () => {
  form.nodeId = ''
  form.equipmentId = ''
  state.deviceList = []
}
//查询供应商下节点
const queryNode = async () => {
  try {
    const res = await getNodeList({ supplierId: form.vendorId })
    state.nodeList = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}
watch(
  () => form.nodeId,
  val => {
    if (val) {
      queryEquipment(val)
    }
  }
)
const handleNodeChange = () => {
  form.equipmentId = ''
}
//查询节点下设备
const queryEquipment = async (nodeId: string) => {
  try {
    const res = await getEquipmentList({ nodeId })
    state.deviceList = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}

/**
 * 信息录入
 */
watch(
  () => [props.exitPorts, props.entryPorts],
  ([arr, arr1]) => {
    if (arr?.length) {
      state.portList = arr
    }
    if (arr1.length) {
      form.portId = arr1[0]
    }
  },
  { deep: true }
)

const isApproved = ref(false) //选择已审批通过的设备不支持对设备信息的修改
const isSelect = ref(false) //信息录入时选择已经存在端口不支持对端口信息的修改
watch(
  () => form.portId,
  val => {
    const portInfo = state.portList?.find((item: any) => item.id === val)
    isApproved.value = portInfo?.approvalStatus.toUpperCase() === 'PASS'
    if (portInfo) {
      isSelect.value = isSupplierEntry.value
      form.name = portInfo.name
      form.speed = portInfo.speed
      form.bandwidth = parseInt(portInfo.bandwidth)
      form.remotePort = portInfo.remotePort
      form.remoteDevice = portInfo.remoteDevice
      form.vlan = JSON.parse(portInfo.vlan)
      form.uuid = portInfo.uuid
      form.portStatus = portInfo.portStatus
      form.bandwidthUnit = portInfo.bandwidth.match(/[A-Za-z]+$/)
        ? portInfo.bandwidth.match(/[A-Za-z]+$/)[0]
        : 'Mbps'
    } else {
      form.name = ''
      form.speed = ''
      form.bandwidth = ''
      form.remotePort = ''
      form.remoteDevice = ''
      form.vlan = ''
      isSelect.value = false
      form.uuid = ''
      form.portStatus = ''
      form.bandwidthUnit = 'Mbps'
    }
  }
)

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
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
  if (!formEl) {
    return
  }
  formEl.validate(async valid => {
    if (valid) {
      const params: { [key: string]: any } = {
        ...form,
        bandwidth: form.bandwidth + form.bandwidthUnit,
        portType: 'NNI'
      }
      if (isEdit.value) {
        params.id = props.rowData.id
        portEdit(params)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success('编辑NNI端口成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('编辑NNI端口失败')
            }
            hideLoading()
          })
          .catch((err: any) => {
            hideLoading()
          })
      } else {
        showLoading('创建中...')
        portAdd(params)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success('创建NNI端口成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('创建NNI端口失败')
            }
            hideLoading()
          })
          .catch((err: any) => {
            hideLoading()
          })
      }
    }
  })
}

defineExpose({ formRef, form })
</script>

<style scoped lang="scss">
.specific-port {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .custom-input {
    width: 100%;
  }
  .ideal-table-list__container {
    padding: 0;
  }
  :deep(.el-select__suffix) {
    .el-input__validateIcon {
      display: none;
    }
  }
}
</style>
