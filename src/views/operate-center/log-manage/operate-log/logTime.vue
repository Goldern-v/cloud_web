<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :width="dialogWidth"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <div class="flex-row custom-tip-box">
        <svg-icon
          icon="info-warning"
          color="var(--el-color-primary)"
        ></svg-icon>
        <span class="ideal-default-margin-left">{{ tipText }}</span>
      </div>
      <el-form ref="formRef" :model="form" label-position="left">
        <el-row>
          <el-col :span="24">
            <el-form-item label="存储时间:" prop="storageTime" required>
              <el-select
                v-model="form.storageTime"
                placeholder="请选择日志存储时间"
                class="custom-input"
                @change="timeDimensionChange"
              >
                <el-option
                  v-for="(item, index) in timeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="isShow" :span="24">
            <el-form-item
              :label="timeLabel"
              prop="num"
              placeholder="请输入存储周期"
              :rules="isRulesStatus === 0 ? rules.num : [{ required: false }]"
              class="custom-input"
            >
              <el-input v-model="form.num" type="number" min="1"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-show="isShow" :span="24">
            <el-form-item
              label="每日执行时间:"
              prop="time"
              style="margin-top: 10px"
              :rules="isRulesStatus === 0 ? rules.time : [{ required: false }]"
            >
              <el-time-select
                v-model="form.time"
                start="00:00"
                step="01:00"
                end="23:00"
                class="custom-input"
                placeholder="请选择每日执行时间"
              />
            </el-form-item>
          </el-col>
          <el-col v-show="isShow" :span="24">
            <el-form-item
              label="立即执行"
              prop="offhand"
              :rules="
                isRulesStatus === 0 ? rules.offhand : [{ required: false }]
              "
            >
              <el-radio-group v-model="form.offhand">
                <el-radio label="true">是</el-radio>
                <el-radio label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-show="isShow" :span="24">
            <div class="ideal-tip-text">
              <p>【是】立即执行现在设置的存储周期</p>
              <p>
                【否】（到了设置的每日执行时间）就执行（按照系统设定的存储周期自动删除/清理操作日志）
              </p>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <div class="flex-row ideal-submit-button">
        <el-button @click="cancelBtn">{{ t('cancel') }}</el-button>
        <el-button type="primary" @click="submitBtn(formRef)">{{
          t('confirm')
        }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-model="flag"
      :title="innerDialogTitle"
      width="30%"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div class="delete-tip-text">
        <svg-icon icon="info-warning"></svg-icon>
        <span class="dialogText">{{ dialogText }}</span>
      </div>

      <div class="flex-row footer-button">
        <el-button type="info" @click="flag = false">{{
          t('cancel')
        }}</el-button>
        <el-button type="primary" @click="save()">{{
          dialogButtonText
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus/es'
import { EventEnum } from '@/utils/enum'
import { setLogSaveTime } from '@/api/java/operate-center'

interface logProps {
  logStorageInfo?: object
}

const props = withDefaults(defineProps<logProps>(), {
  logStorageInfo: () => ({})
})

const { t } = useI18n()

const formRef = ref<FormInstance>() // 校验表单
const form = reactive({
  storageTime: '',
  time: '',
  num: '',
  offhand: '' as any
})

const rules = reactive<FormRules>({
  num: [{ required: true, message: '请输入存储周期', trigger: 'change' }],
  time: [{ required: true, message: '请选择执行时间', trigger: 'blur' }],
  offhand: [{ required: true, message: '请选择时候立即执行', trigger: '' }]
})

const timeOptions = [
  {
    value: 'DAY',
    label: '天'
  },
  {
    value: 'MONTH',
    label: '月'
  },
  {
    value: 'YEAR',
    label: '年'
  },
  {
    value: 'FOREVER',
    label: '永久保存'
  }
]

const isShow = computed(() => form.storageTime !== 'FOREVER')
const timeLabel = ref('天')
const isRulesStatus = ref(0)
const tipText = ref('')

const params: any = reactive({
  day: '',
  month: '',
  year: '',
  permanentlySave: false,
  hour: '',
  status: ''
})

const timeFormat: any = {
  DAY: '天',
  MONTH: '个月',
  YEAR: '年'
}

// 外部弹框
const dialogTitle = ref('自定义日志存储周期')
const dialogVisible = ref(true)
const dialogWidth = ref('35%')

//内部弹框
const innerDialogTitle = ref('日志删除提示')
const dialogText = ref('')
const flag = ref(false)
const dialogButtonText = ref('')

// 方法
onMounted(() => {
  queryCurrentLogStorage()
})

//存储时间维度改变
const timeDimensionChange = () => {
  form.num = ''
  form.time = ''
  form.offhand = ''
  dialogText.value = ''
  dialogButtonText.value = ''
  params.day = ''
  params.month = ''
  params.year = ''
  params.year = false
  params.hour = ''
  params.status = ''
  if (form.storageTime !== 'FOREVER') {
    isRulesStatus.value = 0
    //控制表单label
    timeLabel.value = `${timeFormat[form.storageTime]}`
    //清空执行
    form.offhand = ''
    //弹框提示
    innerDialogTitle.value = '日志删除提示'
    //弹框按钮
    dialogButtonText.value = '删除'
  } else {
    //是否触发验证规则
    isRulesStatus.value = 1
    //永久保存立即执行
    form.offhand = true
    innerDialogTitle.value = '操作提示'
    dialogButtonText.value = '确定'
  }
}

//查询当前设置的日志保存时间
const queryCurrentLogStorage = () => {
  const data: any = toRaw(props.logStorageInfo)
  form.storageTime = data.logScheduleTaskType
  if (form.storageTime !== 'FOREVER') {
    innerDialogTitle.value = '日志删除提示'
    dialogButtonText.value = '删除'
    timeLabel.value = timeFormat[form.storageTime]
    form.num = data.storageNum
    form.time = data.scheduleDate
    form.offhand = data.status
    tipText.value =
      '当前日志保存时间为' +
      data.storageNum +
      '天；日志删除为不可逆操作；设置存储周期过期日志将自动删除，请谨慎操作'
  } else {
    tipText.value =
      '当前日志保存时间周期为 “永久保存”；设置后系统将不再自动删除/清理日志。'
  }
}
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
const cancelBtn = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

//日志删除提示确认
const submitBtn = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(valid => {
    if (valid) {
      if (form.storageTime !== 'FOREVER') {
        getLogDeleteTime(form.storageTime)
        dialogText.value =
          '日志删除为不可逆操作；当前日志保存时间周期为 “' +
          form.num +
          `${timeFormat[form.storageTime]}”；将删除` +
          logDeleteTimeDay.value +
          '以前的操作日志，请谨慎操作。'
        flag.value = true
        //参数
        params.day = form.num
        params.hour = form.time
        params.status = form.offhand
      } else {
        dialogText.value =
          '当前日志保存时间周期为 “永久保存”；设置后系统将不再自动删除/清理日志。'
        flag.value = true
        params.permanentlySave = true
        params.status = form.offhand
      }
    }
  })
}

//计算日志删除时间
const logDeleteTimeDay = ref('')
const getLogDeleteTime = (time: string) => {
  const date = new Date()
  if (time === 'DAY') {
    date.setDate(date.getDate() - parseInt(form.num))
  } else if (time === 'MONTH') {
    date.setMonth(date.getMonth() - parseInt(form.num))
  } else if (time === 'YEAR') {
    date.setFullYear(date.getFullYear() - parseInt(form.num))
  }
  logDeleteTimeDay.value =
    date.getFullYear() +
    '年' +
    (date.getMonth() + 1) +
    '月' +
    date.getDate() +
    '日'
}

//修改日志保存时间
const save = () => {
  const params = {
    logScheduleTaskType: form.storageTime,
    scheduleDate: form.time,
    status: form.offhand,
    storageNum: form.num
  }
  setLogSaveTime(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('更改日志存储时间周期成功')
      dialogVisible.value = false
      emit(EventEnum.refresh)
    }
  })
}
</script>

<style scoped lang="scss">
.custom-tip-box {
  background-color: var(--el-color-primary-light-9);
  padding: 10px 20px;
  align-items: flex-start;
}
.custom-input {
  width: 100%;
}
.ideal-tip-text {
  text-indent: 10px;
  margin-bottom: 20px;
  height: 22px;
  line-height: 22px;
  opacity: 0.4;
}
.delete-tip-text {
  color: $error6-light;
  height: 22px;
  line-height: 22px;
}
.footer-button {
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}
</style>
