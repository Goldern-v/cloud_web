<template>
  <div class="information-entry">
    <ideal-horizontal-steps
      class="information-entry-steps"
      :data-array="stepsArray"
      :current-step="stepsIndex"
      :minus-step="firstStep"
    />

    <el-card>
      <basic-info v-show="stepsIndex === 0" ref="basicInfoRef" />
      <node-info
        v-show="stepsIndex === 1"
        ref="nodeInfoRef"
        :vendor-form="vendorForm"
      />
      <device-info
        v-show="stepsIndex === 2"
        ref="deviceInfoRef"
        :node-form="nodeForm"
        :cabinet-list="cabinetList"
      />

      <el-form
        v-show="stepsIndex === 3"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="端口类型" prop="name">
          <el-radio-group
            v-model="form.type"
            class="custom-radio"
            :disabled="isForbidden"
            @change="changeType"
          >
            <el-radio
              v-for="item of typeList"
              :key="item.label"
              type="text"
              :label="item.value"
              >{{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <specific-port
          v-if="form.type === 'SPECIALIZED'"
          ref="specificPortRef"
          :exit-ports="exitPorts"
          :entry-ports="entryPorts"
          type="infoEntry"
        ></specific-port>
        <nni-port
          v-if="form.type === 'NNI'"
          ref="nniPortRef"
          :exit-ports="exitPorts"
          :entry-ports="entryPorts"
        ></nni-port>
        <template v-if="form.type === 'CLOUD'">
          <el-form-item label="云类型" prop="cloudType">
            <el-radio-group
              v-model="form.cloudType"
              class="custom-radio"
              :disabled="isForbidden"
              @change="changeType"
            >
              <el-radio
                v-for="item of cloudTypeList"
                :key="item"
                type="text"
                :label="item.value"
                >{{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <cloud-port-form
            ref="cloudPortRef"
            :type="form.cloudType"
            :exit-ports="exitPorts"
            :entry-ports="entryPorts"
          ></cloud-port-form>
        </template>
      </el-form>

      <step-footer
        ref="stepInfoRef"
        :steps-index="stepsIndex"
        :first-step="firstStep"
        class="step-footer-container"
        @clickPrevious="clickPrevious"
        @clickNext="clickNext"
        @clickComplete="clickComplete"
      ></step-footer>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import basicInfo from './basic-info.vue'
import nodeInfo from './node-info.vue'
import deviceInfo from './device-info.vue'
import nniPort from '../port-info/nni-port.vue'
import specificPort from '../port-info/specific-port.vue'
import cloudPortForm from '../port-info/cloud-port-form.vue'
import stepFooter from './step-footer.vue'
import type { IdealSteps } from '@/types'
import { showLoading, hideLoading } from '@/utils/tool'
import {
  portUnderEquipmentList,
  informationEntry,
  supplierInfoDetail,
  informationUpdate
} from '@/api/java/operate-center'
import { ElMessage } from 'element-plus'
import { isSupplierManager } from '@/utils/role'
import { typeList, cloudTypeList } from '../common'
import store from '@/store'

import type { FormInstance, FormRules } from 'element-plus'

const stepsIndex = ref(0)
const firstStep = ref(0)
const stepsArray = ref<IdealSteps[]>()

onMounted(() => {
  //平台管理员角色
  if (!isSupplierManager.value) {
    stepsArray.value = stepsOptions
    firstStep.value = 0
  } else {
    stepsArray.value = stepsOptions.filter(
      (item: any) => item.title !== '基础信息'
    )
    firstStep.value = 1
  }
  stepsIndex.value = firstStep.value
})
const stepsOptions: IdealSteps[] = [
  { title: '基础信息' },
  { title: '节点信息' },
  { title: '设备信息' },
  { title: '端口信息' }
]

/**
 * 云端口
 */
//供应商录入信息
const route = useRoute()
const isEditSupplier = computed(() => route.query?.type === 'edit') //编辑供应商录入信息

const isForbidden = ref(false) //端口类型和云类型是否禁用

const id = route.query?.id as string
const detailInfo: any = ref({}) //已录入的端口信息

const entryPorts: any = ref([])
//查询供应商详情
const queryDetail = async () => {
  try {
    const res = await supplierInfoDetail(id)
    detailInfo.value = res.data.supplierNodeDetail?.ports
    form.type = detailInfo.value[0].portType || 'SPECIALIZED'
    if (form.type === 'CLOUD') {
      form.cloudType = detailInfo.value[0].cloudPortType || 'aliyun'
    }
    //当节点和设备未更改时
    if (
      nodeForm.value.nodeId === route.query.nodeId &&
      deviceForm.value.equipmentId === route.query.equipmentId
    ) {
      isForbidden.value = true
      queryExitPorts()
      entryPorts.value = detailInfo.value.map((item: any) => item.id)
    } else {
      isForbidden.value = false
      form.type = 'SPECIALIZED'
      form.cloudType = 'aliyun'
      entryPorts.value = []
    }
  } catch (err: any) {
    ElMessage.error(err)
  }
}

const formRef = ref<FormInstance>() // 校验表单
const form = reactive({
  type: 'SPECIALIZED',
  cloudType: 'aliyun'
})

const rules = reactive<FormRules>({
  type: [{ required: true, message: '请选择端口类型', trigger: 'change' }],
  cloudType: [{ required: true, message: '请选择云类型', trigger: 'change' }],
  portData: [
    { required: true, message: '请至少添加一条端口信息', trigger: 'change' }
  ]
})
//查询不同云端口类型下已存在的端口
const changeType = () => {
  if (deviceForm.value.name) {
    queryExitPorts()
  }
}
//查询已选择节点设备下存在的端口
const exitPorts: any = ref([])
const queryExitPorts = async () => {
  if (!form.type) {
    return
  }
  const params: { [key: string]: any } = {
    portType: form.type,
    equipmentId: deviceForm.value.equipmentId
  }
  if (form.type === 'CLOUD') {
    params.cloudPortType = form.cloudType
  }
  try {
    const res = await portUnderEquipmentList(params)
    if (form.type === 'SPECIALIZED') {
      res.data.forEach((item: any) => {
        item.portName = item.name
        item.portSpeed = item.speed
        item.disabled = isEditSupplier.value
          ? item.approvalStatus.toUpperCase() === 'PASS'
          : true
      })
    }
    exitPorts.value = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}

// 校验表单
const checkForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }

  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    console.log('submit!')
    if (stepsIndex.value < 3) {
      stepsIndex.value++
    } else {
      onClickInfoEntry()
    }
  })
}
// 上一步
const clickPrevious = () => {
  stepsIndex.value--
}

const basicInfoRef = ref()
const vendorForm: any = ref({}) //供应商form

const nodeInfoRef = ref()
const nodeForm: any = ref({}) //节点form
const regionForm: any = ref({}) //节点的区域信息
const cabinetList: any = ref([])

const deviceInfoRef = ref()
const deviceForm: any = ref({}) //设备form

const specificPortRef = ref() //专用端口
const nniPortRef = ref() //nni端口
const cloudPortRef = ref() //云端口

// 下一步
const clickNext = () => {
  if (stepsIndex.value === 3) {
    return
  }
  if (stepsIndex.value === 0) {
    const basicFormRef = basicInfoRef.value.formRef
    vendorForm.value = basicInfoRef.value.form
    checkForm(basicFormRef)
  } else if (stepsIndex.value === 1) {
    const nodeFormRef = nodeInfoRef.value.formRef
    nodeForm.value = nodeInfoRef.value.form
    regionForm.value = nodeInfoRef.value.regionForm
    cabinetList.value = nodeInfoRef.value.cabinetList
    //节点未发生改变
    if (nodeForm.value.nodeId === route.query.nodeId) {
      deviceInfoRef.value.assignDevice(route.query.equipmentId)
    } else {
      deviceInfoRef.value.assignDevice()
    }
    checkForm(nodeFormRef)
  } else if (stepsIndex.value === 2) {
    const deviceFormRef = deviceInfoRef.value.formRef
    deviceForm.value = deviceInfoRef.value.form
    //下拉选择已存在的设备区查询设备下的端口
    if (deviceForm.value.name) {
      queryExitPorts()
    } else {
      exitPorts.value = []
    }
    if (isEditSupplier.value) {
      queryDetail()
    }
    checkForm(deviceFormRef)
  }
}

const router = useRouter()
//完成
const clickComplete = () => {
  if (form.type === 'SPECIALIZED') {
    const selectPortData =
      specificPortRef.value.multipleTableRef.IdealTableList.getSelectionRows()
    if (!selectPortData.length) {
      return ElMessage.warning('请选择端口')
    }
    onClickInfoEntry()
  } else if (form.type === 'NNI') {
    checkForm(nniPortRef.value.formRef)
  } else if (form.type === 'CLOUD') {
    checkForm(cloudPortRef.value.formRef)
  }
}
//提交
const onClickInfoEntry = () => {
  let params: { [key: string]: any } = getParams()
  if (isEditSupplier.value) {
    params.id = id
    showLoading('修改录入信息...')
    informationUpdate(params)
      .then((res: any) => {
        if (res.code === 200) {
          ElMessage.success('修改录入信息成功')
          router.back()
        } else {
          ElMessage.error('修改录入信息失败')
        }
        hideLoading()
      })
      .catch((err: any) => {
        hideLoading()
      })
  } else {
    showLoading('信息录入中...')
    informationEntry(params)
      .then((res: any) => {
        if (res.code === 200) {
          ElMessage.success('信息录入成功')
          router.back()
        } else {
          ElMessage.error('信息录入失败')
        }
        hideLoading()
      })
      .catch((err: any) => {
        hideLoading()
      })
  }
}
//参数
const getParams = () => {
  /**
   * 节点信息参数
   */
  let node: { [key: string]: any } = {}
  //信息录入时通过下拉选择已存在的节点(信息录入时不支持对选择的信息更改)
  const { name, nodeId, ...resetNodeForm } = nodeForm.value
  if (nodeForm.value?.name) {
    //信息录入时通过下拉选择已存在节点
    if (!isEditSupplier.value) {
      node = {
        id: nodeId
      }
    } //编辑录入信息时支持对选择的节点更改
    else {
      node = { id: nodeId, ...resetNodeForm, ...regionForm.value }
    }
  }
  //手动输入新的节点信息
  else {
    node = { name: nodeId, ...resetNodeForm, ...regionForm.value }
  }
  /**
   * 设备信息参数
   */
  const { equipmentId, cabinetName, cabinetId, uType, planarNetwork, ip } =
    deviceForm.value
  let equipment: { [key: string]: any } = {}
  const equipObj = {
    cabinetName,
    nodeId,
    uType,
    planarNetwork,
    ip
  }
  if (deviceForm.value?.name) {
    //信息录入时通过下拉选择已存在设备
    if (!isEditSupplier.value) {
      equipment = {
        id: equipmentId
      }
    } //编辑录入信息时支持对选择的设备更改
    else {
      equipment = { id: equipmentId, name, cabinetId, ...equipObj }
    }
  } //手动输入新的设备信息
  else {
    equipment = { ...equipObj, name: equipmentId }
  }
  /**
   * 端口信息参数
   */
  let port: { [key: string]: any } = {} //端口
  //专用端口
  if (form.type === 'SPECIALIZED') {
    const selectPortData =
      specificPortRef.value.multipleTableRef.IdealTableList.getSelectionRows()
    const portData = selectPortData.map((item: any) => {
      //通过下拉选择已存在的专用端口
      if (item.id) {
        return {
          portId: item.id,
          portName: item.portName,
          portSpeed: item.portSpeed
        }
      }
      //录入新增的专用端口
      else {
        return {
          portName: item.portName,
          portSpeed: item.portSpeed
        }
      }
    })
    port = {
      portType: form.type,
      nodeId,
      equipmentId,
      specializedPortItems: portData
    }
  } else if (form.type === 'NNI') {
    const nniForm = nniPortRef.value.form
    const { name, speed, bandwidth, remotePort, remoteDevice, vlan } = nniForm
    const nniObj = {
      portType: form.type,
      nodeId,
      equipmentId,
      speed,
      bandwidth,
      remotePort,
      remoteDevice,
      vlan
    }
    //信息录入时通过下拉选择已存在的nni端口
    if (nniForm.name) {
      if (!isEditSupplier.value) {
        port = {
          portType: form.type,
          id: nniForm.portId
        }
      } else {
        port = { id: nniForm.portId, name, ...nniObj }
      }
    }
    //录入新增的nni端口
    else {
      port = {
        name: nniForm.portId,
        ...nniObj
      }
    }
  } else if (form.type === 'CLOUD') {
    const cloudForm = cloudPortRef.value.form
    const {
      name,
      speed,
      instanceId,
      area,
      accessPoint,
      aliPortType,
      location,
      zone,
      address,
      portGroup
    } = cloudForm
    const cloudObj = {
      portType: form.type, //端口类型
      cloudPortType: form.cloudType, //云类型
      nodeId,
      equipmentId,
      speed,
      instanceId,
      area,
      accessPoint,
      aliPortType
    }
    const azureObj = {
      portType: form.type, //端口类型
      cloudPortType: form.cloudType, //云类型
      nodeId,
      equipmentId,
      area,
      speed,
      location,
      zone,
      address,
      portGroup
    }
    //信息录入时通过下拉选择已存在的云端口
    if (cloudForm.name) {
      if (!isEditSupplier.value) {
        port = {
          portType: form.type, //端口类型
          cloudPortType: form.cloudType, //云类型
          id: cloudForm.portId
        }
      } else {
        port = {
          ...cloudObj,
          id: cloudForm.portId,
          name
        }
      }
    } else {
      //录入新增的云端口
      if (form.cloudType === 'aliyun' || form.cloudType === 'aws') {
        port = { ...cloudObj, name: cloudForm.portId }
      } else {
        port = { ...azureObj, name: cloudForm.portId }
      }
    }
  }
  let params: { [key: string]: any } = {
    vendorId: isSupplierManager.value
      ? store.userStore.user.id
      : vendorForm.value.vendorId,
    nodeEquipmentPortCombination: {
      node,
      equipment,
      port
    }
  }
  return params
}
</script>

<style scoped lang="scss">
:deep(.el-card) {
  min-height: calc(
    100vh - var(--navigation-bar-height) - var(--theme-header-height) - 40px -
      40px
  ); // 两个40分别是面包屑和标签页
  position: relative;
}
:deep(.el-step__title.is-success) {
  color: var(--el-color-primary);
}
:deep(.el-step__head.is-success) {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
.information-entry {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;
  .information-entry-steps {
    margin-bottom: $idealPadding;
  }
  :deep(.custom-input) {
    width: 20%;
  }

  .step-footer-container {
    position: absolute;
    bottom: 80px;
    right: 80px;
  }
}
</style>
