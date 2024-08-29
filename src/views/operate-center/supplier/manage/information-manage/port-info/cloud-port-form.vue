<template>
  <div class="specific-port">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="auto"
    >
      <!-- 单端口创建或编辑 -->
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
            :disabled="isForbidden"
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
            :disabled="isForbidden"
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
            :disabled="isForbidden"
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

      <!-- 单端口创建或编辑 -->
      <el-form-item v-if="portOnly" label="端口名称" prop="name">
        <el-input
          v-model="form.name"
          class="custom-input"
          placeholder="请输入端口名称"
          :disabled="isForbidden"
        >
        </el-input>
      </el-form-item>

      <!-- 信息录入 -->
      <el-form-item v-else label="端口名称" prop="portId">
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
          v-number-only="{
            obj: form,
            key: 'uuid'
          }"
          class="custom-input"
          placeholder="请输入端口ID"
          :disabled="isForbidden || isApproved"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="端口状态" prop="portStatus">
        <el-select
          v-model="form.portStatus"
          placeholder="请选择端口状态"
          class="custom-input"
          :disabled="isForbidden || isApproved"
        >
          <el-option
            v-for="(item, index) of portStatusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="isALi" label="实例ID" prop="instanceId">
        <el-input
          v-model="form.instanceId"
          v-number-only="{
            obj: form,
            key: 'instanceId'
          }"
          class="custom-input"
          placeholder="请输入实例ID"
          :disabled="isApproved"
        >
        </el-input>
      </el-form-item>

      <el-form-item v-if="isAws" label="互连ID" prop="connectionId">
        <el-input
          v-model="form.connectionId"
          class="custom-input"
          placeholder="请输入互连ID"
          :disabled="isApproved"
        >
        </el-input>
      </el-form-item>

      <el-form-item v-if="isGoogle" label="Google circuit ID" prop="circuitId">
        <el-input
          v-model="form.circuitId"
          class="custom-input"
          placeholder="请输入ID信息"
          :disabled="isApproved"
        >
        </el-input>
      </el-form-item>

      <el-form-item v-if="isGoogle" label="Google demarc ID" prop="demarcId">
        <el-input
          v-model="form.demarcId"
          class="custom-input"
          placeholder="请输入ID信息"
          :disabled="isApproved"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="区域" prop="area">
        <el-input
          v-model="form.area"
          class="custom-input"
          placeholder="请输入区域"
          :disabled="isForbidden || isApproved"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="端口速度" prop="speed">
        <el-input
          v-model.number="form.speed"
          class="custom-input"
          placeholder="请输入端口速度"
          :disabled="isForbidden || isApproved"
        >
          <template #append>
            <el-select
              v-model="form.speedUnit"
              placeholder="Select"
              style="width: 115px"
            >
              <el-option
                v-for="(item, index) in unitList"
                :key="index + 'asd'"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-input>
      </el-form-item>

      <template v-if="isALi">
        <el-form-item label="接入点" prop="accessPoint">
          <el-input
            v-model="form.accessPoint"
            class="custom-input"
            placeholder="请输入接入点"
            :disabled="isApproved"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="端口类型" prop="aliPortType">
          <el-input
            v-model="form.aliPortType"
            class="custom-input"
            placeholder="请输入端口类型"
            :disabled="isApproved"
          >
          </el-input>
        </el-form-item>
      </template>

      <template v-if="isAws || isZga">
        <el-form-item label="位置" prop="address">
          <el-input
            v-model="form.address"
            class="custom-input"
            placeholder="请输入位置"
            :disabled="isApproved"
          >
          </el-input>
        </el-form-item>

        <el-form-item v-if="!isZga" label="逻辑设备" prop="logicalDevice">
          <el-input
            v-model="form.logicalDevice"
            class="custom-input"
            placeholder="请输入逻辑设备"
            :disabled="isApproved"
          >
          </el-input>
        </el-form-item>
      </template>

      <template v-if="isAzure || isGoogle">
        <!-- 信息录入时且手动输入新的azure端口时匹配端口组时需要 -->
        <el-form-item
          v-if="isSupplierEntry && !form.name"
          label="所属端口组"
          prop="portGroup"
        >
          <el-select
            v-model="form.portGroup"
            placeholder="系统随机生成端口号组"
            class="custom-input"
            :disabled="isApproved"
          >
            <el-option
              v-for="(item, index) of state.portGroupList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="location" prop="location">
          <el-input
            v-model="form.location"
            class="custom-input"
            placeholder="请输入location"
            :disabled="isForbidden || isApproved"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="zone" prop="zone">
          <el-input
            v-model="form.zone"
            class="custom-input"
            placeholder="请输入zone"
            :disabled="isForbidden || isApproved"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="address" prop="address">
          <el-input
            v-model="form.address"
            class="custom-input"
            placeholder="请输入address"
            :disabled="isForbidden || isApproved"
          >
          </el-input>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { PortBasic } from '../information-entry/interface'
import { EventEnum } from '@/utils/enum'
import { isSupplierManager } from '@/utils/role'
import store from '@/store'
import { ElMessage } from 'element-plus'
import {
  getNodeList,
  getEquipmentList,
  getPortGroup,
  getSupplierList
} from '@/api/java/operate-center'
import { clearForm, portStatusList, unitList } from '../common'

interface CloudPortProps {
  cloudPortForm?: any
  type?: string //云类型或者云类型
  exitPorts?: any //信息录入时查询设备下所有端口进行选择
  entryPorts?: any //编辑录入信息时已录入端口
}
const props = withDefaults(defineProps<CloudPortProps>(), {
  cloudPortForm: () => ({}),
  type: '',
  exitPorts: () => [], //信息录入时查询已存在端口进行选择
  entryPorts: () => [] //信息录入时查询已存在端口进行选择
})

let form: { [key: string]: any } = reactive({
  vendorId: '',
  portId: '',
  nodeId: '',
  uuid: '', //端口ID
  equipmentId: '',
  name: '',
  instanceId: '',
  connectionId: '',
  area: '',
  speed: '',
  speedUnit: 'Mbps',
  accessPoint: '',
  aliPortType: '',
  logicalDevice: '',
  location: '',
  zone: '',
  address: '',
  portGroup: '',
  circuitId: '',
  demarcId: '',
  portStatus: ''
})

const formRef = ref<FormInstance>() // 校验表单

const rules = reactive<FormRules>({
  vendorId: [
    { required: true, message: '请选择所属供应商', trigger: 'change' }
  ],
  nodeId: [{ required: true, message: '请选择所属节点', trigger: 'change' }],
  equipmentId: [
    { required: true, message: '请选择所属节点', trigger: 'change' }
  ],
  name: [{ required: true, message: '请输入端口名称', trigger: 'blur' }],
  portId: [{ required: true, message: '请输入或选择端口ID', trigger: 'blur' }],
  uuid: [{ required: true, message: '请输入端口ID', trigger: 'blur' }],
  instanceId: [{ required: true, message: '请输入实例ID', trigger: 'blur' }],
  connectionId: [{ required: true, message: '请输入互连ID', trigger: 'blur' }],
  area: [{ required: true, message: '请输入区域', trigger: 'blur' }],
  speed: [{ required: true, message: '请输入端口速度', trigger: 'blur' }],
  accessPoint: [{ required: true, message: '请输入接入点', trigger: 'blur' }],
  aliPortType: [{ required: true, message: '请输入端口类型', trigger: 'blur' }],
  address: [{ required: true, message: '请输入位置', trigger: 'blur' }],
  logicalDevice: [
    { required: true, message: '请输入逻辑设备', trigger: 'blur' }
  ],
  zone: [{ required: true, message: '请输入zone', trigger: 'blur' }],
  location: [{ required: true, message: '请输入location', trigger: 'blur' }],
  portGroup: [{ required: true, message: '请选择端口组序号', trigger: 'blur' }],
  circuitId: [
    { required: true, message: '请输入Google circuit ID', trigger: 'blur' }
  ],
  demarcId: [
    { required: true, message: '请输入Google demarcId ID', trigger: 'blur' }
  ],
  portStatus: [{ required: true, message: '请选择端口状态', trigger: 'change' }]
})

const defaultOptions: PortBasic = {
  typeList: [],
  speedList: []
}

const state = reactive(defaultOptions)

const isALi = computed(() => RegExp(/(Ali)/i).test(props.type as string))
const isAws = computed(() => RegExp(/(Aws)/i).test(props.type as string))
const isZga = computed(() => RegExp(/(Zga)/i).test(props.type as string))
const isAzure = computed(() => RegExp(/(Azure)/i).test(props.type as string))
const isGoogle = computed(() => RegExp(/(Google)/i).test(props.type as string))

const isEdit = computed(() => RegExp(/(edit)/i).test(props.type as string)) //判断是否为编辑模式

const portOnly = computed(() => RegExp(/Port/).test(props.type as string)) //仅单独云端口创建或编辑

const route = useRoute()
const isSupplierEntry = computed(() => route.query?.type === 'entry') //信息录入页面

const isForbidden = computed(() => props.cloudPortForm?.disabled)

onMounted(() => {
  //供应商角色
  if (isSupplierManager.value) {
    form.vendorId = store.userStore.user.id
  }
  //平台管理员单端口操作
  else if (portOnly.value) {
    querySupplier()
  }
  //编辑模式
  if (isEdit.value) {
    Object.keys(form).forEach((key: string) => {
      if (key !== 'vendorId') {
        form[key] = props.cloudPortForm[key]
        if (key === 'speed') {
          form[key] = parseInt(props.cloudPortForm.speed)
        } else if (key === 'speedUnit') {
          form[key] = props.cloudPortForm.speed.match(/[A-Za-z]+$/)
            ? props.cloudPortForm.speed.match(/[A-Za-z]+$/)[0]
            : 'Mbps'
        }
      } else {
        form.vendorId = parseInt(props.cloudPortForm.vendorId)
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
    form.portId = ''
    if (arr?.length) {
      state.portList = arr
    } else {
      state.portList = []
    }
    if (arr1.length) {
      form.portId = arr1[0]
    }
  },
  { deep: true }
)

const isApproved = ref(false) //选择已审批通过的端口不支持对端口信息的修改
const isSelect = ref(false) //信息录入时选择已经存在端口不支持对端口信息的修改
//根据所选的的端口回填信息
watch(
  () => form.portId,
  val => {
    const portInfo = state.portList?.find((item: any) => item.id === val)
    isApproved.value = portInfo?.approvalStatus.toUpperCase() === 'PASS'
    if (portInfo) {
      isSelect.value = isSupplierEntry.value
      Object.keys(form).forEach((key: string) => {
        const arr = ['vendorId', 'portId', 'nodeId', 'equipmentId', 'portGroup']
        if (!arr.includes(key)) {
          form[key] = portInfo[key]
        }
      })
    } else {
      isSelect.value = false
      //信息录入时切换云类型清空form表单数据
      if (isSupplierEntry.value) {
        clearForm(form, ['portId'])
        getRandomPortNum()
      }
    }
  }
)
const getRandomPortNum = async () => {
  try {
    const res = await getPortGroup()
    state.portGroupList = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

defineExpose({ formRef, form })
</script>

<style scoped lang="scss">
.specific-port {
  width: 100%;

  :deep(.el-form) {
    padding: 0;
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
