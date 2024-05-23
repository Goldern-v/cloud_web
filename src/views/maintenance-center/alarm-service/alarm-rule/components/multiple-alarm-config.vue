<template>
  <div>
    <ideal-table-list
      :table-data="ruleData"
      :table-headers="tableHeaders"
      :show-pagination="false"
      style="width: 100%"
    >
      <template #monitorIndicator>
        <el-table-column label="监控指标" width="150">
          <template #default="props">
            <el-cascader
              v-model="props.row.monitorReferAttr"
              :options="indicatorList"
              :props="cascaderProps"
              :show-all-levels="false"
              placeholder="请选择监控指标"
              @change="handleChange(props.row)"
            />
          </template>
        </el-table-column>
      </template>

      <template #remark>
        <el-table-column label="规则描述" width="450px">
          <template #default="props">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-select
                  v-model="props.row.valueAttr"
                  placeholder="请选择比较的值"
                >
                  <el-option
                    v-for="(item, idx) of comparisonValues"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select
                  v-model="props.row.comparisonOperator"
                  placeholder="请选择比较方法"
                >
                  <el-option
                    v-for="(item, idx) of comparisonList"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-input-number
                  v-model="props.row.thresholdValue"
                  controls-position="right"
                  :min="0"
                  style="width: 75%"
                ></el-input-number>
                {{ props.row.unit }}
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="100px">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <el-button class="ideal-default-margin-top" @click="addRule">添加规则</el-button>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { comparisonValues, comparisonList, getIndicatorInfo } from './common'

interface ruleProps {
  indicatorList: Array<any>
  defaultRules?: Array<any> //编辑回显自定义阈值规则
}

const props = withDefaults(defineProps<ruleProps>(), {
  indicatorList: () => [],
  defaultRules: () => [{}]
})

const ruleData: any = ref([{}])
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
  { label: '监控指标', prop: 'monitorIndicator', useSlot: true },
  { label: '规则描述', prop: 'remark', useSlot: true }
]
//  监控指标
const cascaderProps = {
  value: 'code',
  label: 'des',
  children: 'metrics'
}
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'delete') {
    ruleData.value.splice(row.index, 1)
  }
}

const handleChange = (row: any) => {
  row.unit = getIndicatorInfo(props.indicatorList, row).unit
}

const addRule = () => {
  ruleData.value.push({})
}

defineExpose({
  ruleData
})
</script>

<style scoped lang="scss"></style>
