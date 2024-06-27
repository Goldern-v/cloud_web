<template>
  <div class="create">
    <div class="create__container">
      <div class="flex-row create__tip ideal-default-margin-bottom">
        <svg-icon
          icon="info-warning"
          color="var(--el-color-primary)"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span
          >请提供您底座访问密钥Access Key信息来进行验证。Access
          Key由ID和密钥Secret构成，录入相关信息后可供平台进行纳管。注：需填写主账号的AKSK信息。</span
        >
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
        <el-form-item label="供应商名称" prop="name">
          <el-input
            v-model="form.name"
            class="custom-input"
            placeholder="请输入供应商名称"
          />
        </el-form-item>

        <el-form-item label="供应商类型" prop="supplierType">
          <el-select
            v-model="form.supplierType"
            placeholder="请选择"
            class="custom-input"
            :disabled="isEdit"
          >
            <el-option
              v-for="(item, index) of typeList"
              :key="index"
              :label="item.key"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="访问密钥ID" prop="ak">
          <el-input
            v-model="form.ak"
            class="custom-input"
            placeholder="请输入访问密钥ID"
          />
        </el-form-item>

        <el-form-item label="访问密钥" prop="sk">
          <el-input
            v-model="form.sk"
            class="custom-input"
            placeholder="请输入访问密钥"
          />
        </el-form-item>
      </el-form>
    </div>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 创建和详情-基本信息
 */
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus/es'
import { nameRuleThree } from '@/utils/validate'
import { compareDiffDictionary } from '@/utils/tool'
import { EventEnum } from '@/utils/enum'
import {
  supplierTypeList,
  supplierRegisterCreate,
  supplierRegisterUpdate
} from '@/api/java/operate-center'

interface CreateProps {
  isEdit?: boolean
  rowData?: any
}
const props = withDefaults(defineProps<CreateProps>(), {
  isEdit: false,
  rowData: () => ({})
})

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 供应商名称
  supplierType: '', // 供应商类型
  ak: '',
  sk: ''
})

const checkCloudName = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  if (!value.length) {
    callback(new Error('请输入云平台名称'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkCloudName, trigger: 'blur' }],
  supplierType: [
    { required: true, message: '请选择供应商类型', trigger: 'blur' }
  ],
  ak: [{ required: true, message: '请输入访问密钥ID', trigger: 'blur' }],
  sk: [{ required: true, message: '请输入访问密钥', trigger: 'blur' }]
})

const typeList = ref<any[]>([])
onMounted(() => {
  getTypeList()
  if (props.isEdit) {
    initEditData()
  }
})
const getTypeList = () => {
  supplierTypeList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        typeList.value = data
      } else {
        typeList.value = []
      }
    })
    .catch(_ => {
      typeList.value = []
    })
}

// 表单深拷贝, 比较表单是否修改
const originDic = ref()
// 编辑数据
const initEditData = () => {
  form.name = props.rowData?.name
  form.supplierType = props.rowData?.supplierType
  form.ak = props.rowData?.ak
  form.sk = props.rowData?.sk
  originDic.value = Object.assign({}, form)
}

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  emit(EventEnum.cancel)
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }

  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    if (props.isEdit) {
      handleEdit()
    } else {
      handleCreate()
    }
  })
}

const handleCreate = () => {
  const params = {
    name: form.name, // 供应商名称
    supplierType: form.supplierType, // 供应商类型
    ak: form.ak,
    sk: form.sk
  }
  supplierRegisterCreate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('创建成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('创建失败')
    }
  })
}

const handleEdit = () => {
  // 筛选表单修改项, 编辑时只传修改项
  const tempDic = compareDiffDictionary(originDic.value, form)

  const params: { [key: string]: any } = { id: props.rowData?.id }
  for (const key in tempDic) {
    params[key] = tempDic[key]
  }
  supplierRegisterUpdate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('编辑成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('编辑失败')
    }
  })
}
</script>

<style scoped lang="scss">
$customInputWidth: 352px;
.create {
  width: 100%;
  .create__container {
    padding: $idealPadding;
    .create__tip {
      background-color: var(--el-color-primary-light-9);
      padding: 20px;
      align-items: center;
    }
    .custom-input {
      width: $customInputWidth;
    }
    :deep(.el-input) {
      width: $customInputWidth;
    }
    // 修改分割线颜色
    :deep(.el-divider--vertical) {
      border-left: 2px var(--el-color-primary) solid;
    }
  }
}
</style>
<style lang="scss">
.create-form--create__tooltip {
  width: 260px;
}
</style>
