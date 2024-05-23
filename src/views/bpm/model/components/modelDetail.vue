<template>
  <div class="modelDetail">
    <MyProcessViewer
      key="designer"
      v-model="bpmnXML"
      :value="bpmnXML as any"
      v-bind="bpmnControlForm"
      :prefix="bpmnControlForm.prefix"
    />
  </div>
</template>

<script lang="ts" setup>
import { MyProcessViewer } from '@/views/bpm/model/editor/bpmnProcessDesigner/package'
import { getModel } from '@/api/java/bpm/model'

import store from '@/store'
interface CreateProps {
  rowData?: any
}

const props = withDefaults(defineProps<CreateProps>(), {
  rowData: () => ({})
})

onMounted(() => {
  getData()
})

const bpmnXML = ref(null)
const bpmnControlForm = ref({
  prefix: 'flowable'
})
const getData = async () => {
  const { data } = await getModel(props.rowData.id)
  bpmnXML.value = data.bpmnXml || ''
}
</script>

<style scoped lang="scss">
.modelDetail {
  width: 100%;
}
</style>
