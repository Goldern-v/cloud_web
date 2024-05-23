<template>
  <div class="create-container">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="form.name" clearable class="custom-input" />
      </el-form-item>

      <el-form-item label="VDC" prop="vdcName">
        <el-select
          v-model="form.vdcName"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option hidden :value="1" style="height: auto"> </el-option>
          <el-tree
            :data="vdcTree"
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="描述" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入内容"
          class="custom-input"
        >
        </el-input>
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
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { nameRuleOne } from '@/utils/validate'
import { EventEnum } from '@/utils/enum'
import { vdcTreeList } from '@/api/java/public'
import { addProjectApi, editProjectApi } from '@/api/java/business-center.js'

const { t } = useI18n()

interface CreateProps {
  rowData?: any
  isEdit?: boolean
}
const props = withDefaults(defineProps<CreateProps>(), {
  rowData: () => ({}),
  isEdit: false
})

onMounted(() => {
  if (props.isEdit) {
    form.name = props.rowData?.name
    form.id = props.rowData?.id
    form.remark = props.rowData?.remark
    form.vdcName = props.rowData?.vdcName
  }
  getVdcTree()
})
// 查询vdc
const getVdcTree = async () => {
  try {
    const res = await vdcTreeList()
    vdcTree.value = res.data.sons
  } catch (err: any) {
    ElMessage.error(err)
  }
}

const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  vdcName: '',
  code: '',
  id: '',
  level: '',
  remark: ''
})
const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请输入项目名称'))
  }
  nameRuleOne({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  vdcName: [{ required: true, message: '请选择VDC', trigger: 'blur' }]
})

const vdcTree: any = ref([])
// vdc数据结构
const defaultProps = {
  children: 'sons',
  label: 'name'
}

// vdc点击
const handleNodeClick = (data: any) => {
  form.vdcName = data.name
  form.code = data.code
  form.id = data.id
  form.level = data.level
}

// 方法
interface EmitEvents {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvents>()

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
  formEl.validate(async (valid: any) => {
    if (valid) {
      let params: any = {}
      if (props.isEdit) {
        params.name = form.name
        params.id = form.id
        params.remark = form.remark
        const res: any = await editProjectApi(params)
        if (res.code === 200) {
          ElMessage.success('编辑成功')
          emit(EventEnum.success)
        } else {
          ElMessage.error('编辑失败')
        }
      } else {
        params = {
          name: form.name,
          remark: form.remark,
          vdcId: form.id,
          vdcCode: form.code,
          shared: '0'
        }
        const res: any = await addProjectApi(params)
        if (res.code === 200) {
          ElMessage.success('新增成功')
          emit(EventEnum.success)
        } else {
          ElMessage.error('新增失败')
        }
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.create-container {
  width: 100%;
  .custom-input {
    width: 100%;
  }
}
</style>
