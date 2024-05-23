<template>
  <div class="info-approve-log">
    <div
      v-for="log in approveLogList"
      :key="log.id"
      class="log-list"
      :class="['list-type' + log.result]"
    >
      <div class="log-step">
        <div class="step-do"></div>
      </div>
      <div class="log-title">任务：{{ log.name }}</div>
      <div class="log-detail">
        <div class="log-conetent-user">
          <div class="approve-user">
            <span class="item-label">
              审批人:
              <el-tag>{{ log.assigneeUser.username || '--' }}</el-tag>
            </span>
            <span class="item.value"></span>
          </div>
          <div class="approve-time">
            <span class="item-label"> 创建时间： </span>
            <span class="item.value">{{
              dateFormat(log.createTime, FormatsEnums.YMDHIS)
            }}</span>
          </div>
        </div>
        <div
          v-if="log.result === 2 || log.result === 3"
          class="log-conetent-time"
        >
          <div class="approve-user">
            <span class="item-label"> 审批时间： </span>
            <span class="item.value">{{
              dateFormat(log.endTime, FormatsEnums.YMDHIS)
            }}</span>
          </div>
          <div class="approve-time">
            <span class="item-label"> 耗时： </span>
            <span class="item.value">{{
              formatDuring(log.durationInMillis)
            }}</span>
          </div>
        </div>
        <div v-if="log.reason" class="log-reason">
          <el-tag v-if="log.result === 1">{{ log.reason }}</el-tag>
          <el-tag v-if="log.result === 2" type="danger">{{
            log.reason
          }}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dateFormat, FormatsEnums, formatDuring } from '@/utils/time-format'
import { EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  approveLogList?: any // 行数据
}

const props = withDefaults(defineProps<DialogProps>(), {
  approveLogList: []
})

interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

onMounted(() => {})
</script>

<style lang="scss" scoped>
.info-approve-log {
  padding: 30px 30px 30px 40px;
  box-sizing: border-box;
  .log-list {
    margin-bottom: 15px;
    padding-left: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    border-left: 1px solid #eee;
    position: relative;
    top: 0;
    left: 0;
    .log-step {
      position: absolute;
      left: -10px;
      top: -5px;
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      align-items: center;
      width: 20px;
      height: 20px;
      background-color: #fff;
      .step-do {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: var(--el-color-primary);
      }
    }
    &.list-type2 {
      .step-do {
        background-color: var(--el-color-success);
      }
    }

    .log-title {
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 15px;
    }
    .log-detail {
      border: 1px solid #eee;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
      padding: 10px;
      box-sizing: border-box;
      border-radius: 4px;
    }
    .log-conetent-user,
    .log-conetent-time {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .approve-user {
        margin-right: 20px;
      }
    }
    .log-conetent-time {
      margin-top: 10px;
    }
    .log-reason {
      margin-top: 15px;
    }
  }
}
</style>
cmpCloudDiskSnapsList
