<template>
  <div class="copy">
    <div class="flex-row tip">
      <svg-icon icon="info-warning" class-name="info-warning" class="ideal-svg-margin-right"/>
      <div>从复制源复制配置信息的操作为增量复制，不会删除当前桶已存在的配置信息，与已存在的配置信息冲突的规则不会复制。</div>
    </div>

    <div class="flex-row ideal-middle-margin-top" style="align-items: center;">
      <div class="ideal-default-margin-right">选择复制源</div>
      <el-select
        v-model="copyOrigin"
        placeholder="请选择"
      >
        <el-option
          v-for="(item, index) of copyOrigins"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <svg-icon icon="refresh-icon" class="ideal-svg-margin-left"/>
    </div>

    <div class="ideal-middle-margin-top">将以下0条配置信息复制到11123</div>
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :show-pagination="false"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #operation>
        <el-table-column label="操作" width="125" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { EventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'

const { t } = useI18n()

const copyOrigin = ref('')
const copyOrigins = ref<any[]>([])

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '键', prop: 'key' },
  { label: '条件运算符', prop: 'operator' },
  { label: '值', prop: 'value' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  // { title: '分享', prop: 'share' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {}
// 方法
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
.copy {
  width: 100%;
  .tip {
    align-items: center;
    background-color: var(--el-color-primary-light-9);
    border: var(--el-color-primary);
    padding: 10px;
  }
  :deep(.info-warning) {
    color: var(--el-color-primary);
  }
}
</style>
