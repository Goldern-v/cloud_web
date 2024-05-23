<template>
  <div>
    <div>确定要取消当前角色与用户的关联关系吗</div>
    <ideal-table-list
      :table-data="removeRole"
      :table-headers="tableHeaders"
      :show-pagination="false"
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
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { userRemoveRole } from '@/api/java/business-center'
import { ElMessage } from 'element-plus'

interface RoleProps {
  removeRole?: any[] //待移除的角色
}

const props = withDefaults(defineProps<RoleProps>(), {
  removeRole: () => []
})

const { t } = useI18n()
import type { IdealTableColumnHeaders } from '@/types'
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '角色', prop: 'name' },
  { label: '描述', prop: 'remark' }
]

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const route = useRoute()
const submitForm = () => {
  showLoading('角色移除中...')
  const detailInfo = JSON.parse(route.query.detail as any)
  const userId = detailInfo.id
  const roleIdList = props.removeRole?.map((item: any) => item.id)
  userRemoveRole(userId, roleIdList)
    .then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        ElMessage.success('角色移除成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('角色移除失败')
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss"></style>
