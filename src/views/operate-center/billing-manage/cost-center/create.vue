<template>
  <div class="cost-center-create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.remark"
          maxlength="100"
          show-word-limit
          class="custom-input"
        />
      </el-form-item>

      <el-form-item label="关联VDC" prop="vdc">
        <el-tree-select
          v-model="form.vdc"
          :data="vdcTree"
          multiple
          :render-after-expand="false"
          :props="defaultProps"
          class="custom-input"
        />
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus/es'
import { EventEnum } from '@/utils/enum'
import { nameRuleThree } from '@/utils/validate'
import { vdcTreeList } from '@/api/java/public'
import { addBillCost, editBillCost } from '@/api/java/operate-center'

interface AddCostCenterProp {
  isEdit?: boolean //是否编辑
  rowData?: any //行数据
}
const props = withDefaults(defineProps<AddCostCenterProp>(), {
  isEdit: false,
  rowData: () => ({})
})

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  name: props.rowData.name || '', // 名称
  remark: props.rowData.remark || '', // 描述
  vdc: [] // 关联VDC
})
const vdcTree: Ref<any[]> = ref([])
const defaultProps = {
  children: 'sons',
  label: 'name',
  value: 'id'
}
const getVdcTree = async () => {
  try {
    const res = await vdcTreeList()
    vdcTree.value = res.data.sons
  } catch (err: any) {
    ElMessage.error(err)
  }
}

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请输入名称'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  vdc: [{ required: true, message: '请选择关联VDC', trigger: 'blur' }]
})

interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

onMounted(() => {
  if (props.isEdit) {
    const arr: any = []
    props.rowData.vdcList.forEach((ele: any) => {
      arr.push(ele.id)
    })
    form.vdc = arr
  }
  getVdcTree()
})
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
  let arr: any = []
  form.vdc.forEach(ele => {
    arr.push({
      id: ele
    })
  })
  let params: any = {
    name: form.name,
    remark: form.remark,
    vdcList: arr
  }
  formEl.validate(valid => {
    if (valid) {
      if (props.isEdit) {
        params.id = props.rowData.id
        params.version = props.rowData.version
        editBillCost(params).then((res: any) => {
          let { code } = res
          if (code === 200) {
            setTimeout(() => {
              emit(EventEnum.success)
            }, 3000)
            ElMessage.success('编辑成本中心成功')
          } else {
            ElMessage.error('编辑成本中心失败')
          }
        })
      } else {
        addBillCost(params).then((res: any) => {
          let { code } = res
          if (code === 200) {
            setTimeout(() => {
              emit(EventEnum.success)
            }, 3000)
            ElMessage.success('创建成本中心成功')
          } else {
            ElMessage.error('创建成本中心失败')
          }
        })
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.cost-center-create {
  width: 100%;
  .custom-input {
    width: 100%;
  }
}
</style>
