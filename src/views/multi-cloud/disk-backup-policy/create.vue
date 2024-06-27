<template>
  <div class="ideal-large-margin create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio-button
            v-for="(item, index) in typeList"
            :key="index"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 30%" />
      </el-form-item>

      <el-form-item label="是否启用">
        <el-switch v-model="form.enable" />
      </el-form-item>

      <el-form-item label="备份时间" required>
        <div class="backup-time">
          <div
            v-for="(item, index) of backupTimes"
            :key="index"
            class="flex-row"
            :class="
              backupTimeIndex === index ? 'list-item-active' : 'list-item'
            "
            @click="clickBackupTime(index)"
          >
            <div class="flex-row list-item-label">
              <div>{{ item.label }}</div>
            </div>

            <div class="top-right-tick">
              <svg-icon
                v-if="backupTimeIndex === index"
                icon="top-right-tick"
                class-name="top-right-tick"
              ></svg-icon>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="备份周期">
        <div class="flex-row">
          <el-radio-group v-model="form.cycle">
            <el-radio label="week" style="width: 100%">按周</el-radio>
            <el-radio label="day" style="width: 100%">按天</el-radio>
          </el-radio-group>

          <div class="flex-row backup-cycle">
            <div
              v-for="(item, index) of backupCycles"
              :key="index"
              class="flex-row"
              :class="
                backupCycleIndex === index ? 'list-item-active' : 'list-item'
              "
              @click="clickBackupCycle(index)"
            >
              <div class="flex-row backup-cycle-label">
                {{ item.label }}
              </div>

              <div class="top-right-tick">
                <svg-icon
                  v-if="backupCycleIndex === index"
                  icon="top-right-tick"
                  class-name="top-right-tick"
                ></svg-icon>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="保留规则">
        <div class="flex-row">
          <el-radio-group v-model="form.rule">
            <el-radio label="number" style="width: 100%">按数量</el-radio>
            <el-radio label="time" style="width: 100%">按时间</el-radio>
            <el-radio label="perpetual" style="width: 100%">永久保留</el-radio>
          </el-radio-group>

          <el-select
            v-model="form.saveTime"
            placeholder="请选择"
            class="custom-width"
            style="margin-top: 32px"
          >
            <el-option
              v-for="(item, idx) of saveTimeList"
              :key="idx"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  type: '1', // 备份策略
  name: '', // 名称
  enable: false, // 是否启用
  time: '', // 备份时间
  cycle: '', // 备份周期
  rule: '', // 保留规则
  saveTime: '' // 保留规则时间
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})

const typeList: any = [{ label: '备份策略', value: '1' }]
const saveTimeList: any = ref([])

// 备份时间
const backupTimes = [
  { label: '00:00' },
  { label: '01:00' },
  { label: '02:00' },
  { label: '03:00' },
  { label: '04:00' },
  { label: '05:00' },
  { label: '06:00' },
  { label: '07:00' },
  { label: '08:00' },
  { label: '09:00' },
  { label: '10:00' },
  { label: '11:00' },
  { label: '12:00' },
  { label: '13:00' },
  { label: '14:00' },
  { label: '15:00' },
  { label: '16:00' },
  { label: '17:00' },
  { label: '18:00' },
  { label: '19:00' },
  { label: '20:00' },
  { label: '21:00' },
  { label: '22:00' },
  { label: '23:00' }
]
// 备份时间索引
const backupTimeIndex = ref(-1)
const clickBackupTime = (index: number) => {
  backupTimeIndex.value = index
  form.time = backupTimes[index].label
}
// 备份周期
const backupCycles = [
  { label: '星期一' },
  { label: '星期二' },
  { label: '星期三' },
  { label: '星期四' },
  { label: '星期五' },
  { label: '星期六' },
  { label: '星期天' }
]
// 备份周期索引
const backupCycleIndex = ref(-1)
const clickBackupCycle = (index: number) => {
  backupCycleIndex.value = index
}
// 监听
watch(
  () => form.cycle,
  value => {
    backupCycleIndex.value = -1
    if (value === 'week') {
      backupCycleIndex.value = 0
    }
  }
)
watch(
  () => form.rule,
  value => {
    if (value) {
      form.saveTime = ''
    }
  }
)
const router = useRouter()
// 点击事件
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  router.back()
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
  })
}
</script>

<style scoped lang="scss">
.create {
  background-color: white;
  padding: $idealPadding;
  :deep(.el-radio) {
    height: 34px;
  }
  .custom-width {
    width: 100%;
  }
  .footer-button {
    justify-content: flex-start;
    align-items: center;
    margin-left: 17px;
  }
  .backup-time {
    width: 40%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }
  .list-item,
  .list-item-active {
    cursor: pointer;
    border: 1px solid white;
    width: auto;
    margin: 2px 5px;
    background-color: $gray1-light;
    border-radius: 4px;
    justify-content: center;
    .list-item-label {
      margin: 0 2px 0 12px;
    }
  }
  .list-item-active {
    border: 1px solid var(--el-color-primary);
  }
  .top-right-tick,
  .top-right-tick-active {
    width: 14px;
    :deep(.svg-icon svg) {
      vertical-align: 0.6em; // 调整勾选中图标顶部边距
    }
  }
  :deep(.top-right-tick) {
    color: var(--el-color-primary);
    width: 14px;
    height: 14px;
  }
  .backup-cycle {
    line-height: 32px;
    height: 32px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    .backup-cycle-label {
      margin: 0 2px 0px 12px;
    }
  }
}
</style>
