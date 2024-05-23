<template>
  <div class="upgrade">
    <div class="flex-row upgrade-tip">
      <svg-icon icon="info-warning" color="#FA9550" class="ideal-svg-margin-right"></svg-icon>
      <span
        >升级密钥对后，您选择的密钥对将会升级为账号密钥对，本账号下所有用户均能查看或使用该密钥对。密钥对名称如果与其他子用户私有密钥对重名，将无法升级。当前升级密钥对时，至少需要具有Tenant Administrator角色的用户执行一次升级，升级个数不限。</span
      >
    </div>

    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      prefix-title="密钥对名称查询"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      :is-multiple="true"
    />
    
    <div class="flex-row footer-button">
      <el-button @click="cancelForm"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum } from '@/utils/enum'
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  getDataList
} = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '状态', prop: 'status' },
  { label: '操作系统', prop: 'fingerprint' },
  
  { label: '私钥', prop: 'privateKey' }
]
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
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
.upgrade {
  width: 100%;
  .upgrade-tip {
    background-color: $warning1-light;
    padding: 10px;
    margin-bottom: 10px;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    padding-right: 17px;
    margin-top: 10px;
  }
}
</style>