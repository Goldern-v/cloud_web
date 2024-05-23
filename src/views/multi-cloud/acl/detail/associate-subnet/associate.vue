<template>
  <div class="associated-subnet">
    <div v-if="showTip" class="flex-row associated-subnet-tip">
      <div class="flex-row">
        <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-svg-margin-right" />
        <div>关联子网后，网络ACL默认拒绝所有出入子网的流量，直至添加放通规则。</div>
      </div>

      <svg-icon icon="close-icon" @click="clickCloseTip"/>
    </div>

    <div :class="showTip ? 'ideal-default-margin-top' : ''">网络ACL：dfer</div>

    <div class="flex-row" style="justify-content: flex-end;">
      <ideal-select-search
        :options="searchOptions"
        :show-suffix-search="true"
        :show-search-btn="false"
        :show-reset-btn="false"
        :slot-array="['refreshBtn']"
        @clickSearch="clickSearch"
      >
        <template #refreshBtn>
          <el-button>
            <svg-icon icon="refresh-icon" @click="clickReset"/>
          </el-button>
        </template>
      </ideal-select-search>
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :is-radio="true"
      :show-pagination="false"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelBtn">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitBtn">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '子网', prop: 'subnet' },
  { label: 'IPv4网段', prop: 'ipv4' },
  { label: 'IPv6网段', prop: 'ipv6' },
  { label: '虚拟私有云', prop: 'vpc' }
]
const showTip = ref(true)
const clickCloseTip = () => {
  showTip.value = false
}
const searchOptions = [
  { prop: 'name', label: '名称' },
  { prop: 'uuid', label: 'ID' }
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

const cancelBtn = () => {
  emit(EventEnum.cancel)
}

const submitBtn = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.associated-subnet {
  width: 100%;
  .associated-subnet-tip {
    justify-content: space-between;
    background-color: var(--el-color-primary-light-9);
    padding: 10px;
  }
}
</style>
