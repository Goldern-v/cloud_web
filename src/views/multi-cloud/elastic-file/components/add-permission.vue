<template>
  <div class="add-permission">
    <div class="flex-row">
      <div class="ideal-theme-text ideal-default-margin-right">所属VPC</div>
      <div>vpc-01</div>
    </div>

    <ideal-table-list
      :table-data="tableArray"
      :table-headers="tableHeaders"
      :show-pagination="false">
      <template #address>
        <el-table-column label="授权地址">
          <template #default="props">
            <el-input v-model="props.row.address"/>
          </template>
        </el-table-column>
      </template>

      <template #readWrite>
        <el-table-column label="读写权限">
          <template #default="props">
            <el-select v-model="props.row.readWrite">
              <el-option
                v-for="(item, index) of readWriteList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
      </template>

      <template #user>
        <el-table-column label="用户权限">
          <template #default="props">
            <el-select v-model="props.row.user">
              <el-option
                v-for="(item, index) of userList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
      </template>

      <template #priority>
        <el-table-column label="优先级">
          <template #default="props">
            <el-input v-model="props.row.priority"/>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { isEmpty, isUnDef } from '@/utils/is'
import { EventEnum } from '@/utils/enum'

interface AddPermissionProps {
  rowData?: any
}
const props = withDefaults(defineProps<AddPermissionProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

const tableArray = ref<any[]>([])
onMounted(() => {
  if (!isEmpty(props.rowData) && !isUnDef(props.rowData)) {
    tableArray.value = [props.rowData]
  }
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '授权地址', prop: 'address', useSlot: true },
  { label: '读写权限', prop: 'readWrite', useSlot: true },
  { label: '用户权限', prop: 'user', useSlot: true },
  { label: '优先级', prop: 'priority', useSlot: true }
]

const readWriteList = [
  { label: '读写', value: 'readWrite' },
  { label: '只读', value: 'onlyRead' }
]
const userList = [
  { label: 'no_root_squash', value: '1' },
  { label: 'all_squash', value: '2' }
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
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.add-permission {
  width: 100%;
}
</style>
