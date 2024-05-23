<template>
  <div class="done-detail">
    <div class="done-items">
      <div class="item-label">任务编号</div>
      <div class="item-value">{{ rowData.id }}</div>
    </div>
    <div class="done-items">
      <div class="item-label">任务名称</div>
      <div class="item-value">{{ rowData.name }}</div>
    </div>
    <div class="done-items">
      <div class="item-label">所属流程</div>
      <div class="item-value">{{ rowData.processInstance.name }}</div>
    </div>
    <div class="done-items">
      <div class="item-label">流程发起人</div>
      <div class="item-value">
        {{ rowData.processInstance.startUserNickname }}
      </div>
    </div>
    <div class="done-items">
      <div class="item-label">状态</div>
      <div class="item-value">
        <el-tag v-if="rowData.result == 1">处理中</el-tag>
        <el-tag v-if="rowData.result == 2" type="success">通过</el-tag>
        <el-tag v-if="rowData.result == 3" type="danger">不通过</el-tag>
        <el-tag v-if="rowData.result == 4" type="info">取消</el-tag>
      </div>
    </div>
    <div class="done-items">
      <div class="item-label">原因</div>
      <div class="item-value">{{ rowData.reason }}</div>
    </div>
    <div class="done-items">
      <div class="item-label">创建时间</div>
      <div class="item-value">
        {{ dateFormat(rowData.cteateTime, FormatsEnums.YMDHIS) }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { dateFormat, FormatsEnums } from '@/utils/time-format'
interface DialogProps {
  rowData?: any // 行数据
}

const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})
</script>
<style lang="scss" scoped>
.done-detail {
  width: 100%;
  .done-items {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 40px;
    border: 1px solid #ebeef5;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 40px;
    border-bottom: 0px;
    &:last-of-type {
      border: 1px solid #ebeef5;
    }
    .item-label {
      height: 100%;
      background-color: #f5f7fa;
      font-weight: 600;
      text-align: left;
      padding-left: 10px;
      border-right: 1px solid #ebeef5;
      width: 40%;
    }
    .item-value {
      height: 100%;
      padding-left: 5px;
      flex: 1;
    }
  }
}
</style>
