<template>
  <div class="accept-mirror">
    <div class="flex-row accept-mirror-header" :class="{'accept-mirror-header-bottom': showTable}">
      <div class="flex-row" @click="expandTable">
        <svg-icon :icon="arrowIcon" class="ideal-svg-margin-right"/>
        <div>是否接受其他租户给您发起的{{ dataArray.length }}个共享镜像？</div>
      </div>

      <div class="flex-row">
        <el-button link type="primary">全部接受</el-button>
        <svg-icon icon="refresh-icon" class="ideal-svg-margin-left" style="cursor: pointer;" @click="clickRefresh"/>
      </div>
    </div>

    <div v-if="showTable" class="accept-mirror-table">
      <ideal-button-events
        :left-btns="leftButtons"
        @clickLeftEvent="clickLeftEvent"
      />

      <ideal-table-list
        :table-data="dataArray"
        :table-headers="tableHeaders"
        :show-pagination="false"
        :is-radio="true"
        @clickTableCellRow="clickTableCellRow">
        <template #osType>
          <el-table-column label="操作系统类型" show-overflow-tooltip width="120">
            <template #default="props">
              <div class="flex-row">
                <svg-icon
                  v-if="props.row.systemType"
                  :icon="props.row.systemType"
                  class="ideal-svg-margin-right"
                />
                <div>{{ props.row.osType }}</div>
              </div>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { IdealTableColumnHeaders, IdealButtonEventProp } from '@/types'
import { mirrorShareOperation } from '@/api/java/compute'

interface AcceptMirrorProps {
  dataArray?: any[]
}
withDefaults(defineProps<AcceptMirrorProps>(), {
  dataArray: () => []
})

const showTable = ref(false)
const arrowIcon = ref('down-arrow')
const expandTable = () => {
  showTable.value = !showTable.value
  if (!showTable.value) {
    arrowIcon.value = 'down-arrow'
  } else {
    arrowIcon.value = 'up-arrow'
  }
}
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '镜像ID', prop: 'uuid' },
  { label: '操作系统类型', prop: 'osType', useSlot: true },
  { label: '操作系统', prop: 'osVersion' },
  { label: '磁盘容量(GiB)', prop: 'size' }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '接受', prop: 'accept', disabled: true, disabledText: '请选择镜像' },
  { title: '拒绝', prop: 'refuse', disabled: true, disabledText: '请选择镜像' }
])
const clickLeftEvent = (value: string | number | object) => {
  // 接受 ACCEPTED, 拒绝 REJECTED
  if (value === 'accept') {
    clickOperation()
  } else if (value === 'refuse') {
    clickOperation('REJECTED')
  }
}
const clickOperation = (type: string = 'ACCEPTED') => {
  const params = {
    id: currentRow.value.id,
    projectId: currentRow.value.relation.projectId,
    shareStatus: type
  }
  mirrorShareOperation(params).then((res: any) => {
    const { code } = res
    const tip = type === 'ACCEPTED' ? '接受' : '拒绝'
    if (code === 200) {
      ElMessage.success(`${tip}成功`)
      emit('clickRefresh')
    } else {
      ElMessage.error(`${tip}失败`)
    }
  })
}
// 选择
const currentRow = ref<any>()
const clickTableCellRow = (row: any) => {
  currentRow.value = row
  handleLeftButton()
}
const handleLeftButton = () => {
  leftButtons.value.forEach((item: any) => {
    item.disabled = true
  })
  if (currentRow.value) {
    leftButtons.value.forEach((item: any) => {
      item.disabled = false
    })
  }
}
const clickRefresh = () => {
  emit('clickRefresh')
}
// 方法
interface EventEmits {
  (e: 'clickRefresh'): void
}
const emit = defineEmits<EventEmits>()
</script>

<style scoped lang="scss">
.accept-mirror {
  width: 100%;
  border: 1px solid var(--el-color-primary);
  .accept-mirror-header {
    background-color: var(--el-color-primary-light-9);
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }
  .accept-mirror-header-bottom {
    border-bottom: 1px solid var(--el-color-primary);
  }
  .accept-mirror-table {
    padding: $idealPadding;
  }
}
</style>
