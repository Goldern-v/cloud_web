<template>
  <div class="data-entry-container">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="A端端口" prop="aPort">
        <el-row :gutter="4">
          <el-col :span="8">
            <el-select
              v-model="form.aNodeId"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择节点"
              @change="
                () => {
                  ;(form.aEquipmentId = []), (aEquipmentList = [])
                }
              "
            >
              <el-option
                v-for="(item, index) of nodeList"
                :key="index"
                :label="item.facility"
                :value="item.nodeId"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select
              v-model="form.aEquipmentId"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择设备"
              @change="hideAequip"
            >
              <el-option
                v-if="aEquipmentList.length"
                key="-1"
                label="全部"
                value="*"
              />
              <el-option
                v-for="(item, index) of aEquipmentList"
                :key="index"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select
              v-model="form.aPortId"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择端口"
              @change="hideAport"
            >
              <el-option
                v-if="aPortList.length"
                key="-1"
                label="全部"
                value="*"
              />
              <el-option
                v-for="(item, index) of aPortList"
                :key="index"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="Z端端口" prop="zPort">
        <el-row :gutter="4">
          <el-col :span="8">
            <el-select
              v-model="form.zNodeId"
              collapse-tags
              collapse-tags-tooltip
              multiple
              placeholder="请选择节点"
              @change="
                () => {
                  ;(form.zEquipmentId = []), (zEquipmentList = [])
                }
              "
            >
              <el-option
                v-for="(item, index) of nodeList"
                :key="index"
                :label="item.facility"
                :value="item.nodeId"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select
              v-model="form.zEquipmentId"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择设备"
              @change="hideZequip"
            >
              <el-option
                v-if="zEquipmentList.length"
                key="-1"
                label="全部"
                value="*"
              />
              <el-option
                v-for="(item, index) of zEquipmentList"
                :key="index"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select
              v-model="form.zPortId"
              collapse-tags
              collapse-tags-tooltip
              multiple
              placeholder="请选择端口"
              @change="hideZport"
            >
              <el-option
                v-if="zPortList.length"
                key="-1"
                label="全部"
                value="*"
              />
              <el-option
                v-for="(item, index) of zPortList"
                :key="index"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item
        v-if="form.dataResource === 'static'"
        label="数据详情"
        prop="data"
      >
        <ideal-table-list
          :table-data="form.data"
          :table-headers="tableHeaders"
          :show-pagination="false"
        >
          <template #bandwidth>
            <el-table-column label="带宽大小" width="200px">
              <template #default="props">
                <el-row :gutter="2" style="align-items: center">
                  <el-col :span="7"
                    ><el-input v-model="props.row.minBandwidth"
                  /></el-col>
                  <el-col :span="6"><span>M --</span></el-col>
                  <el-col :span="7"
                    ><el-input v-model="props.row.maxBandwidth"
                  /></el-col>
                  <el-col :span="4"><span>M</span></el-col>
                </el-row>
              </template>
            </el-table-column>
          </template>

          <template #nrc>
            <el-table-column label="价格/NRC" width="120">
              <template #default="props">
                <div class="flex-row" style="align-items: center">
                  <el-input
                    v-model="props.row.nrc"
                    v-input.float="{ decimal: 4 }"
                  />
                  <div style="margin-left: 5px">$</div>
                </div>
              </template>
            </el-table-column>
          </template>

          <template #mrc>
            <el-table-column label="价格/MRC" width="120">
              <template #default="props">
                <div class="flex-row" style="align-items: center">
                  <el-input
                    v-model="props.row.mrc"
                    v-input.float="{ decimal: 4 }"
                  />
                  <div style="margin-left: 5px">$</div>
                </div>
              </template>
            </el-table-column>
          </template>

          <template #mtu>
            <el-table-column label="MTU">
              <template #default="props">
                <el-input v-model="props.row.mtu" />
              </template>
            </el-table-column>
          </template>

          <template #delayTime>
            <el-table-column label="延时/ms">
              <template #default="props">
                <el-input v-model="props.row.delayTime" />
              </template>
            </el-table-column>
          </template>

          <template #deliveryDuration>
            <el-table-column label="交付工期">
              <template #default="props">
                <div class="flex-row" style="align-items: center">
                  <el-input v-model="props.row.deliveryDuration" />
                  <div style="margin-left: 2px">天</div>
                </div>
              </template>
            </el-table-column>
          </template>

          <template v-if="!isEdit" #operation>
            <el-table-column label="操作">
              <template #default="props">
                <el-button
                  link
                  type="primary"
                  :disabled="props.$index == 0"
                  @click="handleDelete(props.$index)"
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

      <el-form-item
        v-if="form.dataResource === 'api'"
        label="URL地址"
        prop="url"
      >
        <el-input
          v-model="form.url"
          class="custom-input"
          placeholder="请选择URL地址"
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
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
import { EventEnum } from '@/utils/enum'
import {
  dciDataEntry,
  dciDataUpdate,
  dciNodeList,
  dciEquipmentList,
  dciPortList
} from '@/api/java/operate-center'
import { hideLoading, showLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus'

// 属性值
interface DCIProps {
  type: undefined | string // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DCIProps>(), {
  rowData: null
})

const { t } = useI18n()

const isEdit = computed(() => props.type === 'DCIDataEdit')

const formRef = ref<FormInstance>() // 校验表单
const form: { [key: string]: any } = reactive({
  aNodeId: [],
  aEquipmentId: [],
  aPortId: [],
  zNodeId: [],
  zEquipmentId: [],
  zPortId: [],
  dataResource: 'static',
  data: [{}] as any[],
  url: ''
})

const hasEmptyProperty = (obj: any) => {
  if (!Object.keys(obj).length) {
    return true
  } else {
    const keys = [
      'maxBandwidth',
      'minBandwidth',
      'nrc',
      'mrc',
      'mtu',
      'delayTime',
      'deliveryDuration'
    ]
    return keys.some(key => {
      return !obj[key]
    })
  }
}

const validatePort = (rule: any, value: any, callback: (e?: Error) => any) => {
  const flag = value.some((item: any) => {
    return hasEmptyProperty(item)
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

const validateAport = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (form.aNodeId.length == 0 || form.aNodeId == null) {
    callback(new Error('请选择节点'))
  } else if (form.aEquipmentId.length == 0 || form.aEquipmentId == null) {
    callback(new Error('请选择设备'))
  } else if (form.aPortId.length == 0 || form.aPortId == null) {
    callback(new Error('请选择端口'))
  } else {
    callback()
  }
}

const validateZport = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (form.zNodeId.length == 0 || form.zNodeId == null) {
    callback(new Error('请选择节点'))
  } else if (form.zEquipmentId.length === 0 || form.zEquipmentId == null) {
    callback(new Error('请选择设备'))
  } else if (form.zPortId.length === 0 || form.zPortId == null) {
    callback(new Error('请选择端口'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  type: [{ required: true, message: '请选择端口类型', trigger: 'change' }],
  aPort: [{ required: true, validator: validateAport, trigger: 'change' }],
  zPort: [{ required: true, validator: validateZport, trigger: 'change' }],
  data: [{ required: true, validator: validatePort, trigger: 'change' }]
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '带宽大小', prop: 'bandwidth', useSlot: true },
  { label: '价格/NRC', prop: 'nrc', useSlot: true },
  { label: '价格/MRC', prop: 'mrc', useSlot: true },
  { label: 'MTU', prop: 'mtu', useSlot: true },
  { label: '延时', prop: 'delayTime', useSlot: true },
  { label: '交付工期', prop: 'deliveryDuration', useSlot: true }
]

const aPortList: any = ref([])
const zPortList: any = ref([])
const sourceList = [
  { label: 'static', name: '静态录入' }
  // { label: 'api', name: 'API对接' }
]
const handleAdd = () => {
  form.data.push({})
}
const handleDelete = (index: number) => {
  form.data.splice(index, 1)
}

onMounted(() => {
  // queryNode()
  queryNodeList()
  if (isEdit.value) {
    Object.keys(form).forEach((key: string) => {
      if (key !== 'data') {
        form[key] = props.rowData[key]
      } else {
        form.data = [props.rowData]
      }
    })
  }
})
const nodeList: any = ref([]) // 节点列表
// 查询节点
const queryNodeList = async () => {
  const res = await dciNodeList()
  nodeList.value = res.data
}
const aEquipmentList: any = ref([]) // a端设备列表
const zEquipmentList: any = ref([]) // z端设备列表
watch(
  () => form.aNodeId,
  val => {
    if (val?.length) {
      queryEquipmentList(val, 'aPort')
    }
  }
)
// 监听a端节点  调用a端设备列表
watch(
  () => form.zNodeId,
  val => {
    if (val?.length) {
      queryEquipmentList(val, 'zPort')
    }
  }
)

// 查询节点下的设备
const queryEquipmentList = async (val: any, type: string) => {
  const res = await dciEquipmentList({ nodeIds: val })
  if (type === 'aPort') {
    aEquipmentList.value = res.data
  } else {
    zEquipmentList.value = res.data
  }
}
// a端设备多选禁用逻辑
const hideAequip = (val: any) => {
  form.aPortId = []
  aPortList.value = []
  if (val.indexOf('*') === -1) {
    aEquipmentList.value.map((item: any) => {
      item.disabled = false
    })
  } else {
    form.aEquipmentId = ['*']
    aEquipmentList.value.map((item: any) => {
      item.disabled = true
    })
  }
}
// 监听a端 设备，调用a端端口接口
watch(
  () => form.aEquipmentId,
  val => {
    if (val.length) {
      queryPortList('aPort', val)
    }
  }
)
// a端端口多选禁用逻辑
const hideAport = (val: any) => {
  if (val.indexOf('*') === -1) {
    aPortList.value.map((item: any) => {
      item.disabled = false
    })
  } else {
    form.aPortId = ['*']
    aPortList.value.map((item: any) => {
      item.disabled = true
    })
  }
}
// z端设备多选禁用逻辑
const hideZequip = (val: any) => {
  form.zPortId = []
  zPortList.value = []
  if (val.indexOf('*') === -1) {
    zEquipmentList.value.map((item: any) => {
      item.disabled = false
    })
  } else {
    form.zEquipmentId = ['*']
    zEquipmentList.value.map((item: any) => {
      item.disabled = true
    })
  }
}
// 监听a端 设备，调用a端端口接口
watch(
  () => form.zEquipmentId,
  val => {
    if (val.length) {
      queryPortList('zPort', val)
    }
  }
)
// z端端口多选禁用逻辑
const hideZport = (val: any) => {
  if (val.indexOf('*') === -1) {
    zPortList.value.map((item: any) => {
      item.disabled = false
    })
  } else {
    form.zPortId = ['*']
    zPortList.value.map((item: any) => {
      item.disabled = true
    })
  }
}
// 查询设备下的端口
const queryPortList = async (type: string, val: any) => {
  const res = await dciPortList({ equipmentIds: !val.includes('*') ? val : [] })
  if (type === 'aPort') {
    aPortList.value = res.data
  } else {
    zPortList.value = res.data
  }
}

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
  if (
    form.zNodeId.length === 1 &&
    form.aNodeId.length === 1 &&
    JSON.stringify(form.aNodeId) === JSON.stringify(form.zNodeId)
  ) {
    return ElMessage.warning('节点单选情况下，A端与Z端的节点不能相同')
  }
  formEl.validate((valid: boolean) => {
    if (valid) {
      let params: { [key: string]: any } = {}
      if (isEdit.value) {
        const {
          minBandwidth,
          maxBandwidth,
          nrc,
          mrc,
          mtu,
          delayTime,
          deliveryDuration
        } = form.data[0]
        params = {
          // dataResource: form.dataResource,  // 编辑页面去掉了数据来源，所以不修改
          aNodeId: form.aNodeId,
          aEquipmentId: form.aEquipmentId,
          aPortId: form.aPortId,
          zNodeId: form.zNodeId,
          zEquipmentId: form.zEquipmentId,
          zPortId: form.zPortId,
          minBandwidth,
          maxBandwidth,
          nrc,
          mrc,
          mtu,
          delayTime,
          deliveryDuration,
          id: props.rowData.id
        }
        showLoading('编辑中...')
        dciDataUpdate(params)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success('DCI数据编辑成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('DCI数据编辑失败')
            }
            hideLoading()
          })
          .catch((err: any) => {
            hideLoading()
          })
      } else {
        const { url, ...resetObject } = form
        params = {
          ...resetObject
        }
        showLoading('创建中...')
        dciDataEntry(params)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success('DCI数据录入成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('DCI数据录入失败')
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
.data-entry-container {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .custom-input {
    width: $formInputWidth;
  }
  .add_table {
    cursor: pointer;
    color: var(--el-color-primary);
  }
  :deep(.el-row) {
    justify-content: space-between;
    width: 100%;
  }
}
</style>
