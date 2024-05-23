<template>
  <div class="bind-role">
    <ideal-table-list
      ref="tableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :is-multiple="true"
      :total="state.total"
      :page="state.page"
      :pagination-type="PaginationTypeEnum.totalJump"
      max-height="250"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm()">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm()">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { PaginationTypeEnum, EventEnum } from '@/utils/enum'
import { userRelateRole, roleBindPageUrl } from '@/api/java/business-center'

interface BindProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<BindProps>(), {
  rowData: null
})

const { t } = useI18n()

const tableRef = ref()
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: roleBindPageUrl,
  queryForm: {
    id: props.rowData.id
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
watch(() => state.dataList, value => {
  if (value?.length) {
    value.forEach((item: any) => {
      tableRef.value.IdealTableList.toggleRowSelection(item, item.bindOrNot)
    })
  }
})
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '角色名称', prop: 'name' },
  { label: '角色描述', prop: 'description' }
]
// 方法
interface EmitEvent {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvent>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}
// 表单提交
const submitForm = () => {
  const array: any[] = []
  state.dataListSelections?.forEach((item: any) => array.push(item.id))
  userRelateRole(props.rowData.id, array).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('绑定成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('绑定失败')
    }
  })
}
</script>

<style scoped lang="scss">
.bind-role {
  background-color: white;
}
</style>
