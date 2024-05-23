<template>
  <div class="ideal-main-container operate-log">
    <div class="operate-log-tip">
      {{ logSaveTimeDescription }}
    </div>

    <div class="flex-row operate-log__search">
      <div class="ideal-default-margin-right">
        <el-date-picker
          v-model="timeRanges"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD HH:mm:ss"
        />
      </div>

      <el-input v-model="operate" class="search-input input-suffix-select">
        <template #prepend>
          <el-select
            v-model="searchOperate"
            placeholder="请选择"
            style="width: 120px"
            @change="searchChange"
          >
            <el-option
              v-for="(item, index) of searchOptions"
              :key="index + 'selectSearch'"
              :label="item.label"
              :value="item.prop"
            >
            </el-option>
          </el-select>
        </template>
      </el-input>

      <div class="input-append-select search-input">
        <el-input v-model="operateType" readonly>
          <template #append>
            <el-select v-model="searchOperateType" clearable class="ideal-default-margin-right">
              <el-option
                v-for="(item, index) of operateTypeList"
                :key="index + 'selectSearch'"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-input>
      </div>

      <div class="flex-row custom-button" @click="handleSearch">
        <span>搜索</span>
      </div>

      <div class="flex-row custom-button reset-button" @click="handleReset">
        <span>重置</span>
      </div>
    </div>

    <el-divider />

    <ideal-button-events
      :left-btns="attrData.leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-multiple="true"
      :show-pagination="false"
      @handleSelectionChange="selectionChangeHandle"
    ></ideal-table-list>

    <div class="flex-row page-container">
      <el-select
        v-model="state.limit"
        style="width: 100px; margin-right: 10px"
        @change="getDataList"
      >
        <el-option
          v-for="item in limitOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div>
        <el-button id="up" type="primary" @click="handlePage('up')"
          ><svg-icon icon="left-arrow"></svg-icon>上一页</el-button
        >
        <el-button
          id="down"
          type="primary"
          :disabled="switchPageDisabled"
          @click="handlePage('down')"
          >下一页<svg-icon icon="right-arrow"></svg-icon
        ></el-button>
      </div>
    </div>

    <log-time
      v-if="showDialog"
      :type="dialogType"
      :log-storage-info="logStorageInfo"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    >
    </log-time>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum, OperateEventEnum } from '@/utils/enum'
import logTime from './logTime.vue'
import type { IdealButtonEventProp, IdealTableColumnHeaders } from '@/types'
import { operateLogList, queryLogSaveTime } from '@/api/java/operate-center'

/**
 * 搜索
 */
const searchOptions = [
  { label: '操作对象', prop: 'module' },
  { label: '操作人', prop: 'operator' }
]
const operateType = ref('操作类型')
const operate = ref('')
const searchOperate = ref('module')
const searchOperateType = ref('')
const operateTypeList = [
  { label: '查询', value: 'SELECT' },
  { label: '新增', value: 'CREATE' },
  { label: '删除', value: 'DROP' },
  { label: '修改', value: 'UPDATE' }
]
// 日期范围
const now = new Date() //今天的时间
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) //距离今天过去一周
const timeRanges = ref<[Date, Date]>([lastWeek, now])

const searchChange = () => {
  operate.value = ''
}

//搜索
const handleSearch = () => {
  state.queryForm[searchOperate.value] = operate.value
  state.queryForm.operatorType = searchOperateType.value
  state.queryForm.startDate = new Date(timeRanges.value[0]).getTime()
  state.queryForm.endDate = new Date(timeRanges.value[1]).getTime()
  getDataList()
}
//重置
const handleReset = () => {
  operate.value = ''
  searchOperateType.value = ''
  state.queryForm = {}
  handleSearch()
}

onMounted(() => {
  queryCustomLogSaveTime()
})
/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: operateLogList,
  queryForm: {
    startDate: new Date(timeRanges.value[0]).getTime(),
    endDate: new Date(timeRanges.value[1]).getTime()
  }
})

const { selectionChangeHandle, getDataList } = useCrud(state)
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '编号', prop: 'traceId' },
  { label: '操作对象', prop: 'module' },
  { label: '操作内容', prop: 'content' },
  { label: '操作类型', prop: 'type' },
  {
    label: '状态',
    prop: 'statusText',
    setTextType: true,
    textTypeProp: 'statusTypeProp'
  },
  { label: '操作人', prop: 'operator' },
  { label: '关联账号', prop: 'account' },
  { label: '登录IP', prop: 'loginIp' },
  { label: '发生时间', prop: 'operateTime' }
]

const attrData: any = reactive({
  leftButtons: [] as IdealButtonEventProp[],
  rightButtons: [] as IdealButtonEventProp[]
})

const minTime: any = ref('')
const maxTime: any = ref('')
const tableData: any = ref([])
const switchPageDisabled = ref(false)
watch(
  () => state.dataList,
  arr => {
    if (arr?.length) {
      switchPageDisabled.value = !arr[0].flag //判断下一页是否可点击
      minTime.value = arr[0].operateTimeStamp
      maxTime.value = arr[arr.length - 1].operateTimeStamp
      arr.forEach((item: any) => {
        item.statusTypeProp = item.success ? 'success' : 'danger'
        item.statusText = item.success ? '成功' : '失败'
      })
    }
    tableData.value = arr
  }
)

watch(
  () => state.limit,
  value => {
    state.queryForm.pageDate = ''
    state.queryForm.pageType = ''
  }
)

// 列表左侧按钮
attrData.leftButtons = [
  {
    title: '自定义日志保存时间',
    prop: 'create',
    type: 'primary',
    icon: '',
    iconColor: 'white'
  },
  { title: '导出', icon: 'download-icon', prop: 'export' }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
  }
}

//列表底部按钮
attrData.rightButtons = [
  {
    title: '上一页',
    prop: 'up',
    type: 'primary'
  },
  { title: '下一页', type: 'primary', prop: 'down' }
]

const limitOptions = [
  {
    label: '10条/页',
    value: 10
  },
  {
    label: '20条/页',
    value: 20
  },
  {
    label: '30条/页',
    value: 30
  },
  {
    label: '50条/页',
    value: 50
  }
]

/**
 * 方法
 */
const logStorageInfo: any = ref()
const logSaveTimeDescription = ref('')
//查询自定义日志保存时间
const queryCustomLogSaveTime = async () => {
  const timeText: any = {
    DAY: '天',
    MONTH: '个月',
    YEAR: '年'
  }
  const res: any = await queryLogSaveTime()
  const { data, code } = res
  if (code === 200) {
    logStorageInfo.value = data
    if (data.logScheduleTaskType !== 'FOREVER') {
      logSaveTimeDescription.value = `当前日志保存时间为${
        data.storageNum ? data.storageNum : 0
      }${
        timeText[data.logScheduleTaskType]
      }；日志删除为不可逆操作；设置存储周期过期日志将自动删除，请谨慎操作`
    } else {
      logSaveTimeDescription.value =
        '当前日志保存时间周期为 “永久保存”；设置后系统将不再自动删除/清理日志。'
    }
  }
}

//切换页码
const handlePage = (value: string) => {
  document.getElementById(value)?.blur()
  state.queryForm.pageType = value
  if (value === 'up') {
    state.queryForm.pageDate = state.dataList?.length
      ? minTime.value
      : maxTime.value
  } else if (value === 'down') {
    state.queryForm.pageDate = maxTime.value
  }
  getDataList()
}

/**
 * 弹窗
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
  queryCustomLogSaveTime()
}
</script>

<style scoped lang="scss">
.operate-log {
  background-color: white;
  padding: $idealPadding;
  .operate-log-tip {
    padding: 5px 10px;
    border: 1px solid var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    margin-bottom: 10px;
  }
  .page-container {
    justify-content: flex-end;
    margin-top: 20px;
  }
}
.search-input {
  width: 320px;
  margin-right: 10px;
}
.input-append-select {
  :deep(.el-input-group__append) {
    width: 80%;
    background-color: var(--el-fill-color-blank);
    padding: 0;
  }
  :deep .el-input__wrapper {
    background-color: var(--el-fill-color-light);
  }
  :deep .el-input--suffix {
    width: 200px;
  }
}
:deep(
    .el-input-group--prepend
      .el-input-group__prepend
      .el-select
      .el-select__wrapper
  ) {
  height: 34px;
}
:deep(
    .el-input-group--append
      .el-input-group__append
      .el-select
      .el-select__wrapper
  ) {
  height: 34px;
}
.input-suffix-select {
  :deep .el-input--suffix {
    width: 120px;
  }
}
.custom-button {
  border: 1px solid var(--el-color-primary);
  border-radius: $circleRadiusSize;
  color: var(--el-color-primary);
  cursor: pointer;
  align-items: center;
  padding: 0 12px;
  margin-right: 10px;
  &:hover {
    background-color: var(--theme-menu-hover-bg-color);
  }
}
.reset-button {
  border: 1px solid var(--el-border-color-light);
  background: white;
  color: var(--el-button-text-color);
  &:hover {
    border-color: var(--el-border-color-light);
  }
}
:deep(.el-date-editor.el-input__wrapper) {
  height: 34px;
}
</style>
