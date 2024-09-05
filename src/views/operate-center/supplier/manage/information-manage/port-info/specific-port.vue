<template>
  <div class="specific-port">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="端口信息" prop="portData">
        <ideal-table-list
          ref="multipleTableRef"
          :table-data="form.portData"
          :table-headers="tableHeaders"
          :show-pagination="false"
          :is-multiple="isInfoEntry"
        >
          <template #name>
            <el-table-column label="端口名称" width="150px">
              <template #default="props">
                <el-input
                  v-model="props.row.portName"
                  placeholder="请输入端口名称"
                  :disabled="props.row.disabled"
                />
              </template>
            </el-table-column>
          </template>

          <template #uuid>
            <el-table-column label="端口ID" width="180px">
              <template #default="props">
                <el-form-item prop="uuidVail">
                  <el-input
                    v-model="props.row.uuid"
                    class="inputId"
                    placeholder="请输入端口ID"
                    :disabled="props.row.disabled"
                  />

                  <template #error="{ error }">
                    <div
                      v-if="error.slice(0, 3) === '请输入'"
                      class="el-form-item__error"
                    >
                      {{ error }}
                    </div>
                    <error-warning v-else :content="error" />
                  </template>
                </el-form-item>
              </template>
            </el-table-column>
          </template>

          <template #portStatus>
            <el-table-column label="端口状态" width="150px">
              <template #default="props">
                <el-select
                  v-model="props.row.portStatus"
                  placeholder="请选择端口状态"
                  :disabled="props.row.disabled"
                >
                  <el-option
                    v-for="(item, index) of portStatusList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
          </template>

          <template #speed>
            <el-table-column label="速率" width="150px">
              <template #default="props">
                <el-select
                  v-model="props.row.portSpeed"
                  placeholder="请选择速率"
                  :disabled="props.row.disabled"
                >
                  <el-option
                    v-for="(item, index) of speedList"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </template>
            </el-table-column>
          </template>

          <template v-if="!isEdit" #operation>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="props">
                <el-button
                  link
                  type="primary"
                  :disabled="props.$index == 0"
                  @click="handleDelete(props.row, props.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </template>
        </ideal-table-list>
        <div v-if="!isEdit" class="add_table" @click="handleAdd">
          <svg-icon
            icon="circle-add"
            color="var(--el-color-primary)"
          ></svg-icon>
          继续添加
        </div>
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
import type { IdealTableColumnHeaders } from '@/types'
import { speedList, portStatusList } from '../common'
import { PortBasic } from '../information-entry/interface'
import errorWarning from './error-warning.vue'
import { EventEnum } from '@/utils/enum'
import store from '@/store'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus'
import { isSupplierManager } from '@/utils/role'
import {
  getNodeList,
  getEquipmentList,
  portAdd,
  portEdit,
  getSupplierList
} from '@/api/java/operate-center'

interface PortProps {
  type?: undefined | string
  rowData?: any
  exitPorts?: any //信息录入时查询设备下已存在所有端口
  entryPorts?: any //编辑录入信息时已录入端口
}
const props = withDefaults(defineProps<PortProps>(), {
  type: '',
  rowData: () => {},
  exitPorts: () => [{}],
  entryPorts: () => []
})

const { t } = useI18n()
const isEdit = computed(() => props.type === 'editSpecificPort') //编辑模式

const portOnly = computed(() =>
  RegExp(/createSpecificPort|editSpecificPort/).test(props.type as string)
) //仅单独专用端口创建或编辑

const isInfoEntry = computed(() => props.type === 'infoEntry')

const formRef = ref<FormInstance>() // 校验表单
const form: { [key: string]: any } = reactive({
  portData: [{}] as any[],
  vendorId: '',
  nodeId: '',
  equipmentId: ''
})

const validatorID = (rule: any, value: any, callback: any, key: string) => {
  const pattern = /^[a-zA-Z0-9][a-zA-Z0-9 _\/-]*[a-zA-Z0-9]$/
  const flag = value?.portData.find(
    (port: any) => port[key] && !pattern.test(port[key])
  )
  if (flag) {
    callback(
      new Error(
        '仅支持英文字母、数字、特殊符号_(下划线) -(中划线) /(斜杠)  (空格)进行命名，不支持用特殊符号作为命名开头或结尾'
      )
    )
  } else {
    callback()
  }
}

const validatePort = (rule: any, value: any, callback: (e?: Error) => any) => {
  const flag = value.some((item: any) => {
    return !item.portSpeed || !item.portName || !item.uuid || !item.portStatus
  })
  if (flag && value.length == 1) {
    callback(new Error('请至少输入一条端口信息'))
  } else {
    if (flag) {
      callback(new Error('请输入完整的端口信息'))
    } else {
      callback()
    }
  }
}

const rules = reactive<FormRules>({
  portData: [{ required: true, validator: validatePort, trigger: 'change' }],
  uuidVail: [
    {
      trigger: 'blur',
      validator: (rule, value, callback) =>
        validatorID(rule, form, callback, 'uuid')
    }
  ],
  vendorId: [
    { required: true, message: '请选择所属供应商', trigger: 'change' }
  ],
  nodeId: [{ required: true, message: '请选择所属节点', trigger: 'change' }],
  equipmentId: [
    { required: true, message: '请选择所属设备', trigger: 'change' }
  ]
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '端口名称', prop: 'name', useSlot: true },
  { label: '端口ID', prop: 'uuid', useSlot: true },
  { label: '端口状态', prop: 'portStatus', useSlot: true },
  { label: '速率', prop: 'speed', useSlot: true }
]

const defaultOptions: PortBasic = {
  typeList: [],
  speedList: []
}

const state = reactive(defaultOptions)

const handleAdd = () => {
  form.portData.push({})
}
const handleDelete = (row: any, index: number) => {
  multipleTableRef.value.IdealTableList.toggleRowSelection(row, false)
  form.portData.splice(index, 1)
}

onMounted(() => {
  //供应商管理员角色
  if (isSupplierManager.value) {
    form.vendorId = store.userStore.user.id
  } else if (portOnly.value) {
    querySupplier()
  }
  if (isEdit.value) {
    form.portData = [
      {
        portName: props.rowData.name,
        portSpeed: props.rowData.speed,
        uuid: props.rowData.uuid,
        portStatus: props.rowData.portStatus
      }
    ]
    form.nodeId = props.rowData.nodeId
    form.equipmentId = props.rowData.equipmentId
    form.vendorId = parseInt(props.rowData.vendorId)
  }
})
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
const multipleTableRef = ref()
watch(
  () => props.exitPorts,
  arr => {
    if (arr.length) {
      form.portData = arr
    } else {
      form.portData = [{}]
    }
  }
)
watch(
  () => props.entryPorts,
  arr => {
    if (arr?.length) {
      const arr1 = props.exitPorts.filter((item: any) =>
        arr.some((ele: any) => ele === item.id)
      )
      arr1.forEach((item: any) => {
        multipleTableRef.value.IdealTableList.toggleRowSelection(item, true)
      })
    } else {
      multipleTableRef.value.IdealTableList.clearSelection()
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
        portType: 'SPECIALIZED',
        nodeId: form.nodeId,
        equipmentId: form.equipmentId
      }
      if (isEdit.value) {
        params.name = form.portData[0].portName
        params.speed = form.portData[0].portSpeed
        params.uuid = form.portData[0].uuid
        params.id = props.rowData.id
        params.portStatus = form.portData[0].portStatus
        portEdit(params)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success('编辑专用端口成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('编辑专用端口失败')
            }
            hideLoading()
          })
          .catch((err: any) => {
            hideLoading()
          })
      } else {
        params.specializedPortItems = form.portData.map((item: any) => {
          return {
            portName: item.portName,
            portSpeed: item.portSpeed,
            portUuid: item.uuid,
            portStatus: form.portData[0].portStatus
          }
        })
        params.portStatus = form.portData[0].portStatus
        showLoading('创建中...')
        portAdd(params)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success('创建专用端口成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('创建专用端口失败')
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

defineExpose({ formRef, form, multipleTableRef })
</script>

<style scoped lang="scss">
.specific-port {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .custom-input {
    width: 50%;
  }
  .ideal-table-list__container {
    padding: 0;
  }
  .add_table {
    cursor: pointer;
    color: var(--el-color-primary);
  }
  .inputId {
    width: 90%;
  }
}
</style>
