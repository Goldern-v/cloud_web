<template>
  <div
    v-if="mddelList && currentRow && modelXml && approveTaskLog"
    class="approve-process"
  >
    <info-model
      :activity-data="mddelList"
      :tasks="approveTaskLog"
      :process-instance="currentRow"
      :model-xml="modelXml"
      :height="400"
    ></info-model>
  </div>
</template>

<script setup lang="ts">
import infoModel from '@/views/bpm/components/info-model.vue'
import {
  bpmMyprocessForm,
  bpmMyprocessModel,
  bpmMyprocessApprove,
  bpmMyprocessModelXml,
  bpmProcessInstance
} from '@/api/java/bpm/task'
interface DialogProps {
  id?: string
  processDefinitionId?: string
  orderInfo?: any
}
const route = useRoute()
const props = withDefaults(defineProps<DialogProps>(), {
  id: '07245c5a-4716-11ee-93ad-0242ac110007',
  processDefinitionId: 'model-004:1:9e6c12cf-4707-11ee-93ad-0242ac110007',
  orderInfo: {}
})

const instanceId = ref<string>('')
const processDefinitionId = ref<string>('')

let currentRow = ref()
let approveTaskLog = ref()
let mddelList = ref([])
let modelXml = ref('')

/**
 * 获取实例信息
 */
const getProcessInstance = () => {
  let params = {
    key: 'orderId',
    value: props.orderInfo['id']
  }
  bpmProcessInstance(params)
    .then((res: any) => {
      if (res.code === 200) {
        instanceId.value = res.data
        getFormData()
      }
    })
    .catch(err => {})
}

// 获取表单
const getFormData = () => {
  bpmMyprocessForm({ id: instanceId.value })
    .then((res: any) => {
      if (res.code === 200) {
        currentRow.value = res.data
        let formDetail = res.data.processDefinition
        currentRow.value.conf = formDetail.formConf
        currentRow.value.fields = formDetail.formFields
        processDefinitionId.value = res.data.processDefinition.id
        getApproveData()
        getModelData()
        getModelXmlData()
      }
    })
    .catch(err => {})
}
type taskLogType = {
  [index: string]: any
}
// 获取审批数据
const getApproveData = () => {
  bpmMyprocessApprove({ processInstanceId: instanceId.value })
    .then((res: any) => {
      approveTaskLog.value = []
      if (res.code === 200) {
        // 1.1 移除已取消的审批
        res.data.forEach((task: any) => {
          if (task.result !== 4) {
            approveTaskLog.value.push(task)
          }
        })

        // 1.2 排序，将未完成的排在前面，已完成的排在后面；
        approveTaskLog.value.sort((a: taskLogType, b: taskLogType) => {
          // 有已完成的情况，按照完成时间倒序
          if (a.endTime && b.endTime) {
            return Date.parse(b.endTime) - Date.parse(a.endTime)
          } else if (a.endTime) {
            return 1
          } else if (b.endTime) {
            return -1
            // 都是未完成，按照创建时间倒序
          } else {
            return b.createTime - a.createTime
          }
        })
      }
    })
    .catch(err => {})
}

// 获取审批模型
const getModelData = () => {
  bpmMyprocessModel({ processInstanceId: instanceId.value }).then(
    (res: any) => {
      if (res.code === 200) {
        return (mddelList.value = res.data)
      }
    }
  )
}

// 获取审批模型Xml
const getModelXmlData = () => {
  bpmMyprocessModelXml({ id: processDefinitionId.value }).then((res: any) => {
    if (res.code === 200) {
      modelXml.value = res.data
    }
  })
}

const initData = () => {
  getProcessInstance()
}
watch(
  () => props.orderInfo,
  newVal => {
    console.log(newVal, '-----详情')

    if (newVal) {
      initData()
    }
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.approve-process {
  width: 100%;
  height: 400px;
}
</style>
