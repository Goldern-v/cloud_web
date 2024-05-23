<template>
  <div class="create-confirm">
    <ideal-table-list
      class="create-confirm-table"
      :table-data="tableArray"
      :table-headers="tableHeaders"
      :show-pagination="false">
      <template #productSpec>
        <el-table-column label="产品规格">
          <template #default="props">
            <div v-for="(item, index) of labelArray" :key="index" class="flex-row">
              <div>{{ item.label }}：</div>
              <div>{{ props.row[item.prop] }}</div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #bugTime>
        <el-table-column v-if="isPackage" label="购买时长">
          <template #default="props">
            <div>{{ props.row.bugTime }}</div>
          </template>
        </el-table-column>
      </template>

      <template #price>
        <el-table-column label="价格">
          <template #default="props">
            <div class="ideal-error-text">{{ props.row.price }}</div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { EmitsEnum, BillingEnum } from '@/utils/enum'
import emits from '@/utils/emits'

interface ConfirmProps {
  data?: any
}
const props = withDefaults(defineProps<ConfirmProps>(), {
  data: () => ({})
})
const tableArray = ref<any[]>([])

watch(() => props.data, value => {
  if (value) {
    initTableData()
  }
}, {deep: true})
const initTableData = () => {
  let tagStr = ''
  props?.data?.tags.forEach((item: any) => {
    if (item.key && item.value) {
      tagStr += `${item.key}:${item.value} `
    }
  })
  let dic = {
    productType: '云备份',
    billing: props.data.billingMode === BillingEnum.ON_DEMAND ? '按需计费' : '包年包月',
    number: 1,
    resourceType: '云服务器',
    backupType: '云服务器备份',
    tagStr,
    price: '0.233',
    ...props.data
  }
  tableArray.value = [dic]
}
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '产品类型', prop: 'productType' },
  { label: '产品规格', prop: 'productSpec', useSlot: true },
  { label: '计费模式', prop: 'billing' },
  { label: '购买时长', prop: 'bugTime', useSlot: true },
  { label: '数量', prop: 'number' },
  { label: '价格', prop: 'price', useSlot: true }
]
const labelArray = [
  { label: '区域', prop: 'region' },
  { label: '保护类型', prop: 'protectType' },
  { label: '资源类型', prop: 'resourceType' },
  { label: '创建备份类型', prop: 'backupType' },
  { label: '云服务器', prop: 'cloudHost' },
  { label: '存储库容量(GB)', prop: 'repositorySize' },
  { label: '数据库备份', prop: 'database' },
  { label: '自动备份', prop: 'autoBackup' },
  { label: '自动绑定', prop: 'autoBind' },
  { label: '自动扩容', prop: 'autoExpand' },
  { label: '标签', prop: 'tagStr' },
  { label: '存储库名称', prop: 'name' }
]
// 全局事件总线
const isPackage = ref(true)
emits.on(EmitsEnum.CHBChangeBillingMode, (dic: {[key: string]: string}) => {
  if (dic.billingMode === BillingEnum.PACKAGE) {
    isPackage.value = true
  } else {
    isPackage.value = false
  }
})
onUnmounted(() => {
  // 取消事件订阅
  emits.off(EmitsEnum.CDBChangeBillingMode)
})
</script>

<style scoped lang="scss">
.create-confirm {
  width: 100%;
  .create-confirm-table {
    padding: 20px;
  }
}
</style>