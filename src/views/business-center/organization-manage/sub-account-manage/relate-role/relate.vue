<template>
  <div>
    <ideal-table-list
      ref="tableRef"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      is-multiple
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage } from 'element-plus'
import { useCrud } from '@/hooks'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { userRelateRole, roleBindPageUrl } from '@/api/java/business-center'

interface RoleProps {
  associatedRole?: any[] //已关联的角色
}

const props = withDefaults(defineProps<RoleProps>(), {
  associatedRole: () => []
})
const { t } = useI18n()

const route = useRoute()
const detailInfo = JSON.parse(route.query.detail as any)
const state: IHooksOptions = reactive({
  dataListUrl: roleBindPageUrl,
  deleteUrl: '',
  queryForm: {
    id: detailInfo?.id
  },
  dataListSelections: []
})

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  query
} = useCrud(state)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '角色', prop: 'name' },
  { label: '描述', prop: 'remark' }
]
const tableRef = ref()
watch(
  () => state.dataList,
  arr => {
    arr?.forEach((item: any) => {
      tableRef.value.IdealTableList.toggleRowSelection(item, item.bindOrNot)
    })
  }
)
// 方法
interface EmitEvent {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvent>()
const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  showLoading('角色关联中...')
  const detailInfo = JSON.parse(route.query.detail as any)
  const userId = detailInfo.id
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

<style scoped lang="scss"></style>
