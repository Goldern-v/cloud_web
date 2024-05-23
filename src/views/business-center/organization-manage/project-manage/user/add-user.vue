<template>
  <div class="add-user">
    <ideal-table-list
      :reserve="false"
      :is-multiple="true"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :total="state.total"
      :page="state.page"
      :table-headers="tableHeaders"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
    </ideal-table-list>
    <div class="flex-row ideal-submit-button">
      <el-button @click="clickCancel">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="clickSuccess">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import {
  projectBindUserApi,
  getProjectUnbindUserListApi
} from '@/api/java/business-center'
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

interface AddUserProps {
  rowData?: any
}
const props = withDefaults(defineProps<AddUserProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

// 方法
interface EmitEvents {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvents>()

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '登录名', prop: 'account' },
  { label: '用户名', prop: 'name' },
  { label: '手机号', prop: 'mobile' },
  { label: '邮箱', prop: 'email' }
]
const state: IHooksOptions = reactive({
  dataListUrl: `${getProjectUnbindUserListApi}/${props.rowData?.projectId}/user/unbind`,
  deleteUrl: '/sys/user'
})
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle } =
  useCrud(state)
// 关闭弹框
const clickCancel = () => {
  emit(EventEnum.cancel)
}
// 添加用户
const clickSuccess = async () => {
  let list: any = state.dataListSelections
  console.log(list)

  if (state.dataListSelections?.length === 0) {
    return ElMessage.warning('请选择需要添加的用户')
  } else {
    let users = list.map((item: any) => {
      return {
        id: item.id,
        account: item.account
      }
    })

    const res: any = await projectBindUserApi({
      id: props.rowData?.projectId,
      vdcId: props.rowData?.id,
      vdcCode: props.rowData?.code,
      users
    })
    if (res.code === 200) {
      ElMessage.success('添加成功')
      emit(EventEnum.success)
    } else {
      ElMessage.success('添加失败')
    }
  }
}
</script>

<style scoped lang="scss">
.add-user {
  width: 100%;
}
</style>
