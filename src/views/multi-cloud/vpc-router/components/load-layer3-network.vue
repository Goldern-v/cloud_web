<template>
  <div>
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      is-radio
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @clickTableCellRow="clickTableCellRow"
    >
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { EventEnum, resourceTypeEnum } from '@/utils/enum'

const { t } = useI18n()

const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: ''
})

state.dataList = [
  {
    name: '公有网络三层网络',
    ipv4Cidr: '10.10.2.2/24',
    shareMode: '全局共享',
    createTime: '2024-02-26'
  }
]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: 'IPv4 CIDR', prop: 'ipv4Cidr' },
  { label: '共享模式', prop: 'shareMode' },
  { label: '创建时间', prop: 'createTime' }
]
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

const clickTableCellRow = () => {}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  if (dialogType.value === 'resourcePool') {
  } else {
    getDataList()
  }
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
const submitForm = () => {}
</script>

<style scoped lang="scss"></style>
