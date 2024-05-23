<template>
  <div class="replace">
    <div class="flex-row ideal-default-margin-top" style="justify-content: flex-end;align-items: center;">
      <el-input style="width: 20%;">
        <template #suffix>
          <svg-icon icon="search-icon"/>
        </template>
      </el-input>

      <svg-icon icon="refresh-icon" class="ideal-svg-margin-left"/>
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :is-radio="true"
      :show-pagination="false">
    </ideal-table-list>

    <div class="flex-row footer-button ideal-default-margin-top">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '规格', prop: 'spec' },
  { label: '镜像', prop: 'mirror' },
  { label: '系统盘', prop: 'systemDisk' },
  { label: '数据盘', prop: 'dataDisk' },
  { label: '登录方式', prop: 'loginMode' },
  { label: '创建时间', prop: 'createTime' },
  { label: '云服务器组', prop: 'hostGroup' }
]

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
.replace {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
