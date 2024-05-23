<template>
  <div class="create-container">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" clearable class="custom-input" />
      </el-form-item>

      <el-form-item label="描述" prop="remark">
        <el-input
          v-model="form.remark"
          :rows="1"
          type="textarea"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item label="云资源" prop="resourceType">
        <el-select
          v-model="form.resourceType"
          :disabled="props.isEdit"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option
            v-for="(item, index) of resourceTypeList"
            :key="index"
            :label="item.name"
            :value="item.uuid"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="前缀" prop="prefixText">
        <el-select
          v-model="form.prefixText"
          value-key="rule"
          placeholder="请选择"
          filterable
          allow-create
          class="custom-input"
        >
          <el-option
            v-for="(item, index) of prefixList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="后缀" prop="suffix">
        <div class="flex-column" style="align-items: flex-start; width: 100%">
          <el-select
            v-model="form.suffix"
            value-key="id"
            placeholder="请选择"
            class="custom-input"
          >
            <el-option
              v-for="(item, index) of suffixList"
              :key="index"
              :label="item.name"
              :value="{ id: item.id }"
            >
            </el-option>
          </el-select>

          <el-button link type="primary" class="ideal-default-margin-top" @click="addSuffix"
            >创建后缀</el-button
          >
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { nameRuleOne } from '@/utils/validate'
import { compareDiffDictionary } from '@/utils/tool'
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import { resourcePoolTypeList } from '@/api/java/public'
import {
  getVdcSuffixApi,
  addVdcNameNormApi,
  editVdcNameNormApi
} from '@/api/java/business-center.js'

// 属性值
interface CreateProps {
  isEdit?: boolean
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<CreateProps>(), {
  isEdit: false,
  rowData: () => ({})
})

const { t } = useI18n()

onMounted(() => {
  getResourcePoolType()
  getVdcSuffix()
  if (props.isEdit) {
    initEdit()
  }
})
// 表单深拷贝, 比较表单是否修改
const originDic = ref()
const initEdit = () => {
  form.name = props.rowData?.name
  form.remark = props.rowData?.remark
  form.resourceType = props.rowData?.resourceType
  form.prefixText = props.rowData?.prefix?.name || props.rowData?.prefix?.rule
  form.suffix = props.rowData?.suffix?.id

  originDic.value = Object.assign({}, form)
}
const route = useRoute()
const vdcId = route.query.id
const vdcCode = route.query.code

const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  remark: '',
  resourceType: '',
  prefixText: '',
  prefix: {
    name: '',
    rule: ''
  },
  suffix: ''
})
const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请输入名称'))
  }
  nameRuleOne({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  resourceType: [
    { required: true, message: '请选择云资源', trigger: 'change' }
  ],
  prefixText: [{ required: true, message: '请选择前缀', trigger: 'change' }],
  suffix: [{ required: true, message: '请选择后缀', trigger: 'change' }]
})

// 前缀数据
const prefixList = ref<any>([
  { label: 'vdc名称', value: 'VDC' },
  { label: '项目名称', value: 'PROJECT' },
  { label: '用户名称', value: 'USER' }
])
watch(
  () => form.prefixText,
  value => {
    prefixList.value.forEach((item: any) => {
      if (item.value === value) {
        form.prefix.rule = value
        form.prefix.name = ''
      } else {
        form.prefix.name = value
        form.prefix.rule = ''
      }
    })
  }
)
// 资源类型
const resourceTypeList = ref<any[]>([])
const getResourcePoolType = () => {
  resourcePoolTypeList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        resourceTypeList.value = data
      } else {
        resourceTypeList.value = []
      }
    })
    .catch(_ => {
      resourceTypeList.value = []
    })
}
// 后缀数据
let suffixList = ref<any>([])
const getVdcSuffix = async () => {
  const res: any = await getVdcSuffixApi(vdcId)
  if (res.code === 200) {
    suffixList.value = res.data
  }
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getVdcSuffix()
}

const addSuffix = () => {
  showDialog.value = true
  dialogType.value = 'suffix-create'
}
// 方法
interface EmitEvent {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvent>()

// 命名规范操作
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
  formEl.validate((valid: Boolean) => {
    if (valid) {
      if (props.isEdit) {
        handleEdit()
      } else {
        handleCreate()
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const handleCreate = () => {
  let params = {
    ...form,
    vdcId,
    vdcCode
  }
  addVdcNameNormApi(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('新建成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('新建失败')
    }
  })
}
const handleEdit = () => {
  // 筛选表单修改项, 编辑时只传修改项
  const tempDic = compareDiffDictionary(originDic.value, form)

  const params: { [key: string]: any } = { id: props.rowData?.id } 
  for (const key in tempDic) {
    if (key === 'prefixText') {
      prefixList.value.forEach((item: any) => {
      if (item.value === form.prefixText) {
        const dic = {
          name: '',
          rule: form.prefixText
        }
        params.prefix = dic
      } else {
        const dic = {
          name: form.prefixText,
          rule: ''
        }
        params.prefix = dic
      }
    })
    } else {
      params[key] = tempDic[key]
    }
  }

  editVdcNameNormApi(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('修改成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('修改失败')
    }
  })
}
</script>

<style scoped lang="scss">
.create-container {
  width: 100%;

  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
  .custom-input {
    width: 100%;
  }
}
</style>
