<template>
  <div>
    <div class="flex-row">
      <cloud-port-form
        v-for="(item, index) in formList"
        :key="index"
        ref="cloudFormRef"
        :type="type"
        :cloud-port-form="item"
        style="flex: 1"
      >
      </cloud-port-form>
    </div>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { cloudPortCreateProps } from '../interface'
import cloudPortForm from './cloud-port-form.vue'
import { getCloudPortParams } from './cloud-port'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import {
  portAdd,
  azurePortAdd,
  portEdit,
  getAzurePortDetail
} from '@/api/java/operate-center'
import { ElMessage } from 'element-plus'

interface CloudPortProps {
  rowData?: any
  type?: string
}
const props = withDefaults(defineProps<CloudPortProps>(), {
  type: '',
  rowData: () => {}
})

const { t } = useI18n()

const isAzure = computed(() => RegExp(/(Azure)/i).test(props.type as string)) // 判断是否为Azure
const isAli = computed(() => RegExp(/(Ali)/i).test(props.type as string)) // 判断是否为Ali
const isAws = computed(() => RegExp(/(Aws)/i).test(props.type as string)) // 判断是否为isAws
const isEdit = computed(() => RegExp(/(edit)/i).test(props.type as string)) //判断是否为编辑模式

const {
  cloudFormRef,
  createAliPortParams,
  createAwsPortParams,
  createAzurePortParams,
  updateAzurePortParams
} = getCloudPortParams()

const formList = ref<cloudPortCreateProps[]>([])
onMounted(() => {
  if (isAzure.value) {
    if (isEdit.value) {
      queryAzurePortDetail(props.rowData.id)
    } else {
      formList.value = [{}, {}]
    }
  } else {
    if (isEdit.value) {
      formList.value = [props.rowData]
    } else {
      formList.value = [{}]
    }
  }
})
//查询azure port详情
const queryAzurePortDetail = (id: string) => {
  getAzurePortDetail(id).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      formList.value = [
        Object.assign({}, data.currentPort, { disabled: false }),
        Object.assign({}, data.twinPort, { disabled: true })
      ]
    }
  })
}

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = async () => {
  if (isAzure.value) {
    const leftFormRef = cloudFormRef.value[0].formRef
    const RightFormRef = cloudFormRef.value[1].formRef
    if ((await checkForm(leftFormRef)) && (await checkForm(RightFormRef))) {
      onClickCommit()
    }
  } else {
    const formRef = cloudFormRef.value[0].formRef
    if (await checkForm(formRef)) {
      onClickCommit()
    }
  }
}

// 校验表单
const checkForm = async (formEl: FormInstance | undefined) => {
  let validFlag = false
  if (!formEl) {
    validFlag = false
  }
  await formEl?.validate(valid => {
    validFlag = valid
  })
  return validFlag
}
//提交创建
const onClickCommit = () => {
  let params: { [key: string]: any } = {}
  let desc = ''
  if (isAli.value) {
    params = createAliPortParams()
    desc = '阿里云'
  } else if (isAws.value) {
    params = createAwsPortParams()
    desc = 'aws '
  } else if (isAzure.value) {
    params = isEdit.value ? updateAzurePortParams() : createAzurePortParams()
    desc = 'Azure'
  }
  if (isEdit.value) {
    params.id = props.rowData.id
    showLoading('编辑中...')
    portEdit(params)
      .then((res: any) => {
        if (res.code === 200) {
          ElMessage.success(`编辑${desc}云端口成功`)
          emit(EventEnum.success)
        } else {
          ElMessage.error(`编辑${desc}云端口失败`)
        }
        hideLoading()
      })
      .catch((err: any) => {
        hideLoading()
      })
  } else {
    showLoading('创建中...')
    if (isAli.value || isAws.value) {
      portAdd(params)
        .then((res: any) => {
          if (res.code === 200) {
            ElMessage.success(`创建${desc}云端口成功`)
            emit(EventEnum.success)
          } else {
            ElMessage.error(`创建${desc}云端口失败`)
          }
          hideLoading()
        })
        .catch((err: any) => {
          hideLoading()
        })
    } else {
      azurePortAdd(params)
        .then((res: any) => {
          if (res.code === 200) {
            ElMessage.success('创建Azure云端口成功')
            emit(EventEnum.success)
          } else {
            ElMessage.error('创建Azure云端口失败')
          }
          hideLoading()
        })
        .catch((err: any) => {
          hideLoading()
        })
    }
  }
}
</script>

<style scoped lang="scss"></style>
