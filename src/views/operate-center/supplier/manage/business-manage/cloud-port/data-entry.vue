<template>
  <div class="data-entry-container">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="端口名称" prop="portId">
        <el-select
          v-model="form.portId"
          placeholder="请选择端口名称"
          class="custom-input"
          @change="changePort"
        >
          <el-option
            v-for="(item, index) of portList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.dataResource === 'static'"
        label="数据详情"
        prop="dataDetail"
      >
        <ideal-table-list
          :table-data="form.dataDetail"
          :table-headers="tableHeaders"
          :show-pagination="false"
        >
          <template #bandwidth>
            <el-table-column label="带宽大小" width="200px">
              <template #default="props">
                <el-select
                  v-model="props.row.bandwidth"
                  placeholder="请选择带宽大小"
                >
                  <el-option
                    v-for="(item, index) of bandwidthList"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
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

          <template #deliveryDuration>
            <el-table-column label="交付工期">
              <template #default="props">
                <el-input v-model="props.row.deliveryDuration" />
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
        v-if="form.dataResource === 'URL'"
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
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
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
  getPortList,
  cloudDataEntry,
  cloudDataUpdate
} from '@/api/java/operate-center'
import { hideLoading, showLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus'
import { bandwidthFormat } from '../common'

// 属性值
interface PortProps {
  type: undefined | string // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<PortProps>(), {
  rowData: null
})

const isEdit = computed(() => props.type === 'portDataEdit')

const { t } = useI18n()

const formRef = ref<FormInstance>() // 校验表单
const form = reactive({
  portId: '',
  dataResource: 'static',
  dataDetail: [
    {
      bandwidth: '',
      nrc: '',
      mrc: '',
      deliveryDuration: ''
    }
  ] as any[],
  url: '',
  vendorId: ''
})

const hasEmptyProperty = (obj: any) => {
  if (!Object.keys(obj).length) {
    return true
  } else {
    const keys = ['bandwidth', 'nrc', 'mrc', 'deliveryDuration']
    return keys.some(key => {
      return !obj[key]
    })
  }
}
const validatePort = (rule: any, value: any, callback: (e?: Error) => any) => {
  const flag = value.some((item: any) => {
    return hasEmptyProperty(item)
  })

  if (flag && value.length === 1) {
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
  portId: [{ required: true, message: '请选择端口', trigger: 'change' }],
  dataDetail: [{ required: true, validator: validatePort, trigger: 'blur' }]
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '带宽大小', prop: 'bandwidth', useSlot: true },
  { label: '价格/NRC', prop: 'nrc', useSlot: true },
  { label: '价格/MRC', prop: 'mrc', useSlot: true },
  { label: '交付工期', prop: 'deliveryDuration', useSlot: true }
]

const portList: any = ref([])
const sourceList = [
  { label: 'static', name: '静态录入' }
  // { label: 'URL', name: 'API对接' }
]

const handleAdd = () => {
  form.dataDetail.push({
    bandwidth: '',
    nrc: '',
    mrc: '',
    deliveryDuration: ''
  })
}
const handleDelete = (index: number) => {
  form.dataDetail.splice(index, 1)
}

onMounted(() => {
  queryNode()
  if (isEdit.value) {
    form.portId = props.rowData.port?.id
    form.vendorId = props.rowData.vendorId
    form.dataResource = props.rowData.dataResource
    form.dataDetail = [props.rowData]
  }
})
//查询云端口
const queryNode = async () => {
  const res = await getPortList({
    searchType: 1
  })
  portList.value = res.data
  // 编辑操作+端口列表有值的情况下，调用带宽下拉列表
  if (isEdit.value && portList.value) {
    const filterPort = portList.value.filter(
      (item: any) => item.id === props.rowData.port?.id
    )[0].cloudPortType
    bandwidthList.value = bandwidthFormat[filterPort]
  }
}
const bandwidthList: any = ref([])
// 端口改变事件
const changePort = (id: string) => {
  form.dataDetail = form.dataDetail.map(item => {
    item.bandwidth = ''
    return item
  })
  const filterPort = portList.value.filter((item: any) => item.id === id)[0]
    .cloudPortType
  bandwidthList.value = bandwidthFormat[filterPort]
}
watch(
  () => form.portId,
  val => {
    const portInfo = portList.value.find((item: any) => item.id === val)
    if (portInfo) {
      form.vendorId = portInfo?.vendorId
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
  formEl.validate((valid: boolean) => {
    if (valid) {
      const params: { [key: string]: any } = {
        dataResource: form.dataResource,
        portId: form.portId,
        venDorId: form.vendorId
      }
      if (isEdit.value) {
        const { bandwidth, nrc, mrc, deliveryDuration } = form.dataDetail[0]
        params.id = props.rowData.id
        params.bandwidth = bandwidth
        params.nrc = nrc
        params.mrc = mrc
        params.deliveryDuration = deliveryDuration
        showLoading('编辑中...')
        cloudDataUpdate(params)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success('端口数据编辑成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('端口数据编辑失败')
            }
            hideLoading()
          })
          .catch((err: any) => {
            hideLoading()
          })
      } else {
        if (form.dataResource === 'static') {
          params.data = form.dataDetail
        } else {
          params.url = form.url
        }
        showLoading('数据录入中...')
        cloudDataEntry(params)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success('端口数据录入成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('端口数据录入失败')
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
}
</style>
