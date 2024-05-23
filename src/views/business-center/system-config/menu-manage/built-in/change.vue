<template>
  <div class="change">
    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #cloudType>
        <el-table-column label="云平台类型">
          <template #default="props">
            <el-select v-model="props.row.cloudType" placeholder="请选择">
              <el-option
                v-for="(item, idx) of cloudTypeList"
                :key="idx"
                :label="item.otherName"
                :value="item.otherId"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </template>
      <template #resource>
        <el-table-column label="资源池">
          <template #default="props">
            <el-select v-model="props.row.resource" placeholder="请选择">
              <el-option
                v-for="(item, idx) of resourceList"
                :key="idx"
                :label="item.otherName"
                :value="item.otherId"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </template>

      <template #url>
        <el-table-column label="URL前缀">
          <template #default="props">
            <el-input v-model="props.row.url"/>
          </template>
        </el-table-column>
      </template>

      <template #zone>
        <el-table-column label="区域">
          <template #default="props">
            <el-select v-model="props.row.zone" placeholder="请选择">
              <el-option
                v-for="(item, idx) of zoneList"
                :key="idx"
                :label="item.otherName"
                :value="item.otherId"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="120">
          <template #default="props">
            <svg-icon
              icon="delete-icon"
              @click="clickDelete(props.$index)"
            ></svg-icon>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <el-button link type="primary" @click="clickAdd">
      <svg-icon icon="circle-add"/>
      添加一条
    </el-button>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

const cloudTypeList: any = ref([])
const resourceList: any = ref([])
const zoneList: any = ref([])

const tableData: any = ref([])
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '云平台类型', prop: 'cloudType', useSlot: true },
  { label: '资源池', prop: 'resource', useSlot: true },
  { label: 'URL前缀', prop: 'url', useSlot: true },
  { label: '区域', prop: 'zone', useSlot: true }
]
const clickAdd = () => {
  tableData.value.push({ cloudType: '', resource: '', url: '', zone: '' })
}
const clickDelete = (index: number) => {
  tableData.value.splice(index, 1)
}
// 方法
interface EmitEvents {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvents>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}
const submitForm = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.change {
  width: 100%;
}
</style>
