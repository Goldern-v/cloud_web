<template>
  <div class="add-tag">
    <div class="flex-row add-tag__tip">
      <svg-icon icon="info-warning" color="var(--el-color-primary)"></svg-icon>
      <span
        class="ideal-default-margin-left">如果您需要使用同一标签标识多种云资源，即所有服务均可在标签输入框下拉选择同一标签，建议在TMS中创建预定义标签。</span
      >
    </div>

    <ideal-table-list
      :table-data="dataList"
      :table-headers="tableHeaders"
      :show-pagination="false">
      <template #tagKey>
        <el-table-column label="键">
          <template #default="props">
            <el-input v-model="props.row.tagKey"/>
          </template>
        </el-table-column>
      </template>

      <template #tagValue>
        <el-table-column label="值">
          <template #default="props">
            <el-input v-model="props.row.tagValue"/>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="150">
          <template #default="props">
            <el-button link @click="clickOperateEvent(props.$index)">
              <svg-icon icon="delete-icon"></svg-icon>
            </el-button>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row add-tag-available">
      <el-button link @click="clickAddTagItem">
        <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
        添加
      </el-button>

      <div>（您还可以添加7个标签）</div>
    </div>

    <div class="flex-row add-tag-button">
      <el-button type="info" @click="cancelForm"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const dataList: any = ref([])
// 行数据操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '删除', prop: 'delete' }
]
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '标签键', prop: 'tagKey', useSlot: true },
  { label: '标签值', prop: 'tagValue', useSlot: true }
]
// 行数据操作
const clickOperateEvent = (index: number) => {
  dataList.value.splice(index, 1)
}
const clickAddTagItem = () => {
  dataList.value.push({ tagKey: '', tagValue: '' })
}
// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.add-tag {
  width: 100%;
  .add-tag__tip {
    background-color: var(--el-color-primary-light-9);
    padding: 20px;
    align-items: flex-start;
  }
  .add-tag-available {
    align-items: center;
    margin-top: 20px;
  }
  .add-tag-button {
    justify-content: flex-end;
    align-items: center;
  }
  // 操作组件修改弹性伸缩方向
  :deep(.ideal-table-operate__container) {
    justify-content: flex-start;
  }
}
</style>