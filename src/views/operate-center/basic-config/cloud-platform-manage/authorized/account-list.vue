<template>
  <div class="account-list">
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #operation>
        <el-table-column label="操作" width="125">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event as any, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import {
  OperateEventEnum
} from '@/utils/enum'
import {
  cloudPlatformAuthBindUrl,
  cloudPlatformAuthUnbindAccountUrl
} from '@/api/java/operate-center'

interface AccountListProps {
  authAccountId?: string // 授权账户id
}
const props = withDefaults(defineProps<AccountListProps>(), {
  authAccountId: ''
})

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: cloudPlatformAuthBindUrl,
  deleteUrl: cloudPlatformAuthUnbindAccountUrl,
  isPage: false,
  queryForm: {
    authAccountId: props.authAccountId
  }
})

const {
  deleteHandle,
  getDataList
} = useCrud(state)

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '云管用户', prop: 'name' },
  { label: '用户id', prop: 'userId' },
  { label: '绑定时间', prop: 'createTime.date' }
]

const operateBtns = ref<IdealTableColumnOperate[]>([
  { title: '解绑云管用户', prop: 'unbind' }
])
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'unbind') {
    deleteHandle(row.id, '/', '确定要解绑当前云管用户？', '解绑云管用户', '', '解绑成功')
  }
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()

const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}


</script>

<style scoped lang="scss">
.account-list {
  padding: 0 $idealPadding;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
  :deep(.el-button) {
    height: 34px;
  }
  :deep(.el-select .el-input) {
    width: 200px;
    height: 34px;
  }
  .account-list__button {
    justify-content: space-between;
    align-items: center;
  }
  .custom-select {
    width: 200px;
  }
  .custom-color {
    color: var(--el-color-primary);
  }
  .account-list__table-name {
    cursor: pointer;
  }
}
</style>
