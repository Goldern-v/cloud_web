<template>
  <div>
    <ideal-table-list
      :table-data="ruleData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #monitorTimeCycle>
        <el-table-column label="监控时间周期" width="300">
          <template #default="props">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-input-number
                  v-model="props.row.monitorInterval"
                  controls-position="right"
                  :min="1"
                  :precision="0"
                ></el-input-number>
              </el-col>
              <el-col :span="12">
                <el-select
                  v-model="props.row.monitorIntervalUnit"
                  placeholder="选择时间单位"
                >
                  <el-option
                    v-for="(item, idx) of unitList"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </template>
      <template #triggerNum>
        <el-table-column label="触发次数" width="150">
          <template #default="props">
            <el-input-number
              v-model="props.row.tolerateTimes"
              controls-position="right"
              :min="1"
              :precision="0"
            ></el-input-number>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { unitList } from './common'
const ruleData = ref([{}])

interface ruleProps {
  defaultRules?: Array<any> //编辑回显自定义阈值规则
}

const props = withDefaults(defineProps<ruleProps>(), {
  defaultRules: () => [{}]
})

watch(
  () => props.defaultRules,
  arr => {
    if (arr.length) {
      ruleData.value = arr
    }
  },
  { deep: true, immediate: true }
)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '监控时间周期', prop: 'monitorTimeCycle', useSlot: true },
  { label: '触发次数', prop: 'triggerNum', useSlot: true }
]

defineExpose({ ruleData })
</script>

<style scoped lang="scss"></style>
