<template>
  <div class="create-form">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="VDC名称" prop="name">
        <el-input v-model="form.name" clearable class="custom-input" />
      </el-form-item>

      <el-form-item>
        <template #label>
          <div class="flex-row">
            <div style="margin-right: 3px">上级VDC</div>
            <el-tooltip
              effect="dark"
              placement="right"
              content="最多支持创建5级VDC"
              popper-class="vdc-form--create__tooltip"
            >
              <svg-icon icon="question-icon"></svg-icon>
            </el-tooltip>
          </div>
        </template>

        <el-select
          v-model="form.vdcName"
          :disabled="isEdit"
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
        <div v-if="checkVdcLevel" class="el-form-item__error">
          最多支持创建5级VDC
        </div>
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

    <div class="flex-row footer-button">
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
import { EventEnum } from '@/utils/enum'
import { addVdcApi, editVpcApi } from '@/api/java/business-center'
import { vdcTreeList } from '@/api/java/public'

interface CreateProps {
  rowData?: any
  isEdit?: boolean
}
const props = withDefaults(defineProps<CreateProps>(), {
  rowData: () => ({}),
  isEdit: false
})

const { t } = useI18n()

onMounted(() => {
  if (props.isEdit) {
    form.name = props.rowData.name
    form.id = props.rowData.id
    form.remark = props.rowData.remark
    form.vdcName = props.rowData.parent.name
  }
  getVdcTree()
})

const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  vdcName: '',
  code: '',
  parent: '',
  level: 0,
  remark: '',
  id: '',
  sons: [{ name: '', level: 0 }]
})

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  let vdcNameRepeat = form.sons.some(item => item.name === value)
  if (!value.length) {
    callback(new Error('请输入VDC名称'))
  } else if (vdcNameRepeat) {
    callback(new Error('上级vdc下已存在该名称vdc'))
  }
  callback()
}

const checkVdcLevel = ref(false) //vdc层级校验
watch(
  () => form.level,
  val => {
    checkVdcLevel.value = val >= 5 ? true : false
  }
)
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }]
})
// vdc数据
const vdcTree: any = ref([])
// vdc结构
const defaultProps = {
  children: 'sons',
  label: 'name'
}
// 获取vdc
const getVdcTree = async () => {
  try {
    const res = await vdcTreeList()
    vdcTree.value = res.data.sons
  } catch (err: any) {
    ElMessage.error(err)
  }
}
// vdc点击
const handleNodeClick = (data: any) => {
  form.vdcName = data.name
  form.code = data.code
  form.parent = data.id
  form.level = data.level
  form.sons = data.sons
}

// 方法
interface EmitEvent {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvent>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}
//创建/编辑vdc
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl || checkVdcLevel.value) {
    return
  }
  formEl.validate(async (valid: any) => {
    if (valid) {
      const obj: any = {}
      if (!props.isEdit) {
        obj.name = form.name
        obj.level = form.level
        obj.code = form.code
        obj.parent = form.parent
        obj.remark = form.remark
        const res: any = await addVdcApi(obj)
        if (res.code === 200) {
          ElMessage.success('新增成功')
          emit(EventEnum.success)
        } else {
          ElMessage.error('新增失败')
        }
      } else {
        obj.name = form.name
        obj.id = form.id
        obj.remark = form.remark
        const res: any = await editVpcApi(obj)
        if (res.code === 200) {
          ElMessage.success('编辑成功')
          emit(EventEnum.success)
        } else {
          ElMessage.error('编辑失败')
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
.create-form {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
  .custom-input {
    width: 100%;
  }
  .el-form-item__error {
    color: var(--el-color-danger);
    font-size: 12px;
    line-height: 1;
    position: absolute;
    top: 100%;
    left: 0;
  }
  .vdc-form--create__tooltip {
    width: 100px;
  }
}
</style>
