<template>
  <div class="unbind">
    <div class="flex-row">
      <svg-icon icon="info-warning" class-name="warning-icon" class="ideal-svg-margin-right"></svg-icon>
      <div>确定要解绑该弹性公网IP？</div>
    </div>

    <ideal-table-list
      :table-data="tableArray"
      :table-headers="tableHeaders"
      :show-pagination="false">
      <template #eip>
        <el-table-column label="弹性公网IP">
          <template #default=props>
            <div>{{ props.row.ipAddress }}</div>
            <div class="ideal-tip-text">{{ props.row.eipName }}</div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="ideal-default-margin-top">未绑定主机的弹性公网IP会继续计费，若不再适用可以选择释放。</div>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { isEmpty, isUnDef } from '@/utils/is'
import { eipUnbindInstance } from '@/api/java/network'

interface UnbindProps {
  rowData?: any // 行数据
  detail?: any
}
const props = withDefaults(defineProps<UnbindProps>(), {
  rowData: null,
  detail: () => ({})
})

const { t } = useI18n()
const route = useRoute()

const tableArray = ref<any[]>([])
onMounted(() => {
  if (!isEmpty(props.rowData) && !isUnDef(props.rowData)) {
    tableArray.value = [props.rowData]
  }
})

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP', prop: 'eip', useSlot: true },
  { label: '带宽大小', prop: 'bandwidthSize' },
  { label: '带宽名称', prop: 'bandwidthName' },
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

const submitForm = () => {
  const params = {
    uuid: props.rowData.eipUuid, // 弹性ip的uuid
    resourcePoolId: props.detail.pool.id, // 资源池id
    regionId: props.detail.regionId, // 区域code
    projectId: props.detail.project.id,// 云管项目id
    vdcId: props.detail.vdc.id, // 云管vdcId
  }
  eipUnbindInstance(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('解绑成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('解绑失败')
    }
  })
}
</script>

<style scoped lang="scss">
.unbind {
  width: 100%;
  :deep(.warning-icon) {
    color: $warningColor;
  }
}
</style>
