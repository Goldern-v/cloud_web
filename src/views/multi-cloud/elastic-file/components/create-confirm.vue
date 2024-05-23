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
          <template #default="props">
            <div>{{ props.row.typeStr }}</div>
          </template>
        </el-table-column>
      </template>
      <template #config>
        <el-table-column label="配置">
          <template #default="props">
            <template v-if="props.row.type === 'fileSystem'">
              <div class="flex-row">
                <div class="create-confirm-label">区域</div>
                <div class="create-confirm-content">{{ props.row.regionName }}</div>
              </div>

              <div class="flex-row">
                <div class="create-confirm-label">名称</div>
                <div class="create-confirm-content">{{ props.row.name }}</div>
              </div>

              <div class="flex-row">
                <div class="create-confirm-label">规格</div>
                <div class="create-confirm-content">
                  {{ props.row.storageClassItem.title }}
                </div>
              </div>

              <div class="flex-row">
                <div class="create-confirm-label">容量(GiB)</div>
                <div class="create-confirm-content">
                  {{ props.row.size }}
                </div>
              </div>

              <div class="flex-row">
                <div class="create-confirm-label">加密</div>
                <div class="create-confirm-content">
                  {{ props.row.encrypt ? '是':'否' }}
                </div>
              </div>
              
              <div class="flex-row">
                <div class="create-confirm-label">协议类型</div>
                <div class="create-confirm-content">
                  {{ props.row.protocolType }}
                </div>
              </div>
            </template>

            <template v-else>
              <div class="flex-row">
                <div class="create-confirm-label">可用区</div>
                <div class="create-confirm-content">{{ props.row.availableZone }}</div>
              </div>

              <div class="flex-row">
                <div class="create-confirm-label">虚拟私有云</div>
                <div class="create-confirm-content">
                  {{ props.row.vpc }}
                </div>
              </div>

              <div class="flex-row">
                <div class="create-confirm-label">子网</div>
                <div class="create-confirm-content">{{ props.row.subnet }}</div>
              </div>
              
              <div class="flex-row">
                <div class="create-confirm-label">安全组</div>
                <div class="create-confirm-content">{{ props.row.safeGroup }}</div>
              </div>
            </template>
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
    tableData.value = [{
      type: 'fileSystem', typeStr: '文件系统', count: '1', ...value
    }, {
      type: 'network', typeStr: '网络', count: '--', ...value
    }]
  }
}, { deep: true })
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = [{
    type: '文件系统', count: '1', ...props.info
  }, {
    type: '网络', count: '--', ...props.info
  }]
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '产品类型', prop: 'productType', useSlot: true },
  { label: '配置', prop: 'config', useSlot: true },
  { label: '数量', prop: 'count' }
]
</script>

<style scoped lang="scss">
.create-confirm {
  box-sizing: border-box;
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
