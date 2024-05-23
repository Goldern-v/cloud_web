<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <section>
      <FormCreate :rule="detailData.rule" :option="detailData.option" />
    </section>
  </el-dialog>
</template>

<script setup lang="ts">
import formCreate from '@form-create/element-ui'
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import { setConfAndFields2 } from '@/utils/form-create'
import { FormList } from '@/types/bpm-form'
// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: {}
})

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

// 弹框
const dialogTitle = ref('表单详情') // 标题
const dialogVisible = ref(true) // 是否展开
const dialogWidth = ref('60%') // 弹层宽度

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

// 弹框取消
const clickCancelEvent = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
// 弹框成功提交
const clickSuccessEvent = () => {
  dialogVisible.value = false
  emit(EventEnum.refresh)
}

// //获取Form表单 model对象
const onSubmit = () => {
  console.log('Form表单 model对象：')
}

// 表单组件参数
const detailData = ref({
  rule: [],
  option: {}
})

onMounted(() => {
  // 表单组件回显
  setConfAndFields2(detailData, props.rowData.conf, props.rowData.fields)
})
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
