<template>
  <div class="info-model">
    <MyProcessViewer
      key="designer"
      :activity-data="activityData"
      :process-instance-data="processInstance"
      :task-data="tasks"
      :value="modelXml"
      v-bind="bpmnControlForm"
      :height="height"
    />
  </div>
</template>
<script lang="ts" setup>
import { MyProcessViewer } from '@/views/bpm/model/editor/bpmnProcessDesigner/package'
interface DialogProps {
  modelXml: string
  height?: number
  processInstance?: any // 行数据
  activityData?: any // 行数据
  tasks?: any
}

const route = useRoute()
const props = withDefaults(defineProps<DialogProps>(), {
  modelXml: '',
  processInstance: {},
  activityData: [],
  tasks: [],
  height: 760
})
const bpmnControlForm = ref({
  prefix: 'flowable'
})
</script>
<style></style>
