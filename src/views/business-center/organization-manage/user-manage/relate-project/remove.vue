<template>
  <div>
    <div>确定要取消当前项目与用户的关联关系吗</div>
    <ideal-table-list
      :table-data="removeProject"
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
import { userRemoveProject } from '@/api/java/business-center'
import { ElMessage } from 'element-plus'

interface RoleProps {
  removeProject?: any[] //待移除的角色
}

const props = withDefaults(defineProps<RoleProps>(), {
  removeProject: () => []
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
  showLoading('项目移除中...')
  const detailInfo = JSON.parse(route.query.detail as any)
  const userId = detailInfo.id
  const projectIds = props.removeProject?.map((item: any) => item.id)
  userRemoveProject(userId, projectIds)
    .then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        ElMessage.success('项目移除成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('项目移除失败')
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss"></style>
