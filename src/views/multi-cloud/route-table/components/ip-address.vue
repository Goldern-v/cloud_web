<template>
  <div class="ip-address">
    <div>目的地址<span style="margin-left: 20px">Local</span></div>
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
    </ideal-table-list>

    <div class="btn ideal-large-margin-top">
      <el-button @click="handleClose">关闭</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})

const state: IHooksOptions = reactive({
  deleteUrl: '',
  queryForm: {
    // vdcId: store.userStore.user.vdcId
  }
})

watch(
  () => props.rowData,
  val => {
    if (val?.defaultRouteList) {
      state.dataList = val?.defaultRouteList
      state.total = val?.defaultRouteList.length
    }
  },
  { immediate: true }
)

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '目的地址', prop: 'destination' },
  { label: '下一跳类型', prop: 'nextHopType' },
  { label: '下一跳', prop: 'nextHop' },
  { label: '类型', prop: 'type' }
]
// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
}
const emit = defineEmits<EventEmits>()
const handleClose = () => {
  emit(EventEnum.cancel)
}
</script>

<style scoped lang="scss">
.btn {
  text-align: center;
}
</style>
