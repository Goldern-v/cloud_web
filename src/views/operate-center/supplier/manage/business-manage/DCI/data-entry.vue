<template>
  <div class="data-entry-container">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="A端端口" prop="aPortId">
        <el-select
          v-model="form.aPortId"
          placeholder="请选择A端端口名称"
          class="custom-input"
        >
          <el-option
            v-for="(item, index) of portList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Z端端口" prop="zPortId">
        <el-select
          v-model="form.zPortId"
          placeholder="请选择Z端端口名称"
          class="custom-input"
        >
          <el-option
            v-for="(item, index) of portList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="数据来源" prop="dataResource" required>
        <el-radio-group v-model="form.dataResource">
          <el-radio
            v-for="(item, index) in sourceList"
            :key="index"
            :label="item.label"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
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
            <el-table-column label="延时">
              <template #default="props">
                <el-input v-model="props.row.delayTime" />
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
  getPortList,
  dciDataEntry,
  dciDataUpdate
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
  aPortId: '',
  zPortId: '',
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

const rules = reactive<FormRules>({
  type: [{ required: true, message: '请选择端口类型', trigger: 'change' }],
  aPortId: [
    { required: true, message: '请选择A端端口名称', trigger: 'change' }
  ],
  zPortId: [
    { required: true, message: '请选择Z端端口名称', trigger: 'change' }
  ],
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

const portList: any = ref([])
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
  queryNode()
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
//查询云端口
const queryNode = async () => {
  const res = await getPortList({
    searchType: 1
  })
  portList.value = res.data
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
          dataResource: form.dataResource,
          aPortId: form.aPortId,
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
}
</style>
