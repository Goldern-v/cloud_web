<template>
  <div class="set-monitor">
    <div class="flex-row set-monitor_title">
      <el-divider direction="vertical"></el-divider>
      <span>配置监控项图表样式</span>
    </div>
    <div class="flex-row set-monitor_title">
      <el-divider direction="vertical"></el-divider>
      <span>已选中指标:</span>
    </div>

    <transition-group class="flex-row tag-item">
      <el-tag
        v-for="(item, index) in tags"
        :key="item.itemName + index"
        type="info"
        closable
        draggable="true"
        @close="closeTag(item)"
        @dragstart="handleDragStart($event, item)"
        @dragover.prevent="handleDragOver($event, item)"
        @dragenter="handleDragEnter($event, item)"
        @dragend="handleDragEnd($event, item)"
      >
        <div>{{ item.name }}</div>
      </el-tag>
    </transition-group>

    <ideal-table-list
      ref="multipleTableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      is-multiple
      @handleSelectionChange="handleSelectionChange"
    >
    </ideal-table-list>
    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders, IdealMonitorIndicator } from '@/types'
import { EventEnum } from '@/utils/enum'
import store from '@/store'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage } from 'element-plus/es'
import {
  vmMonitorIndicatorsUrl,
  setVmMonitorIndicators
} from '@/api/java/maintenance-center'

interface LineChartProps {
  selectMonitorIndicator: string[] //已展示的监控指标
}
const props = withDefaults(defineProps<LineChartProps>(), {
  selectMonitorIndicator: () => []
})

const { t } = useI18n()

const route = useRoute()
const routeData = JSON.parse(route.query.data as any)
const state: IHooksOptions = reactive({
  dataListUrl: vmMonitorIndicatorsUrl,
  isPage: false,
  queryForm: {
    cloudType: routeData.cloudType,
    cloudCategory: routeData.cloudCategory,
    resourceType: routeData.monitorObject
  }
})
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '指标名称', prop: 'name' },
  { label: '指标描述', prop: 'description' }
]
const { getDataList } = useCrud(state)

watch(
  () => state.dataList,
  dataList => {
    const arr = dataList?.filter((item: any) =>
      props.selectMonitorIndicator.some(
        (ele: any) => ele.itemName === item.itemName
      )
    )
    arr?.forEach((item: any) => {
      multipleTableRef.value.IdealTableList.toggleRowSelection(item, undefined)
    })
    tags.value = props.selectMonitorIndicator
  },
  { deep: true }
)
const multipleTableRef = ref()

//关闭监控指标的tag标签，同时取消选中该项
const closeTag = (tag: any) => {
  let obj = state.dataList?.find((item: any) => item.enName === tag.enName)
  multipleTableRef.value.IdealTableList.toggleRowSelection(obj, undefined)
}

const tags: any = ref([]) //已选中监控指标的标签
const handleSelectionChange = (sections: any[]) => {
  tags.value = sections
}

/*
  拖拽事件
 */
let ending: IdealMonitorIndicator | null = null
let dragging: IdealMonitorIndicator | null = null
// 拖拽开始时触发的事件
const handleDragStart = (e: DragEvent, item: IdealMonitorIndicator) => {
  dragging = item
}
// 拖拽结束时触发的事件
const handleDragEnd = (e: DragEvent, item: IdealMonitorIndicator) => {
  if (ending && ending.itemName === dragging?.itemName) {
    return
  }
  const newItems = [...tags.value]
  const src = newItems.indexOf(dragging!)
  const dst = newItems.indexOf(ending!)
  newItems.splice(src, 1, ...newItems.splice(dst, 1, newItems[src]))
  tags.value = newItems
  dragging = null //被拖拽元素
  ending = null //目标元素
}
// 拖拽过程中在目标元素上移动时触发的事件
const handleDragOver = (e: DragEvent, item: IdealMonitorIndicator) => {
  e.dataTransfer!.dropEffect = 'move'
}
// 拖拽进入目标元素时触发的事件
const handleDragEnter = (e: DragEvent, item: IdealMonitorIndicator) => {
  e.dataTransfer!.effectAllowed = 'move'
  ending = item
}

//保存、取消
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  if (!tags.value.length) {return ElMessage.warning('请至少选择一个监控项')}
  const showIds = tags.value.map((item: any) => item.id)
  const noShowIds = state.dataList
    ?.filter(
      item => !tags.value.some((ele: any) => ele.itemName === item.itemName)
    )
    .map((it: any) => it.id)
  const params = {
    userId: store.userStore.user.id,
    showIds,
    noShowIds
  }
  setVmMonitorIndicators(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      emit(EventEnum.success)
      ElMessage.success('设置监控项成功')
    } else {
      ElMessage.error('设置监控项失败')
    }
  })
}
</script>

<style scoped lang="scss">
.set-monitor {
  :deep(.el-divider--vertical) {
    border-left: 2px var(--el-color-primary) var(--el-border-style);
  }
  .set-monitor_title {
    background-color: $gray1-light;
    align-items: center;
    padding: 15px 10px;
    margin: 20px 0;
  }
  .tag-item {
    flex-wrap: wrap;
    margin-top: 20px;
  }
  .el-tag {
    width: calc((100% - 40px) / 4);
    padding: 15px 10px;
    justify-content: space-between;
    margin: 0 10px 10px 0;
  }
}
</style>
