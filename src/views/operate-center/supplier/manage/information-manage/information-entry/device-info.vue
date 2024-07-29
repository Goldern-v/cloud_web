<template>
  <div class="device-info">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item v-if="deviceOnly" label="设备名称" prop="name">
        <!-- 单设备创建或编辑 -->
        <el-input
          v-model="form.name"
          class="custom-input"
          placeholder="请输入设备名称"
        >
        </el-input>
      </el-form-item>

      <!-- 信息录入 -->
      <el-form-item v-else label="设备名称" prop="equipmentId">
        <el-select
          v-model="form.equipmentId"
          filterable
          clearable
          placeholder="请输入或选择设备名称"
          allow-create
          default-first-option
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

      <el-form-item label="设备ID" prop="uuid">
        <el-input
          v-model="form.uuid"
          class="custom-input"
          placeholder="请输入设备ID"
          :disabled="isApproved || isSelect"
        >
        </el-input>
      </el-form-item>

      <template v-if="deviceOnly">
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
            :disabled="isApproved || isSelect"
            @change="nodeChange"
          >
            <el-option
              v-for="(item, index) of state.nodeList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </template>

      <el-form-item label="所属机柜" prop="cabinetId">
        <el-select
          v-model="form.cabinetId"
          placeholder="请选择机柜"
          value-key="id"
          class="custom-input"
          :disabled="isApproved || isSelect"
        >
          <el-option
            v-for="(item, index) of state.cabinetList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="所属U位" prop="uType">
        <el-input
          v-model="form.uType"
          placeholder="请输入U位"
          class="custom-input"
          :disabled="isApproved || isSelect"
          oninput="value = value.replace(/[^0-9]/g, '');"
        >
          <template #append>U</template>
        </el-input>
      </el-form-item>

      <el-form-item label="网络平面" prop="planarNetwork">
        <el-select
          v-model="form.planarNetwork"
          placeholder="请选择网络平面"
          class="custom-input"
          :disabled="isApproved || isSelect"
        >
          <el-option
            v-for="(item, index) of state.netPlaneList"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="IP地址" prop="ip">
        <el-input
          v-model="form.ip"
          placeholder="请输入IP地址"
          class="custom-input"
          :disabled="isApproved || isSelect"
        ></el-input>
      </el-form-item>
    </el-form>

    <div v-if="deviceOnly" class="flex-row ideal-submit-button">
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
import { DeviceBasic } from './interface'
import { EventEnum } from '@/utils/enum'
import { isSupplierManager } from '@/utils/role'
import { ElMessage } from 'element-plus'
import store from '@/store'
import {
  equipmentAdd,
  equipmentEdit,
  getCabinetList,
  getNodeList,
  getEquipmentList,
  getSupplierList
} from '@/api/java/operate-center'
import { hideLoading, showLoading } from '@/utils/tool'
import { clearForm } from '../common'

const { t } = useI18n()
interface DeviceProps {
  type?: undefined | string
  rowData?: any
  nodeForm?: any
  cabinetList?: any
}

const props = withDefaults(defineProps<DeviceProps>(), {
  type: '',
  rowData: () => {},
  nodeForm: () => {}, //信息录入时上一步的节点信息
  cabinetList: () => [] //节点下的机架
})

// 仅单独设备操作
const deviceOnly = computed(() =>
  RegExp(/createDevice|editDevice/).test(props.type as string)
)
const isEdit = computed(() => props.type === 'editDevice') //编辑模式

//供应商录入信息
const route = useRoute()
const isSupplierEntry = computed(() => route.query?.type === 'entry')
const isEditSupplier = computed(() => route.query?.type === 'edit') //编辑供应商录入信息

const form: { [key: string]: any } = reactive({
  equipmentId: '',
  uuid: '',
  name: '',
  vendorId: '', //供应商
  nodeId: '', //节点
  cabinetId: '', //所属机柜
  cabinetName: '', //所属机柜
  uType: '',
  planarNetwork: '',
  ip: ''
})

const formRef = ref<FormInstance>()

const checkUType = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入U位'))
  } else if (value < 1 || value > 99) {
    return callback(new Error('请输入1~99的数字'))
  }
  callback()
}

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  uuid: [{ required: true, message: '请输入设备ID', trigger: 'blur' }],
  equipmentId: [
    { required: true, message: '请输入或选择设备名称', trigger: 'blur' }
  ],
  vendorId: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
  nodeId: [{ required: true, message: '请选择节点', trigger: 'blur' }],
  uType: [{ required: true, validator: checkUType, trigger: 'blur' }],
  cabinetId: [{ required: true, message: '请选择机架', trigger: 'blur' }],
  planarNetwork: [
    { required: true, message: '请选择网络平面', trigger: 'blur' }
  ]
})

const defaultOptions: DeviceBasic = {
  uBits: ['1U', '2U', '3U'],
  cabinetList: [],
  netPlaneList: ['Primary', 'Secondary']
}
const state = reactive(defaultOptions)

onMounted(() => {
  //供应商角色取当前登录用户id
  if (isSupplierManager.value) {
    form.vendorId = store.userStore.user.id
  } else if (deviceOnly.value) {
    // 平台管理员查询供应商
    querySupplier()
  }
  if (isEdit.value) {
    Object.keys(form).forEach((key: string) => {
      if (key !== 'vendorId' && key !== 'equipmentId') {
        form[key] = props.rowData[key]
        form.uType = props.rowData.uType.split('U')[0]
      } else {
        form.vendorId = parseInt(props.rowData.vendorId)
      }
    })
  }
})

/**
 * 平台管理员角色单节点创建
 */
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
  form.cabinetId = ''
  form.cabinetName = ''
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

const nodeChange = () => {
  form.cabinetId = ''
  form.cabinetName = ''
}

watch(
  () => form.nodeId,
  val => {
    if (val) {
      queryCabinet(val)
    }
  }
)

//查询节点下机柜
const queryCabinet = async (nodeId: string) => {
  try {
    const res = await getCabinetList({ nodeId })
    state.cabinetList = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}

watch(
  () => [form.cabinetId, state.cabinetList],
  ([val, arr]) => {
    if (val && arr.length) {
      form.cabinetName = state.cabinetList?.find(
        (item: any) => item.id === val
      ).name
    }
  }
)
/**
 * 信息录入时获取所选节点，并查询节点下设备
 */

watch(
  () => props.nodeForm,
  (val, oldVal) => {
    clearForm(form, ['vendorId', 'nodeId', 'equipmentId'])
    //存在节点名称表示通过下拉选择已存在的节点
    if (val.name && val.id !== oldVal) {
      form.nodeId = val.nodeId
      queryEquipment(val.nodeId)
    } else {
      state.deviceList = []
      if (val.cabinets) {
        state.cabinetList = val.cabinets.split(';').map((item: any) => {
          return {
            name: item,
            id: item
          }
        })
      } else {
        state.cabinetList = []
      }
    }
  },
  { deep: true }
)
//编辑录入信息当上一步节点信息未发生改变时，赋值设备id
const assignDevice = (val: string) => {
  // form.nodeId = route.query.nodeId
  form.equipmentId = val
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

const isApproved = ref(false) //选择已审批通过的设备不支持对设备信息的修改
const isSelect = ref(false) //信息录入时选择已经存在节点不支持对节点信息的修改
//拿到设备名称，用来判断是手输入新设备还是下拉选择已存在的设备
watch(
  () => [form.equipmentId, state.deviceList],
  ([val, list]) => {
    if (val && list?.length) {
      const deviceInfo = list?.find((item: any) => item.id === val)
      isApproved.value = deviceInfo?.approvalStatus.toUpperCase() === 'PASS'
      //下拉选择已存在的设备回填数据
      if (deviceInfo) {
        isSelect.value = isSupplierEntry.value
        Object.keys(form).forEach((key: string) => {
          if (key !== 'vendorId' && key !== 'equipmentId' && key !== 'nodeId') {
            form[key] = deviceInfo[key]
            // form.uuid = deviceInfo.id  //传的设备ID为字段uuid，不是id
            form.uType = deviceInfo.uType.split('U')[0]
          }
        })
      } else {
        isSelect.value = false
      }
    } else {
      clearForm(form, ['vendorId', 'equipmentId', 'nodeId'])
      isApproved.value = false
      isSelect.value = false
    }
  },
  { deep: true }
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
  formEl.validate((valid: boolean) => {
    if (valid) {
      let params: { [key: string]: any } = {
        ...form
      }
      params.uType = params.uType + 'U'
      if (isEdit.value) {
        params.id = props.rowData.id
        showLoading('编辑中...')
        equipmentEdit(params)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success('编辑设备信息成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('编辑设备信息失败')
            }
            hideLoading()
          })
          .catch((err: any) => {
            hideLoading()
          })
      } else {
        showLoading('创建中...')
        equipmentAdd(params)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success('创建设备成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('创建失败')
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

defineExpose({ form, formRef, assignDevice })
</script>

<style scoped lang="scss">
.device-info {
  width: 100%;

  :deep(.el-form) {
    padding: 0;
  }
}
</style>
