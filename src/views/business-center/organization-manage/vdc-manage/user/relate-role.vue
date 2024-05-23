<template>
  <div class="relate-role">
    <ideal-table-list
      ref="tableRef"
      :is-multiple="true"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
    </ideal-table-list>
    <div class="flex-row button-footer">
      <el-button @click="clickCancel">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="clickSuccess">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
import { showLoading, hideLoading } from '@/utils/tool'
import { userRelateRole, roleBindPageUrl } from '@/api/java/business-center'

interface RoleProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<RoleProps>(), {
  rowData: null
})

const { t } = useI18n()
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '角色', prop: 'name' },
  { label: '描述', prop: 'remark' }
]
const state: IHooksOptions = reactive({
  dataListUrl: roleBindPageUrl,
  deleteUrl: '',
  queryForm: {
    id: props.rowData?.id
  }
})
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle } =
  useCrud(state)

const tableRef = ref()
watch(
  () => state.dataList,
  value => {
    value?.forEach((item: any) => {
      tableRef.value.IdealTableList.toggleRowSelection(item, item.bindOrNot)
    })
  }
)
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
// 关闭弹框
const clickCancel = () => {
  emit(EventEnum.cancel)
}
// 成功修改
const clickSuccess = () => {
  showLoading('角色关联中...')
  const userId = props.rowData?.id
  const roleIdList = state.dataListSelections?.map((item: any) => item.id)

  userRelateRole(userId, roleIdList)
    .then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        ElMessage.success('关联角色成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('关联角色失败')
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.relate-role {
  width: 100%;
  .button-footer {
    justify-content: flex-end;
    align-items: end;
    height: 56px;
  }
}
</style>
