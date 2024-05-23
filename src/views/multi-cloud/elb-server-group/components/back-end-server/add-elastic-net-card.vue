<template>
  <div class="add-server">
    <svg-icon
      icon="info-warning"
      color="var(--el-color-primary)"
      class="ideal-default-margin-right"
    ></svg-icon>
    <span
      >您最多可以添加500个辅助弹性网卡，如需中请更多配额请点击<el-text
        type="primary"
        >申请扩大配额</el-text
      ></span
    >
    <el-input placeholder="默认按照关键字搜索过滤" class="ideal-large-margin-top">
      <template #suffix>
        <svg-icon icon="search-icon"></svg-icon>
      </template>
    </el-input>

    <ideal-table-list
      ref="multipleTableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      is-multiple
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #elasticNetCard>
        <el-table-column label="所属弹性网卡">
          <template #default="props">
            <el-text type="primary">{{ props.row.ipAddress }}</el-text>
            <p>按市场是</p>
          </template>
        </el-table-column>
      </template>

      <template #subnet>
        <el-table-column label="子网">
          <template #default="props">
            <el-text type="primary">{{ props.row.subnet }}</el-text>
          </template>
        </el-table-column>
      </template>
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
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { useCrud } from '@/hooks'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
/**
 * 云服务器列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
state.dataList = [
  {
    name: 'VPN跳板不要动',
    uuid: 'wdw7-3e7x-2sxs-29sy',
    cpu: '2',
    memory: '4',
    specification: 'c7.large.2',
    privateIp: '192.168.0.211',
    subnet: 'subnet-fahu',
    ipAddress: '192.168.0.171'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '私有IP地址', prop: 'privateIp' },
  { label: '所属弹性网卡', prop: 'elasticNetCard', useSlot: true },
  { label: '子网', prop: 'subnet' }
]
const { sizeChangeHandle, currentChangeHandle, selectionChangeHandle } =
  useCrud(state)

const multipleTableRef = ref()

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

<style scoped lang="scss"></style>
