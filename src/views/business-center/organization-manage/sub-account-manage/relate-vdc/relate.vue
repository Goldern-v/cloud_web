<template>
  <div class="create-form">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="VDC">
        <el-tree-select
          v-model="form.vdcId"
          :data="vdcList"
          :render-after-expand="false"
          check-strictly
          :props="defaultProps"
          style="width: 90%"
        />
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button ideal-large-margin-top">
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
import { showLoading, hideLoading } from '@/utils/tool'
import { vdcTreeList } from '@/api/java/public'
import { userRelateVdc } from '@/api/java/business-center'

interface VdcProps {
  associatedVdc?: any[] //已关联的vdc
}
const props = withDefaults(defineProps<VdcProps>(), {
  associatedVdc: () => []
})

const { t } = useI18n()

onMounted(() => {
  getVdcTree()
})

const formRef = ref<FormInstance>()
const form = reactive({
  vdcId: ''
})

const rules = reactive<FormRules>({})
// vdc数据
// vdc结构
const defaultProps = {
  children: 'sons',
  label: 'name',
  value: 'id'
}
const vdcList: any = ref([])
// 获取vdc
const getVdcTree = async () => {
  try {
    const res = await vdcTreeList()
    vdcList.value = res.data.sons
    form.vdcId = props.associatedVdc[0].id
  } catch (err: any) {
    // ElMessage.error(err)
  }
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
//更换vdc
const route = useRoute()
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  const detailInfo = JSON.parse(route.query.detail as any)
  const userId = detailInfo.id
  formEl.validate(async (valid: any) => {
    if (valid) {
      showLoading('关联VDC中...')
      userRelateVdc(userId, { vdcId: form.vdcId })
        .then((res: any) => {
          const { data, code } = res
          if (code === 200) {
            ElMessage.success('关联VDC成功')
            emit(EventEnum.success)
          } else {
            ElMessage.error('关联VDC失败')
          }
          hideLoading()
        })
        .catch(err => {
          hideLoading()
        })
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
