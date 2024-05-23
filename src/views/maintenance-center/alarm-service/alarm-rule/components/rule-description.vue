<template>
  <div>
    <ideal-table-list
      :table-data="ruleData"
      :table-headers="ruleHeaders"
      :show-pagination="false"
    >
      <template #overview>
        <el-table-column label="规则描述" width="400">
          <template #default="props">
            <p v-for="(item, index) in props.row.overview" :key="index">
              {{ item }}
            </p>
          </template>
        </el-table-column>
      </template>

      <template #level>
        <el-table-column label="告警级别">
          <template #default="props">
            <p v-for="(item, index) in props.row.reportLevelText" :key="index">
              {{ item }}
            </p>
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="120">
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

    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      title="配置规则描述"
      :append-to-body="true"
      width="50%"
    >
      <config-rule-description
        :operate-type="operateType"
        :indicator-list="indicatorList"
        :row-data="rowData"
        @clickCancelEvent="clickCancelEvent"
        @clickSuccessEvent="clickSuccessEvent"
      ></config-rule-description>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import configRuleDescription from './config-rule-description.vue'
import {
  comparisonFormat,
  unitFormat,
  alarmLevelFormat,
  getIndicatorInfo
} from './common'
import { OperateEventEnum } from '@/utils/enum'

interface ruleProps {
  defaultRule?: Array<any> //编辑时已默认存在的规则
  indicatorList?: Array<any>
}

const props = withDefaults(defineProps<ruleProps>(), {
  indicatorList: () => [],
  defaultRule: () => []
})

//规则描述列表
const ruleHeaders: IdealTableColumnHeaders[] = [
  { label: '规则名称', prop: 'name' },
  { label: '规则描述', prop: 'overview', useSlot: true },
  { label: '告警级别', prop: 'level', useSlot: true }
]

const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]

const ruleData: any = ref([])

// 默认模版规则导入规则
watch(
  () => props.defaultRule,
  arr => {
    if (arr.length) {
      ruleData.value = arr.map(item => {
        return {
          name: item.name,
          overview: [item.overview],
          reportLevelText: [item.reportLevelDes],
          childRules: [item],
          metricType: 'SINGLE_METRIC',
          monitorReferAttr: item.monitorReferAttr
        }
      })
    }
  },
  { deep: true }
)

//合并数据
const mergeArray = (array: any) => {
  let grouped: { [key: number]: any[] } = array.reduce(
    (item: any, obj: any) => {
      let key = obj.name
      if (!item[key]) {
        item[key] = []
      }
      item[key].push(obj)
      return item
    },
    {}
  )
  let children: { name: string; children: any[] }[] = []
  for (let key in grouped) {
    children.push({ name: key, children: grouped[key] })
  }
  return children
}

const route = useRoute()

onMounted(() => {
  if (route.query.type === 'edit') {
    queryEditData()
  }
})
//编辑规则时回显数据
const queryEditData = () => {
  const routeData = JSON.parse(route.query.data as any)
  const array = mergeArray(
    routeData?.historyConfigs || routeData?.historyRuleConfigs
  )
  array.forEach((item: any) => {
    let reportLevelText: any = []
    let overview: any = []
    if (item.children.length) {
      item.children.forEach((ele: any) => {
        reportLevelText.push(ele.reportLevelDes)
        const des = `${ele.overview}，每${ele.monitorInterval}${ele.monitorIntervalUnitDes}，连续触发${ele.tolerateTimes}次`
        overview.push(des)
      })
    }
    const obj: any = {
      name: item.name, //规则名称
      metricType: item.children[0].metricType, //指标类型
      overview, //规则描述
      childRules: item.children //阈值规则
    }
    if (item.children[0].metricType === 'SINGLE_METRIC') {
      obj.monitorReferAttr = item.children[0].monitorReferAttr //监控指标
      obj.reportLevelText = reportLevelText
    } else {
      obj.reportLevel = item.children[0].reportLevel //告警级别
      obj.reportLevelText = [item.children[0].reportLevelDes]
    }
    ruleData.value.push(obj)
  })
}

const rowData = ref(null)
const operateType = ref<OperateEventEnum | undefined>() //弹窗类型
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'delete') {
    ruleData.value.splice(row.index, 1)
  } else if (command === 'edit') {
    rowData.value = row
    dialogVisible.value = true
    operateType.value = OperateEventEnum.edit
  }
}

const dialogVisible = ref(false)
//添加规则
const addRule = () => {
  dialogVisible.value = true
  operateType.value = OperateEventEnum.create
}

const clickCancelEvent = () => {
  dialogVisible.value = false
}

const clickSuccessEvent = (data: any[], form: any) => {
  let reportLevelText: any = []
  let overview: any = []
  data.forEach((item: any) => {
    item.name = form.name //规则名称
    item.metricType = form.metricType //指标类型
    let indicator: any = {}
    //规则告警级别
    if (form.metricType === 'SINGLE_METRIC') {
      item.monitorReferAttr = form.monitorReferAttr //监控指标
      reportLevelText.push(item.reportLevelText)
      indicator = getIndicatorInfo(props.indicatorList, form)
    } else {
      item.reportLevel = form.reportLevel
      item.triggerType = form.triggerType
      reportLevelText = [alarmLevelFormat[form.reportLevel]]
      indicator = getIndicatorInfo(props.indicatorList, item)
    }
    //规则描述
    overview.push(
      `${indicator?.des}(${comparisonFormat[item.valueAttr]}属性)${
        item.comparisonOperator
      }${item.thresholdValue}${indicator?.unit}，每${item.monitorInterval}${
        unitFormat[item.monitorIntervalUnit]
      }，连续触发${item.tolerateTimes}次`
    )
  })
  const index = ruleData.value.findIndex((item: any) => item.name === form.name)
  const ruleObj: { [key: string]: any } = {
    name: form.name,
    reportLevelText,
    overview,
    childRules: data,
    metricType: form.metricType
  }
  if (form.metricType === 'SINGLE_METRIC') {
    ruleObj.monitorReferAttr = form.monitorReferAttr
  } else {
    ruleObj.reportLevel = form.reportLevel
  }
  if (index !== -1) {
    ruleData.value.splice(index, 1, ruleObj)
  } else {
    ruleData.value.push(ruleObj)
  }
  dialogVisible.value = false
}
defineExpose({
  ruleData
})
</script>

<style scoped lang="scss">
.ideal-table-list__container {
  padding: 0px;
}
</style>
