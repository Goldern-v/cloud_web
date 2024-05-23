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
            <div class="flex-row expand-confirm-item">
              <div class="expand-confirm-label">磁盘名称</div>
              <div class="expand-confirm-content">{{ props.row.name }}</div>
            </div>
            <div class="flex-row expand-confirm-item">
              <div class="expand-confirm-label">磁盘ID</div>
              <div class="expand-confirm-content">
                {{ props.row.uuid }}
              </div>
            </div>
            <div class="flex-row expand-confirm-item">
              <div class="expand-confirm-label">计费模式</div>
              <div class="expand-confirm-content">
                {{ props.row.billType === 'PACKAGE' ? '包年包月' : '按需' }}
              </div>
            </div>
            <div class="flex-row expand-confirm-item">
              <div class="expand-confirm-label">磁盘类型</div>
              <div class="expand-confirm-content">
                {{ props.row.volumeTypeName }}
              </div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #size>
        <el-table-column label="扩容前容量" width="150">
          <template #default="props">
            <div>{{ props.row.size }}GiB</div>
          </template>
        </el-table-column>
      </template>

      <template #targetSize>
        <el-table-column label="扩容后容量" width="150">
          <template #default="props">
            <div>{{ props.row.targetSize }}GiB</div>
          </template>
        </el-table-column>
      </template>

      <template #price>
        <el-table-column label="价格" width="150">
          <template #default="props">
            <el-text type="danger">¥{{ props.row.price }}<el-text v-if="props.row.billType === 'ON_DEMAND'" type="danger">/小时</el-text></el-text>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import store from '@/store'

interface ExpandProps {
  basicData?: any
}
const props = withDefaults(defineProps<ExpandProps>(), {
  basicData: () => ({})
})

const route = useRoute()
const detail = JSON.parse(route.query.data as any)

const tableData = ref<any[]>([])
onMounted(() => {
  if (detail) {
    tableData.value = [detail]
    tableData.value.forEach((item: any) => {
      item.resource = '磁盘'
      item.price = store.commonStore.price
    })
  }
})
watch(() => props.basicData.targetSize, value => {
  if (value) {
    tableData.value.forEach((item: any) => {
      item.targetSize = value
    })
  }
})
watch(() => store.commonStore.price, value => {
  if (value) {
    tableData.value.forEach((item: any) => {
      item.price = value
    })
  }
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '资源', prop: 'resource' },
  { label: '配置', prop: 'config', useSlot: true },
  { label: '扩容前容量', prop: 'size', useSlot: true },
  { label: '扩容后容量', prop: 'targetSize', useSlot: true },
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
      font-size: 14px;
      width: 100px;
      text-align: left;
    }
    .expand-confirm-content {
      color: #000000;
      font-size: 14px;
      width: calc(100% - 100px);
    }
  }
}
</style>
