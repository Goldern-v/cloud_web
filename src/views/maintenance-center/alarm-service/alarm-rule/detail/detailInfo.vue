<template>
  <div class="basic-info">
    <div class="basic-info__head">
      <p class="ideal-medium-text">基本信息</p>
      <ideal-detail-info
        :label-array="labelArray"
        :detail-info="detailInfo"
        class="ideal-large-margin-top"
      >
        <template #contactGroup>
          <div>{{ detailInfo?.contactGroupNames?.join(',') }}</div></template
        >
        <template #status>
          {{ detailInfo?.alarmStatus ? '告警中' : '未告警' }}</template
        >
        <template #effectiveTime>
          <span v-if="detailInfo?.enableNotification"
            >{{ detailInfo?.notificationStartTime }}--{{
              detailInfo?.notificationEndTime
            }}</span
          ></template
        >
      </ideal-detail-info>
    </div>

    <el-tabs v-model="activeName" class="basic-info__tabs">
      <el-tab-pane label="阈值规则" name="thresholdRule">
        <ideal-table-list
          :table-data="tableData"
          :table-headers="tableHeaders"
          :show-pagination="false"
          :merge-data="mergeData"
          :merge-column="[0]"
          class="ideal-table-list__container rule-list"
        >
        </ideal-table-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { getAlarmRuleList } from '@/api/java/maintenance-center'
import { showLoading, hideLoading } from '@/utils/tool'

// 详情label
const labelArray = ref([
  { label: '规则名称', prop: 'name' },
  { label: '规则ID', prop: 'id', isCopy: true },
  { label: '资源类型', prop: 'resourceTypeDes' },
  { label: '关联实例', prop: 'rangeDes' },
  { label: '告警联系组', prop: 'contactGroup', useSlot: true },
  { label: '告警状态', prop: 'status', useSlot: true },
  { label: '生效时间', prop: 'effectiveTime', useSlot: true },
  { label: '规则创建时间', prop: 'createTimeFormat' }
])

const activeName = ref('thresholdRule')

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '阈值规则名称', prop: 'name' },
  { label: '阈值描述', prop: 'overview' },
  { label: '告警级别', prop: 'reportLevelDes' }
]

const tableData: any = ref([])
// 详情
onMounted(() => {
  queryDetail()
})

const route = useRoute()

// 详情
const detailInfo: any = ref({})
const queryDetail = () => {
  const params = {
    id: route.query.id,
    pageNum: 1,
    pageSize: 10
  }
  getAlarmRuleList(params).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      detailInfo.value = data.data[0]
      tableData.value = detailInfo.value.historyConfigs
      mergeTable()
    } else {
      detailInfo.value = {}
    }
  })
}

/**
 * 列表合并
 */
const mergeData: any = ref([])
const pos = ref(0)
const mergeTable = () => {
  if (!tableData.value) {
    return
  }

  for (let i = 0; i < tableData.value.length; i++) {
    if (i === 0) {
      mergeData.value.push(1)
      pos.value = 0
    } else {
      if (tableData.value[i].name == tableData.value[i - 1].name) {
        mergeData.value[pos.value] += 1
        mergeData.value.push(0)
      } else {
        mergeData.value.push(1)
        pos.value = i
      }
    }
  }
}
</script>

<style scoped lang="scss">
.basic-info {
  width: 100%;
  .basic-info__head {
    padding: 20px;
    background-color: white;

    // 修改分割线
    :deep(.el-divider--vertical) {
      height: auto;
      border-left: 2px var(--el-border-color) var(--el-border-style);
    }
  }
  .basic-info__tabs {
    margin-top: 20px;
    background-color: white;
  }
  .rule-list {
    width: 100%;
    padding: 20px 0;
  }
}
</style>
