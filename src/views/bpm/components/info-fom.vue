<template>
  <div class="info-form">
    <FormCreate
      v-model:api="fApi"
      v-model="detailData.value"
      :rule="detailData.rule"
      :option="detailData.option"
      @submit="submit"
    />
  </div>
</template>

<script setup lang="ts">
import formCreate from '@form-create/element-ui'
import { setConfAndFields2 } from '@/utils/form-create'
import type { ApiAttrs } from '@form-create/element-ui/types/config'
import { EventEnum } from '@/utils/enum'
import { bpmProcessCreate } from '@/api/java/bpm/task'

// 属性值
interface DialogProps {
  rowData?: any // 行数据
  type?: string
}

const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  type: 'create'
})

interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const fApi = ref<ApiAttrs>()
const detailData = ref({
  rule: [],
  option: {},
  value: {}
})
// 弹框取消
const clickCancelEvent = () => {}
// 弹框成功提交
const clickSuccessEvent = () => {}
const submit = (data: any) => {
  if (!fApi.value || !props.rowData) {
    return
  }
  // 提交请求
  fApi?.value?.btn.loading(true)
  let params = {
    processDefinitionId: props.rowData.id,
    variables: data
  }
  bpmProcessCreate(params)
    .then((res: any) => {
      fApi?.value?.btn.loading(false)
      if (res.code === 200) {
        emit(EventEnum.success)
      }
    })
    .catch(err => {
      fApi?.value?.btn.loading(false)
    })
}
setConfAndFields2(
  detailData,
  props.rowData.conf || props.rowData.formConf,
  props.rowData.fields || props.rowData.formFields,
  props.type != 'create' ? props.rowData.formVariables || {} : {}
)
nextTick().then(() => {
  if (props.type != 'create') {
    fApi.value?.btn.show(false)
    fApi.value?.resetBtn.show(false)
    // @ts-ignore
    fApi.value?.disabled(true)
  }
})
onMounted(() => {})
</script>

<style lang="scss" scoped>
</style>
