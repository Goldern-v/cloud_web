<template>
  <div class="route-list">
    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
      :show-pagination="false"
    >
      <template #ipNumber>
        <el-table-column label="IP地址数">
          <template #default="props"
            ><el-text
              :type="props.$index ? '' : 'primary'"
              :style="props.$index ? '' : 'cursor: pointer'"
              @click="showIpDetail(props.row, props.$index)"
              >{{
                props.$index ? 1 : props.row.defaultRouteList?.length
              }}</el-text
            ></template
          >
        </el-table-column>
      </template>

      <template #nextHopName>
        <el-table-column label="下一跳">
          <template #default="props"
            ><el-text
              :type="props.$index && !isTencent ? 'primary' : ''"
              style="cursor: pointer"
              @click="toDetail(props.row)"
              >{{ props.row.nextHopName }}</el-text
            ></template
          >
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :detail-info="detailInfo"
      :row-data="rowData"
      :multiple-selection="state.dataListSelections"
      :default-router-list="defaultRouterList"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import { OperateEventEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { nextTypeText } from './constant'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'
import { queryRouteTableDetail } from '@/api/java/network'

interface DetailProps {
  detailInfo?: any // 行数据
}
const props = withDefaults(defineProps<DetailProps>(), {
  detailInfo: () => ({})
})

const route = useRoute()
const id = route.query?.id //路由表id
const cloudType = route.query?.cloudType as string //云类型
const cloudCategory = route.query?.cloudCategory as string //云类别

//是否腾讯云
const isTencent = computed(
  () =>
    RegExp(/TENCENT_CLOUD/).test(cloudType) &&
    RegExp(/PUBLIC/).test(cloudCategory)
)

const state: IHooksOptions = reactive({
  deleteUrl: '',
  primaryKey: 'uuid'
})

onMounted(() => {
  queryDetailInfo()
})

const defaultRouterList = ref([]) //默认路由
const queryDetailInfo = () => {
  const params = {
    id: id
  }
  queryRouteTableDetail(params).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      data.routeList?.unshift({
        destination: 'Local',
        defaultRouteList: data.defaultRouteList,
        nextType: 'Local',
        nextHopName: 'Local',
        type: '系统',
        description: '系统默认，表示VPC内实例互通'
      })
      state.dataList = data.routeList
      defaultRouterList.value = data.defaultRouteList
    } else {
      state.dataList = []
    }
  })
}

watch(
  () => state.dataList,
  arr => {
    arr?.forEach((item: any, index: number) => {
      item.operate = newOperate(item, index)
      item.selectableDisabled = function () {
        return index ? true : false
      }
      if (index) {
        item.nextType = nextTypeText[item.nextHopType]
        item.type = '自定义'
      }
    })
  }
)
const newOperate = (item: any, index: number): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateBtns))
  tempArr.forEach((ele: any) => {
    ele.disabled = index ? false : true
    ele.disabledText = index ? '' : `系统路由不允许${ele.title}`
  })
  resultArr = tempArr
  return resultArr
}

const showIpDetail = (row: any, index: number) => {
  if (index) {
    return
  }
  row.defaultRouteList.forEach((item: any) => {
    item.type = '系统'
    item.nextHop = 'Local'
    item.nextHopType = 'Local'
  })
  rowData.value = row
  showDialog.value = true
  dialogType.value = 'ipAddress'
}

const router = useRouter()
const toDetail = (row: any) => {
  if (row.nextHopType === 'ECS') {
    router.push({
      path: '/multi-cloud/cloud-host/detail',
      query: {
        uuid: row?.nextHop,
        cloudCategory,
        cloudType
      }
    })
  }
}
// 行数据操作
const operateBtns = [
  { title: '修改', prop: 'edit', disabled: false },
  { title: '删除', prop: 'delete', disabled: false }
]
// 当前行数据
const rowData = ref({})
// 行数据操作
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  showDialog.value = true
  if (command === 'delete') {
    dialogType.value = 'deleteRoute'
  } else if (command === 'edit') {
    dialogType.value = OperateEventEnum.edit
  }
}
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '目的地址', prop: 'destination' },
  { label: 'IP地址数', prop: 'ipNumber', useSlot: true },
  { label: '下一跳类型', prop: 'nextType' },
  { label: '下一跳', prop: 'nextHopName', useSlot: true },
  { label: '类型', prop: 'type' },
  { label: '描述', prop: 'description' }
]

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '添加路由',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
])
const handleSelectionChange = (selections: any[]) => {
  state.dataListSelections = selections
  if (selections.length) {
    leftButtons?.value.forEach((item: any, index: number) => {
      item.disabled = false
      item.disabledText = ''
    })
  } else {
    leftButtons?.value.forEach((item: any, index: number) => {
      item.disabled = index !== 0
      item.disabledText = '请至少选择一个路由'
    })
  }
}
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    clickRouteListCreate()
  } else if (value === 'delete') {
    showDialog.value = true
    dialogType.value = 'batchDeleteRoute'
  }
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  queryDetailInfo()
}
//添加路由
const clickRouteListCreate = () => {
  rowData.value = {}
  showDialog.value = true
  dialogType.value = OperateEventEnum.add
}
</script>

<style scoped lang="scss">
.route-list {
  width: 100%;
  padding: 20px;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select .el-input) {
    width: 200px;
  }
}
</style>
