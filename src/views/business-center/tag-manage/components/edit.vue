<template>
  <div>
    <el-form v-model="form" label-position="left">
      <el-form-item label="资源标签">
        <div class="flex-row">
          <el-color-picker
            v-model="form.color"
            color-format="hex"
          ></el-color-picker>
          <el-input v-model="form.labelName" class="ideal-default-margin-left"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="标签说明" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="--"
          maxlength="100"
          show-word-limit
          class="custom-input"
        >
        </el-input>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
import { updateResourceLabel } from '@/api/java/business-center'
import { ElMessage } from 'element-plus'
interface dialogProps {
  rowData?: any
}
const props = withDefaults(defineProps<dialogProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

const form: any = reactive({
  color: '',
  labelName: '',
  remark: ''
})

onMounted(() => {
  form.color = props.rowData.color
  form.remark = props.rowData.remark
  form.labelName = props.rowData.name
})

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const cancelForm = () => {
  emit(EventEnum.cancel)
}
const submitForm = () => {
  const params: any = {
    id: props.rowData.id,
    color: form.color,
    name: form.labelName,
    remark: form.remark
  }
  if (
    form.color === props.rowData.color &&
    form.labelName === props.rowData.name
  ) {
    delete params.name
    delete params.color
  }
  updateResourceLabel(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      ElMessage.success('修改成功')
      emit(EventEnum.success)
    } else {
      ElMessage.success('修改失败')
    }
  })
}
</script>

<style scoped lang="scss">
.colorItem {
  position: absolute;
  top: 9px;
  left: 8px;
}
</style>
