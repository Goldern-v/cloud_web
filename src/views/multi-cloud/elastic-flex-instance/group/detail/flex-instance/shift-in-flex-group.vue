<template>
  <div class="shift-in">
    <div class="flex-row shift-in-tip">
      <svg-icon
        icon="info-warning"
        class="ideal-svg-margin-right"
        class-name="shift-in-warning"
      />
      <div>
        <div>·单次最大添加实例数为10。</div>
        <div>
          ·您只能选择与伸缩组VPC相同、AZ包含于伸缩组AZ、且未被其他伸缩组使用的实例。
        </div>
      </div>
    </div>

    <div class="flex-row ideal-default-margin-top" style="justify-content: space-between">
      <div class="shift-in-box">
        <div
          class="flex-row shift-in-box-header"
        >
          <div>待选实例</div>
          <div class="flex-row" style="align-items: center">
            <el-input>
              <template #suffix>
                <svg-icon icon="search-icon" />
              </template>
            </el-input>

            <svg-icon icon="refresh-icon" class="ideal-svg-margin-left" />
          </div>
        </div>

        <ideal-table-list
          :loading="state.dataListLoading"
          :table-data="state.dataList"
          :table-headers="tableHeaders"
          :is-multiple="true"
          :show-pagination="false"
          @handleSelectionChange="selectionChangeHandle"
        >
        </ideal-table-list>
      </div>

      <div class="shift-in-box">
        <div class="flex-row shift-in-box-header">
          <div>已选实例</div>
        </div>

        <ideal-table-list
          :table-data="state.dataListSelections"
          :table-headers="tableHeaders"
          :is-multiple="true"
          :show-pagination="false"
          @handleSelectionChange="selectionChangeHandle"
        >
          <template #operation>
            <el-table-column
              label="操作"
              width="105"
              fixed="right"
            >
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
      </div>
    </div>

    <div class="flex-row footer-button ideal-default-margin-top">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum } from '@/utils/enum'
import { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'

const { t } = useI18n()
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { selectionChangeHandle, getDataList } = useCrud(state)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'id' },
  { label: '可用区', prop: 'availableZone' }
]
// 已选实例操作
const operateBtns: IdealTableColumnOperate[] = [
  // { title: '查看伸缩策略', prop: 'check' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {}
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
.shift-in {
  width: 100%;
  .shift-in-tip {
    :deep(.shift-in-warning) {
      color: var(--el-color-primary);
    }
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary);
    border-radius: $circleRadiusSize;
    padding: $idealPadding;
  }
  .shift-in-box {
    border-radius: $circleRadiusSize;
    border: 1px solid $gray1-light;
    width: calc(50% - 30px);
    padding: 10px;
    .shift-in-box-header {
      justify-content: space-between;
      align-items: center;
      height: 34px;
    }
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
