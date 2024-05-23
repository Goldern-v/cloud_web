<template>
  <div>
    <div class="flex-row custom-warning-box">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <span
        >选择您在页面中要展示的指标名称，拖动选中指标可以对指标进行排序。</span
      >
    </div>
    <div class="tag-box">
      <div>
        您选中的指标<span class="ideal-error-text ideal-default-margin-left">
          {{ tags.length }}</span
        >
      </div>
      <div class="flex-row tag-item">
        <el-tag
          v-for="tag in tags"
          :key="tag.name"
          closable
          type="info"
          @close="closeTag(tag)"
        >
          {{ tag.name }}
        </el-tag>
      </div>
      <div
        class="flex-row"
        style="justify-content: space-between; align-items: center"
      >
        <div>
          全部指标<span class="ideal-error-text ideal-default-margin-left">
            {{ dataList.length }}</span
          >
        </div>
        <el-input
          v-model="filterText"
          placeholder="请输入指标名称"
          style="width: 30%"
        >
          <template #suffix>
            <svg-icon icon="search-icon"></svg-icon>
          </template>
        </el-input>
      </div>
    </div>
    <ideal-table-list
      ref="multipleTableRef"
      :loading="dataListLoading"
      :table-data="dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      is-multiple
      @handleSelectionChange="handleSelectionChange"
    >
    </ideal-table-list>
    <div class="flex-row ideal-submit-button">
      <el-button type="primary" @click="cancelForm">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()
interface LineChartProps {
  selectMonitorIndicator: string[] //已经选中的监控指标
}
const props = withDefaults(defineProps<LineChartProps>(), {
  selectMonitorIndicator: () => []
})

const filterText = ref('') //指标名称过滤

const multipleTableRef = ref()
onMounted(() => {
  //选中已选择的监控指标
  let arr = dataList.filter((item: any) =>
    props.selectMonitorIndicator.some(
      (ele: any) => ele.chartId === item.chartId
    )
  )
  arr.forEach((item: any) => {
    multipleTableRef.value.IdealTableList.toggleRowSelection(item, undefined)
  })
})
const dataListLoading = ref(false)
const dataList = [
  {
    name: '入网带宽',
    desc: '该指标用于统计测试对象入云平台的网络速度',
    chartId: 'bandwidth_access'
  },
  {
    name: '入网带宽使用率',
    desc: '该指标用于统计测试对象入云平台的带宽使用率，当宽带大小调整时，',
    chartId: 'bandwidth_frequency_access'
  },
  {
    name: '入网流量',
    desc: '该指标用于娩计测试对象入云平台的网络流量，',
    chartId: 'traffic_incoming'
  },
  {
    name: '出网流量',
    desc: '该指标用于娩计测试对象入云平台的网络流量，',
    chartId: 'bandwidth_outbound'
  },
  {
    name: '出网带宽使用率',
    desc: '该指标用于娩计测试对象入云平台的网络流量，',
    chartId: 'bandwidth_outbound_usage'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '指标名称', prop: 'name' },
  { label: '指标描述', prop: 'desc' }
]

const tags: any = ref([]) //已选中指标
const closeTag = (tag: any) => {
  multipleTableRef.value.IdealTableList.toggleRowSelection(tag, undefined) //取消已勾选中的指标
}
const handleSelectionChange = (sections: any[]) => {
  tags.value = sections
}

//保存、取消
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success, v: string[]): void
}
const emit = defineEmits<EventEmits>()
const cancelForm = () => {
  emit(EventEnum.cancel)
}
const submitForm = () => {
  emit(EventEnum.success, tags)
}
</script>
<style lang="scss" scoped>
.custom-warning-box {
  background-color: var(--custom-information-bg-color);
  border: 1px solid var(--el-color-primary);
  padding: 15px 20px;
  margin-bottom: 20px;
}
.tag-item {
  flex-wrap: wrap;
  margin-top: 10px;
}
.el-tag.is-closable {
  margin: 0px 10px 10px 0;
  width: 23%;
  padding: 15px 10px;
  justify-content: space-between;
}
</style>
