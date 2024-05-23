<template>
  <div class="create-confirm">
    <ideal-table-list
      class="create-confirm-table"
      :table-data="tableData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #productType>
        <el-table-column label="产品类型">
          <div>云硬盘</div>
        </el-table-column>
      </template>

      <template #productSpec>
        <el-table-column label="产品规格">
          <template #default="props">
            <div class="flex-row">
              <div class="create-confirm-label">区域</div>
              <div class="create-confirm-content">{{ props.row.regionName }}</div>
            </div>
            <div class="flex-row">
              <div class="create-confirm-label">可用区</div>
              <div class="create-confirm-content">
                {{ props.row.availableZone }}
              </div>
            </div>
            <div class="flex-row">
              <div class="create-confirm-label">数据源</div>
              <div class="create-confirm-content">
                {{ props.row.dataOrigin }}
              </div>
            </div>
            <div class="flex-row">
              <div class="create-confirm-label">容量(GiB)</div>
              <div class="create-confirm-content">
                {{ props.row.dataVolumeSize }}
              </div>
            </div>
            <div class="flex-row">
              <div class="create-confirm-label">磁盘类型</div>
              <div class="create-confirm-content">
                {{ props.row.dataVolumeName }}
              </div>
            </div>
            <div class="flex-row">
              <div class="create-confirm-label">磁盘加密</div>
              <div class="create-confirm-content">{{ props.row.isEncrypt? '是':'否' }}</div>
            </div>
            <div class="flex-row">
              <div class="create-confirm-label">磁盘模式</div>
              <div class="create-confirm-content">
                {{ props.row.isSCSI ? 'SCSI':'VBD' }}
              </div>
            </div>
            <div class="flex-row">
              <div class="create-confirm-label">共享盘</div>
              <div class="create-confirm-content">{{ props.row.isShare? '是':'否'  }}</div>
            </div>
            <div class="flex-row">
              <div class="create-confirm-label">磁盘名称</div>
              <div class="create-confirm-content">{{ props.row.ebsName }}</div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #billType>
        <el-table-column label="产品规格">
          <template #default="props">
            <div>{{ props.row.billType === 'PACKAGE' ? '包年包月':'按需' }}</div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'

interface ConfirmProps {
  info?: any
}
const props = withDefaults(defineProps<ConfirmProps>(), {
  info: () => ({})
})
watch(() => props.info, value => {
  if (value) {
    tableData.value = [value]
  }
}, { deep: true })
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = [props.info]
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '产品类型', prop: 'productType', useSlot: true },
  { label: '产品规格', prop: 'productSpec', useSlot: true },
  { label: '计费模式', prop: 'billType', useSlot: true },
  { label: '数量', prop: 'count' }
]
</script>

<style scoped lang="scss">
.create-confirm {
  width: 100%;
  .create-confirm-table {
    padding: 20px;
  }
  .create-confirm-label {
    color: #8b8b8b;
    font-size: $defaultFontSize;
    width: 120px;
    text-align: left;
  }
  .create-confirm-content {
    color: #000000;
    font-size: $defaultFontSize;
  }
}
</style>
