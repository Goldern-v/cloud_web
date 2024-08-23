<template>
  <div class="cloud_port">
    <el-tabs
      v-model="activeName"
      class="cloud_port__tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="item in tabControllers"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>

      <div class="cloud_port__tabs__content">
        <ideal-search
          ref="idealSearchRef"
          :show-category="false"
          :show-platform-type="false"
          :show-resource-pool="false"
          :type-array="typeArray"
          @clickSearch="onClickSearch"
        />

        <el-divider border-style="solid" />

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
          :pagination-type="PaginationTypeEnum.totalSizes"
          @clickSizeChange="sizeChangeHandle"
          @clickCurrentChange="currentChangeHandle"
        >
          <template #status>
            <el-table-column label="审批状态" width="80">
              <template #default="props">
                <el-tag :type="props.row.type">{{ props.row.status }}</el-tag>
              </template>
            </el-table-column>
          </template>

          <template #operation>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="props">
                <ideal-table-operate
                  :buttons="props.row.operate"
                  @clickMoreEvent="clickOperateEvent($event as any, props.row)"
                >
                </ideal-table-operate>
              </template>
            </el-table-column>
          </template>
        </ideal-table-list>
      </div>
    </el-tabs>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { FiltrateEnum, PaginationTypeEnum } from '@/utils/enum'
import type { TabsPaneContext } from 'element-plus'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealTableColumnHeaders,
  IdealButtonEventProp,
  IdealSearch,
  IdealTableColumnOperate,
  IdealTextProp
} from '@/types'
import dialogBox from '../dialog-box.vue'
import { portPageUrl, portDelete } from '@/api/java/operate-center'
import { useCrud } from '@/hooks'
import { isSupplierManager } from '@/utils/role'
import { statusFormat, statusType } from '../common'

const typeArray = [
  { label: '端口名称', prop: 'name', type: FiltrateEnum.input }
]
const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  state.queryForm.cloudPortType = activeName.value
  state.queryForm.portType = 'CLOUD'
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

const activeName = ref('ali_cloud')
const idealSearchRef = ref()
const handleClick = (tab: TabsPaneContext, event: Event) => {
  // idealSearchRef.value.clickDeleteAll()
  tableHeaders.value = getTableHeaders(tab.paneName as string)
  getDataList()
}
// tabs标签页
const tabControllers = ref([
  { label: '阿里云', name: 'ali_cloud' },
  { label: 'AWS', name: 'aws' },
  { label: 'Azure', name: 'Azure' },
  { label: 'Google', name: 'GOOGLE_CLOUD' },
  { label: 'ZGA', name: 'zga' }
])
const tableHeaders = ref<IdealTableColumnHeaders[]>()
onMounted(() => {
  tableHeaders.value = getTableHeaders(activeName.value)
})
//根据不同类型云端口及角色类型展示不同的表头
const getTableHeaders = (condition: string) => {
  let arr: IdealTableColumnHeaders[] = []
  switch (condition) {
    case 'ali_cloud':
      arr = aliHeaders
      break
    case 'aws':
      arr = awsHeaders
      break
    case 'Azure':
      arr = azureHeaders
      break
    case 'GOOGLE_CLOUD':
      arr = googleheaders
      break
    case 'zga':
      arr = zgaHeaders
      break
    default:
      arr = aliHeaders
      break
  }
  state.queryForm.cloudPortType = condition
  let array: IdealTableColumnHeaders[] = []
  if (!isSupplierManager.value) {
    array = arr
  } else {
    array = arr?.filter((item: any) => item.prop !== 'vendorName')
  }
  return array
}

const state: IHooksOptions = reactive({
  dataListUrl: portPageUrl,
  deleteUrl: portDelete,
  queryForm: {
    portType: 'CLOUD',
    cloudPortType: 'ali_cloud'
  }
})

const { sizeChangeHandle, currentChangeHandle, getDataList, deleteHandle } =
  useCrud(state)

let operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]

const aliOperateButtons: IdealButtonEventProp[] = [
  { title: '编辑', prop: 'edit', authority: 'supplier:ali:port:edit' },
  { title: '删除', prop: 'delete', authority: 'supplier:ali:port:delete' }
]

const awsOperateButtons: IdealButtonEventProp[] = [
  { title: '编辑', prop: 'edit', authority: 'supplier:aws:port:edit' },
  { title: '删除', prop: 'delete', authority: 'supplier:aws:port:delete' }
]

const zgaOperateButtons: IdealButtonEventProp[] = [
  { title: '编辑', prop: 'edit', authority: 'supplier:zga:port:edit' },
  { title: '删除', prop: 'delete', authority: 'supplier:zga:port:delete' }
]

const azureOperateButtons: IdealButtonEventProp[] = [
  { title: '编辑', prop: 'edit', authority: 'supplier:azure:port:edit' },
  { title: '删除', prop: 'delete', authority: 'supplier:azure:port:delete' }
]

const googleOperateButtons: IdealButtonEventProp[] = [
  { title: '编辑', prop: 'edit', authority: 'supplier:google:port:edit' },
  { title: '删除', prop: 'delete', authority: 'supplier:google:port:delete' }
]

const newOperate = (ele: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateButtons))
  if (ele.approvalStatus.toUpperCase() === 'PASS' || ele.origin === 3) {
    resultArr = setOperateBtns(true, tempArr)
  }
  resultArr = tempArr
  return resultArr
}
// 根据状态设置操作禁用状态
const setOperateBtns = (
  disabled: boolean,
  array: IdealTableColumnOperate[]
) => {
  const arr: IdealTableColumnOperate[] = []
  array.forEach((item: any) => {
    item.disabled = disabled
    item.disabledText = `已通过审批或数据来源为API导入的不支持${item.title}操作`
    arr.push(item)
  })
  return arr
}

watch(
  () => state.dataList,
  (arr: any) => {
    if (arr.length) {
      arr.forEach((ele: any) => {
        ele.operate = newOperate(ele)
        ele.status = statusFormat[ele.approvalStatus.toUpperCase()]
        ele.type = statusType[ele.approvalStatus.toUpperCase()]
        if (ele.origin === undefined || ele.origin === null) {
          ele.originType = ''
        } else {
          ele.originType = ele.origin == 3 ? 'API导入' : '静态录入'
        }
      })
    }
  },
  { immediate: true }
)

const rowData: any = ref({})
const clickOperateEvent = (command: string | number, row: any) => {
  rowData.value = row
  if (command === 'delete') {
    deleteHandle(row.id, '/', '确定要删除当前端口信息吗？', '删除')
  } else if (command === 'edit') {
    showDialog.value = true
    switch (activeName.value) {
      case 'ali_cloud':
        dialogType.value = 'editAliPort'
        break
      case 'aws':
        dialogType.value = 'editAwsPort'
        break
      case 'Azure':
        dialogType.value = 'editAzurePort'
        break
      case 'GOOGLE_CLOUD':
        dialogType.value = 'editGooglePort'
        break
      case 'zga':
        dialogType.value = 'editZgaPort'
        break
    }
  }
}

const aliHeaders: IdealTableColumnHeaders[] = [
  { label: '端口名称', prop: 'name' },
  { label: '数据来源', prop: 'originType' },
  { label: '端口状态', prop: 'portStatus' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '实例ID', prop: 'instanceId' },
  { label: '区域', prop: 'area' },
  { label: '端口速度', prop: 'speed' },
  { label: '接入点', prop: 'accessPoint' },
  { label: '端口类型', prop: 'aliPortType' },
  { label: '所属供应商', prop: 'vendorName' },
  { label: '所属节点', prop: 'nodeName' },
  { label: '所属设备', prop: 'equipmentName' }
]
const zgaHeaders: IdealTableColumnHeaders[] = [
  { label: '端口名称', prop: 'name' },
  { label: '数据来源', prop: 'originType' },
  { label: '审批状态', prop: 'status', useSlot: true },
  { label: '端口速度', prop: 'speed' },
  { label: '区域', prop: 'area' },
  { label: '位置', prop: 'address' },
  { label: '所属供应商', prop: 'vendorName' },
  { label: '所属节点', prop: 'nodeName' },
  { label: '所属设备', prop: 'equipmentName' }
]

const awsHeaders: IdealTableColumnHeaders[] = [
  { label: '端口名称', prop: 'name' },
  { label: '数据来源', prop: 'originType' },
  { label: '端口状态', prop: 'portStatus' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '互连ID', prop: 'id' },
  { label: '端口速度', prop: 'speed' },
  { label: '区域', prop: 'area' },
  { label: '位置', prop: 'address' },
  { label: '逻辑设备', prop: 'logicalDevice' },
  { label: '所属供应商', prop: 'vendorName' },
  { label: '所属节点', prop: 'nodeName' },
  { label: '所属设备', prop: 'equipmentName' }
]

const azureHeaders: IdealTableColumnHeaders[] = [
  { label: '端口名称', prop: 'name' },
  { label: '数据来源', prop: 'originType' },
  { label: '端口状态', prop: 'portStatus' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '所属端口组', prop: 'portGroup' },
  { label: '区域', prop: 'area' },
  { label: 'location', prop: 'location' },
  { label: 'zone', prop: 'zone' },
  { label: 'address', prop: 'address' },
  { label: '端口速度', prop: 'speed' },
  { label: '所属供应商', prop: 'vendorName' },
  { label: '所属节点', prop: 'nodeName' },
  { label: '所属设备', prop: 'equipmentName' }
]

const googleheaders: IdealTableColumnHeaders[] = [
  { label: '端口名称', prop: 'name' },
  { label: '数据来源', prop: 'originType' },
  { label: '端口状态', prop: 'portStatus' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: 'Google circuit ID', prop: 'circuitId', width: '140' },
  { label: 'Google demarc ID', prop: 'demarcId', width: '140' },
  { label: '区域', prop: 'area' },
  { label: 'location', prop: 'location' },
  { label: 'zone', prop: 'zone' },
  { label: 'address', prop: 'address' },
  { label: '端口速度', prop: 'speed' },
  { label: '所属供应商', prop: 'vendorName', width: '140' },
  { label: '所属节点', prop: 'nodeName' },
  { label: '所属设备', prop: 'equipmentName' }
]
let leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建',
    prop: 'create',
    type: 'primary'
  }
]
const aliBtn: IdealButtonEventProp[] = [
  {
    title: '创建',
    prop: 'create',
    type: 'primary',
    authority: 'supplier:port:add'
  }
]
watch(
  () => activeName.value,
  value => {
    if (value === 'ali_cloud') {
      leftButtons = aliBtn
      operateButtons = aliOperateButtons
    } else if (value === 'aws') {
      leftButtons = awsBtn
      operateButtons = awsOperateButtons
    } else if (value === 'Azure') {
      leftButtons = azureBtn
      operateButtons = azureOperateButtons
    } else if (value === 'GOOGLE_CLOUD') {
      leftButtons = googleBtn
      operateButtons = googleOperateButtons
    } else if (value === 'zga') {
      leftButtons = zgaBtn
      operateButtons = zgaOperateButtons
    }
  },
  { immediate: true }
)

const awsBtn: IdealButtonEventProp[] = [
  {
    title: '创建',
    prop: 'create',
    type: 'primary',
    authority: 'supplier:aws:port:add'
  }
]
const zgaBtn: IdealButtonEventProp[] = [
  {
    title: '创建',
    prop: 'create',
    type: 'primary',
    authority: 'supplier:zga:port:add'
  }
]
const azureBtn: IdealButtonEventProp[] = [
  {
    title: '创建',
    prop: 'create',
    type: 'primary',
    authority: 'supplier:azure:port:add'
  }
]

const googleBtn: IdealButtonEventProp[] = [
  {
    title: '创建',
    prop: 'create',
    type: 'primary',
    authority: 'supplier:google:port:add'
  }
]

const clickLeftEvent = (command: string | number | object) => {
  if (command === 'create') {
    showDialog.value = true
    switch (activeName.value) {
      case 'ali_cloud':
        dialogType.value = 'createAliPort'
        break
      case 'aws':
        dialogType.value = 'createAwsPort'
        break
      case 'Azure':
        dialogType.value = 'createAzurePort'
        break
      case 'GOOGLE_CLOUD':
        dialogType.value = 'createGooglePort'
        break
      case 'zga':
        dialogType.value = 'createZgaPort'
        break
    }
  }
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>

<style scoped lang="scss">
.cloud_port {
  box-sizing: border-box;

  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs) {
    padding: 10px 20px 20px;
  }

  .cloud_port__tabs {
    background-color: white;
  }

  .cloud_port__component {
    margin-top: 20px;
  }

  .cloud_port__tabs__content {
    background-color: white;
    padding: $idealPadding 0;
  }
}
</style>
