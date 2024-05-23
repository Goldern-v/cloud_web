<template>
  <div class="process-info">
    <div v-if="type === 'create'" class="header-btns">
      <el-button size="small" type="primary" @click="changeProcess">
        <svg-icon
          icon="circle-add"
          color="white"
          class="ideal-svg-margin-right"
        ></svg-icon>
        选择其他流程 </el-button
      >·
    </div>
    <div
      v-if="approveTasks && type != 'create' && currentRow"
      class="form-info info-approve"
    >
      <div class="form-info-title">
        {{ `审批任务【${approveTasks.name}】` }}
      </div>
      <div class="form-info-content">
        <info-approve
          :type="type"
          :current-task="currentRow"
          :process-data="approveTasks"
          @clickSuccessEvent="approveSuccess"
        />
      </div>
    </div>
    <div v-if="currentRow" class="form-info">
      <div class="form-info-title">
        {{ `申请信息【${currentRow.name}】` }}
      </div>
      <div class="form-info-content">
        <info-form
          :type="type"
          :row-data="currentRow"
          @clickSuccessEvent="formSuccess"
        />
      </div>
    </div>
    <div
      v-if="approveTaskLog && type != 'create'"
      class="form-info approve-log"
    >
      <div class="model-info-title">审批记录</div>
      <div class="model-info-content">
        <info-approve-log :type="type" :approve-log-list="approveTaskLog" />
      </div>
    </div>
    <div class="form-info model-info">
      <div class="model-info-title">流程图</div>
      <div
        v-if="
          (mddelList && currentRow && modelXml && approveTaskLog) ||
          (type === 'create' && modelXml)
        "
        class="model-info-content"
      >
        <info-model
          :activity-data="mddelList"
          :tasks="approveTaskLog"
          :process-instance="currentRow"
          :model-xml="modelXml"
        ></info-model>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import store from '@/store'
import infoForm from '../../components/info-fom.vue'
import infoApproveLog from '../../components/info-approve-log.vue'
import infoApprove from '../../components/info-approve.vue'
import infoModel from '../../components/info-model.vue'
import { EventEnum } from '@/utils/enum'
import type { ApiAttrs } from '@form-create/element-ui/types/config'
import {
  bpmMyprocessForm,
  bpmMyprocessModel,
  bpmMyprocessApprove,
  bpmMyprocessModelXml
} from '@/api/java/bpm/task'
import { router } from '@/router'
// 属性值
interface DialogProps {
  id?: string
  rowData?: any // 行数据
  type?: string
}
const route = useRoute()
const props = withDefaults(defineProps<DialogProps>(), {
  id: '',
  rowData: null,
  type: 'create'
})

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()
const fApi = ref<ApiAttrs>()
/**
 * 选择其他流程
 */
const changeProcess = () => {
  emit(EventEnum.close)
}
// 当前form
let currentRow = ref()
// 审批日志
let approveTaskLog = ref()
// 模型activity数据
let mddelList = ref([])
let modelXml = ref('')
// 任务
let approveTasks = ref()

let currentId = computed(() => {
  return route.query.id || props.rowData.id
})

let processDefinitionId = computed(() => {
  return route.query.processDefinitionId || props.rowData.id
})

/**
 * 获取表单数据
 */
const getFormData = () => {
  bpmMyprocessForm({ id: currentId.value })
    .then((res: any) => {
      if (res.code === 200) {
        currentRow.value = res.data
        let formDetail = res.data.processDefinition
        currentRow.value.conf = formDetail.formConf
        currentRow.value.fields = formDetail.formFields
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}
type taskLogType = {
  [index: string]: any
}
/**
 * 获取审批数据
 */
const getApproveData = () => {
  bpmMyprocessApprove({ processInstanceId: currentId.value })
    .then((res: any) => {
      approveTaskLog.value = []
      approveTasks.value = null
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
        approveTasks.value = approveTaskLog.value.find(
          (task: any) =>
            task.result === 1 &&
            task.assigneeUser &&
            store.userStore.user.id === task.assigneeUser.id
        )
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}

// 获取审批模型
const getModelData = () => {
  bpmMyprocessModel({ processInstanceId: currentId.value }).then((res: any) => {
    if (res.code === 200) {
      return (mddelList.value = res.data)
    }
  })
}

/**
 * 获取审批模型Xml
 */
const getModelXmlData = () => {
  bpmMyprocessModelXml({ id: processDefinitionId.value })
    .then((res: any) => {
      if (res.code === 200) {
        modelXml.value = res.data
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}

/**
 * 初始化
 */
const initView = () => {
  // 新建
  if (props.type === 'create') {
    currentRow.value = props.rowData
    getModelXmlData()
    return
  }
  getFormData()
  getApproveData()
  getModelData()
  getModelXmlData()
}

/**
 * 审批 成功重新渲染页面
 */
const approveSuccess = () => {
  // initView()
  router.push('/bpm-manage/task/todo')
}

/**
 * 新建成功回跳我的流程页面
 */
const formSuccess = () => {
  router.push('/bpm-manage/task/my-process')
}
// 初始化
onMounted(() => {
  initView()
})
</script>

<style scoped lang="scss">
.process-info {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #eee;
  .header-btns {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .form-info {
    width: 100%;
    box-sizing: border-box;
    // border: 1px solid #eee;
    margin: 20px 0 30px 0;
    border: 1px solid #eee;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    .form-info-content {
      width: 100%;
      padding: 20px;
      :deep .el-form {
        width: 90%;
      }
    }
  }
  .model-info {
    border: 1px solid #eee;
    box-sizing: border-box;
    .model-info-content {
      min-height: 300px;
    }
  }
  .model-info-title,
  .form-info-title {
    font-size: 14px;
    line-height: 24px;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    padding: 10px 0 10px 10px;
    font-weight: 600;
  }
}
</style>
