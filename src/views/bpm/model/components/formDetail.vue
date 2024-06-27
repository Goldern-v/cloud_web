<template>
  <div className="formDetail">
    <FormCreate
      :rule="formDetailPreview.rule"
      :option="formDetailPreview.option"
    />
  </div>
</template>

<script lang="ts" setup>
import formCreate from '@form-create/element-ui'

import { setConfAndFields2 } from '@/utils/form-create'
import { bpmFormQueryDetail } from '@/api/java/bpm/form'
const formDetailPreview = ref({
  rule: [],
  option: {}
})

interface CreateProps {
  rowData?: any
}

const router = useRouter()
const props = withDefaults(defineProps<CreateProps>(), {
  rowData: () => ({})
})

onMounted(() => {
  getData()
})

const getData = async () => {
  if (props.rowData.formType == 10) {
    // 设置表单
    const { data } = await bpmFormQueryDetail({ id: props.rowData.formId })
    setConfAndFields2(formDetailPreview, data.conf, data.fields)
  } else {
    router.push({
      path: props.rowData.formCustomCreatePath
    })
  }
}
</script>

<style scoped lang="scss">
.formDetail {
  width: 100%;
}
</style>
