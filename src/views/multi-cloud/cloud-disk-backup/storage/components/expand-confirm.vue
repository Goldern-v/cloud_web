<template>
  <div class="expand-confirm">
    <ideal-table-list
      class="expand-confirm-table"
      :table-data="tableData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #config>
        <el-table-column label="配置">
          <template #default="props">
            <div class="flex-row expand-confirm-item expand-font">
              <div class="expand-confirm-label">存储库名称</div>
              <div class="expand-confirm-content">{{ props.row.name }}</div>
            </div>
            <div class="flex-row expand-confirm-item expand-font">
              <div class="expand-confirm-label">存储库ID</div>
              <div class="expand-confirm-content">
                {{ props.row.uuid }}
              </div>
            </div>
            <div class="flex-row expand-confirm-item expand-font">
              <div class="expand-confirm-label">计费模式</div>
              <div class="expand-confirm-content">
                {{ props.row.billingModeDes }}
              </div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #originSize>
        <el-table-column :label="isExpand ? '扩容前容量':'缩容前容量'" width="150">
          <template #default="props">
            <div class="expand-font">{{ props.row.originSize }}GiB</div>
          </template>
        </el-table-column>
      </template>

      <template #currentSize>
        <el-table-column :label="isExpand ? '扩容后容量':'缩容后容量'" width="150">
          <template #default="props">
            <div class="expand-font">{{ props.row.currentSize }}GiB</div>
          </template>
        </el-table-column>
      </template>
      
      <template #price>
        <el-table-column label="价格" width="150">
          <template #default="props">
            <el-text type="danger">¥{{ props.row.price }}/小时</el-text>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'

interface ExpandFormProps {
  type?: string
}
const props = withDefaults(defineProps<ExpandFormProps>(), {
  type: 'expand' // expand: 扩容 reduce: 缩容
})
const isExpand = computed(() => props.type === 'expand')

const tableData: any = [
  {
    resource: '云硬盘备份存储库',
    name: 'vpn跳板-不要动',
    uuid: '	e916a9f9-9dae-439f-a24a-becdfa7ab9ce',
    billingModeDes: '按需计费',
    originSize: 40,
    currentSize: 61,
    price: 0.0592
  }
]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '资源', prop: 'resource' },
  { label: '配置', prop: 'config', useSlot: true },
  { label: '扩容前容量', prop: 'originSize', useSlot: true },
  { label: '扩容后容量', prop: 'currentSize', useSlot: true },
  { label: '价格', prop: 'price', useSlot: true }
]
</script>

<style scoped lang="scss">
.expand-confirm {
  width: 100%;
  .expand-confirm-table {
    padding: 20px;
  }
  .expand-confirm-item {
    padding: 5px 10px;
    .expand-confirm-label {
      color: #8b8b8b;
      width: 100px;
      text-align: left;
    }
    .expand-confirm-content {
      color: #000000;
      width: calc(100% - 100px);
    }
  }
  .expand-font {
    font-size: $defaultFontSize;
  }
}
</style>
