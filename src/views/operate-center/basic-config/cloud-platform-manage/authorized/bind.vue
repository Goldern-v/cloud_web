<template>
  <div class="account-list">
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      is-radio
      :show-pagination="false"
      :max-height="280"
      @clickTableCellRow="clickTableCellRow"
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
import { ElMessage } from 'element-plus/es'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum } from '@/utils/enum'
import store from '@/store'
import type { IdealTableColumnHeaders } from '@/types'
import {
  cloudPlatformAuthUnbindUrl,
  cloudPlatformAuthBindAccount
} from '@/api/java/operate-center'

interface BindProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<BindProps>(), {
  rowData: null
})

const { t } = useI18n()

const route = useRoute()
const cloudPlatformId = route.query.id as string

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: cloudPlatformAuthUnbindUrl,
  isPage: false,
  queryForm: {
    cloudPlatformId
  }
})

useCrud(state)
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '用户名称', prop: 'name' },
  { label: 'id', prop: 'id' }
]
const rowData = ref()
const clickTableCellRow = (row: any) => {
  rowData.value = row
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
const submitForm = () => {
  if (!rowData.value) { return ElMessage.warning('请选择云管用户') }
  const params = {
    authAccountId: props.rowData?.id, // 授权账户id
    userId: rowData.value?.id, // 云管用户id
    vdcId: store.userStore.user.vdcId,
    cloudPlatformId, // 云平台id
  }
  cloudPlatformAuthBindAccount(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('云管用户绑定成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('云管用户绑定失败')
    }
  })
}

</script>

<style scoped lang="scss">
.account-list {
  background-color: white;
}
</style>
