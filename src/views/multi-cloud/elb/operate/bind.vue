<template>
  <div class="lbs-container">
    <p style="color: var(--el-color-primary)" @click="toEip">
      查看弹性公网IP地址
    </p>
    <el-input v-model="filterText" placeholder="请输入内容" class="ideal-large-margin-top">
      <template #suffix>
        <svg-icon icon="search-icon"></svg-icon>
      </template>
    </el-input>
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-radio="true"
      :show-pagination="false"
      @clickTableCellRow="clickTableCellRow"
    >
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelBtn">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitBtn">{{
        t('confirm')
      }}</el-button>
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
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle } =
  useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP', prop: 'ipAddress' },
  { label: '状态', prop: 'statusText' },
  { label: '类型', prop: 'type' },
  { label: '带宽名称', prop: 'bandwidthName' },
  { label: '带宽(Mbit/s)', prop: 'size' }
]

state.dataList = [
  {
    ipAddress: '1.94.45.229',
    statusText: '未绑定',
    bandwidthName: 'bandwidth-8dba',
    type: '全动态BGP',
    size: 5
  }
]
const router = useRouter()
const toEip = () => {
  router.push({
    path: '/multi-cloud/elastic-ip/list'
  })
}

const clickTableCellRow = (row: any) => {
  console.log(row, '----------')
}

const filterText = ref('')

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
.lbs-container {
  width: 100%;
}
</style>
