<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <div v-if="showConfirm">
      是否对当前告警记录进行确认？确认后该记录不再进行告警通知。
    </div>

    <div v-else-if="showDelete">确认删除当前告警记录吗？</div>

    <ideal-table-list
      v-else-if="showDetail"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #triggerTimes>
        <el-table-column label="触发次数">
          <template #default="props">
            <div>第{{ props.row.triggerTimes }}次</div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="clickCancelEvent">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="clickSuccessEvent">{{
        t('confirm')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import { ElMessage } from 'element-plus/es'
import {
  alarmRecordOperate,
  alarmRecordBatchOperate
} from '@/api/java/maintenance-center'
import type { IdealTableColumnHeaders } from '@/types'
import { alarmRecordDetailUrl } from '@/api/java/maintenance-center'

// 属性值
interface DialogProps {
  type?: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  selectData?: any[] // 多选数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  type: '',
  rowData: null,
  selectData: () => []
})

const state: IHooksOptions = reactive({
  dataListUrl: alarmRecordDetailUrl,
  deleteUrl: '',
  queryForm: {
    alertConfigId: props.rowData.alertConfigId,
    alertConfigRuleId: props.rowData.alertConfigRuleId,
    uuid: props.rowData.uuid
  }
})
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '阈值规则名称', prop: 'alertConfigRuleName' },
  { label: '规则描述', prop: 'overview', width: '350' },
  { label: '告警级别', prop: 'reportLevelDes' },
  { label: '触发次数', prop: 'triggerTimes', useSlot: true },
  { label: '触发时间', prop: 'timeDes' }
]

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

const { t } = useI18n()

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('30%')

const showConfirm = computed(() => props.type === 'confirm')

const showDelete = computed(() => props.type === 'delete')

const showDetail = computed(() => props.type === 'detail')

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

// 类型变化,
watch(
  () => props.type,
  () => {
    initDialog()
  }
)
onMounted(() => {
  initDialog()
})
const initDialog = () => {
  if (showConfirm.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '确认'
  } else if (showDetail.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '查看告警详情'
  }
}

// 弹框取消
const clickCancelEvent = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
// 弹框成功提交
const clickSuccessEvent = () => {
  if (showConfirm.value) {
    handleAlarmRecord()
  } else if (showDelete.value) {
    handleAlarmRecord('PAGE_DELETE')
  }
}
const handleAlarmRecord = (status: string = 'PAGE_CHECK') => {
  if (props.selectData.length) {
    batch(status)
  } else {
    single(status)
  }
}
const single = (status: string) => {
  const params: { [key: string]: any } = {
    status,
    id: props.rowData.id
  }
  let tip = '确认'
  if (status === 'PAGE_DELETE') {
    tip = '删除'
  }
  alarmRecordOperate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      dialogVisible.value = false
      emit(EventEnum.refresh)
      ElMessage.success(`${tip}成功`)
    } else {
      ElMessage.error(`${tip}失败`)
    }
  })
}
const batch = (status: string) => {
  const params: { [key: string]: any } = {
    status,
    ids: props.selectData.join(',')
  }
  let tip = '确认'
  if (status === 'PAGE_DELETE') {
    tip = '删除'
  }
  alarmRecordBatchOperate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      dialogVisible.value = false
      emit(EventEnum.refresh)
      ElMessage.success(`${tip}成功`)
    } else {
      ElMessage.error(`${tip}失败`)
    }
  })
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
