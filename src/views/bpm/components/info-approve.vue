<template>
  <div class="info-approve">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="表单名">
        {{ currentTask.name }}
      </el-form-item>
      <el-form-item label="流程发起人">
        <div class="approve-user">
          <el-tag>{{ currentTask.startUser.username }}</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="审批建议" prop="reason">
        <el-input
          v-model="formData.reason"
          placeholder="请输入审批建议"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <div class="approve-btns">
      <el-button type="success" :icon="Check" @click="handleAudit(true)"
        >通过</el-button
      >
      <el-button type="danger" :icon="Close" @click="handleAudit(false)"
        >不通过</el-button
      >
      <el-button type="primary" :icon="Edit" @click="handelSend()"
        >转派</el-button
      >
      <!-- <el-button type="primary" :icon="Promotion">委派</el-button>
      <el-button type="warning" :icon="Back">回退</el-button> -->
    </div>

    <!-- 表单保存的弹窗 -->
    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="processData"
      :dialog-width="dialogWidth"
      :dialog-title="dialogTitle"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>
<script lang="ts" setup>
import dialogBox from './dialog-box.vue'
import { Check, Close, Edit, Promotion, Back } from '@element-plus/icons-vue'
import { EventEnum } from '@/utils/enum'
import store from '@/store'
import {
  bpmProcessApprovePass,
  bpmProcessApproveReject
} from '@/api/java/bpm/task'

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()
// 属性值
interface DialogProps {
  processData?: any // 行数据
  currentTask?: any // 行数据
  type?: string
}

const props = withDefaults(defineProps<DialogProps>(), {
  processData: {},
  currentTask: {},
  type: 'create'
})

const router = useRouter()
const { query } = useRoute() // 路由信息
// 提交表单数据
const formData = ref({
  reason: ''
})
const formRules = reactive({
  reason: [{ required: true, message: '请输入审批建议', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

const handleAudit = async (pass: boolean) => {
  // 校验表单
  if (!formRef.value) {
    return
  }
  const valid = await formRef.value.validate()
  if (!valid) {
    return
  }
  // 2.1 提交审批
  const data = {
    id: props.processData.id,
    reason: formData.value.reason
  }
  if (pass) {
    bpmProcessApprovePass(data).then((res: any) => {
      if (res.code === 200) {
        if (res.eventFlowId.length) {
          // 保存事件流id
          res.eventFlowId.forEach((eventFlowId: string) => {
            store.resourceStore.eventFlow.push({ eventFlowId })
          })
        }
        emit(EventEnum.success)
      }
    })
  } else {
    bpmProcessApproveReject(data).then((res: any) => {
      if (res.code === 200) {
        emit(EventEnum.success)
      }
    })
  }
  formData.value.reason = ''
}

// 弹框
const showDialog = ref(false)
const dialogType = ref('cancel')
const dialogTitle = ref('cancel')
const dialogWidth = ref('75%')
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  emit(EventEnum.success)
}

const rowData = ref()
const handelSend = () => {
  showDialog.value = true
  dialogTitle.value = `转派审批人`
  dialogWidth.value = '35%'
}

/** 初始化 **/
onMounted(async () => {})
</script>

<style scoped lang="scss">
.info-approve {
  .approve-user {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .el-tag {
      margin-left: 10px;
    }
  }
  .approve-btns {
    margin-left: 130px;
  }
}
</style>
@/api/java/form/bpm
