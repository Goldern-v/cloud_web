<template>
  <div class="enter-rule ideal-large-margin-top">
    <div v-if="showTip" class="flex-row enter-rule__tip">
      <div class="flex-row">
        <svg-icon
          icon="info-warning"
          color="var(--el-color-primary)"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span
          >安全组规则对不同规格的云服务器生效情况不同，如果您的安全组规则未生效，请查看<el-text
            type="primary"
            >安全组规则限制</el-text
          ></span
        >
      </div>
      <svg-icon icon="close-icon" @click="clickCloseTip" />
    </div>

    <ideal-search
      :type-array="typeArray"
      class="ideal-middle-margin-top"
      @clickSearch="onClickSearch"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    >
      <template #append
        ><span>出方向规则:{{ state.total }}</span></template
      >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #operation>
        <el-table-column label="操作" width="225">
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
      :row-data="rowData"
      direction="exit"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import store from '@/store'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { querySafeGroupRule } from '@/api/java/network'

/**
 * 搜索类型
 */
const typeArray = ref<IdealSearch[]>([
  { label: '策略', prop: 'strategy', type: FiltrateEnum.input },
  { label: '源地址', prop: 'sourceAddress', type: FiltrateEnum.input },
  { label: '协议', prop: 'protocol', type: FiltrateEnum.input },
  { label: '端口', prop: 'port', type: FiltrateEnum.input },
  { label: '类型', prop: 'type', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      state.queryForm[item.prop] = temp[1]
    })
  }
  getDataList()
}

const { resourcePool } = storeToRefs(store.resourceStore)

onMounted(() => {
  addOneKey()
})

const addOneKey = () => {
  // 防止华为云切换重复添加
  if (leftButtons.value.some((row: any) => row.prop === 'oneKey')) {
    return
  }
  // 华为云独有功能(没做此功能暂时屏蔽)
  // if (RegExp(/HuaweiCloud/g).test(resourcePool.value?.vendorCode)) {
  //   leftButtons.value.push({ title: '一键放通', prop: 'oneKey' })
  // }
}
// 提示框
const showTip = ref(true)
const clickCloseTip = () => {
  showTip.value = false
}

const route = useRoute()
const uuid = route.query.uuid as string //安全组uuid
const cloudPlatformTypeCode = route.query.cloudPlatformTypeCode as string //云类型
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: querySafeGroupRule,
  deleteUrl: '',
  queryForm: {
    direction: 'egress',
    securitygroupId: uuid
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '优先级', prop: 'priority' },
  { label: '策略', prop: 'policy' },
  { label: '类型', prop: 'ethertype' },
  { label: '协议端口', prop: 'protocolPort' },
  {
    label: '目的地址',
    prop: 'sourceAddress',
    setTextType: true,
    textTypeProp: 'addressTextType'
  },
  { label: '描述', prop: 'description' },
  { label: '修改时间', prop: 'createTime.date' }
]

watch(
  () => state.dataListSelections,
  value => {
    leftButtons.value[1].disabled = true
    if (value?.length) {
      leftButtons.value[1].disabled = false
    }
  }
)
watch(
  () => state.dataList,
  value => {
    value?.forEach((item: any) => {
      item.policy = item.action === 'allow' ? '允许' : '拒绝'
      item.protocolPort = item.protocol
        ? item.protocol + ':' + (item.multiport ? item.multiport : '全部')
        : '全部'
      item.sourceAddress = item.remoteIpPrefix || item.remoteGroupName
      item.operate = newOperate(item)
    })
  }
)

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '添加规则', prop: 'addRule' }
  // { title: '删除', prop: 'delete', disabled: true, disabledText: '请先选择' } (没做此功能暂时屏蔽)
])

type leftBtnType = string | number | object
const clickLeftEvent = (value: leftBtnType) => {
  if (value === 'addRule') {
    showDialog.value = true
    dialogType.value = 'addRule'
  } else if (value === 'oneKey') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.oneKey
  }
}

// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'refresh',
    icon: 'refresh-icon'
  }
]
const clickRightEvent = (value: string | number | object) => {
  clickReset()
}

//列表操作按钮
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'edit') {
    showDialog.value = true
    dialogType.value = 'editRule'
  } else if (command === 'copy') {
    showDialog.value = true
    dialogType.value = 'copyRule'
  } else if (command === 'delete') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  }
}

const operateBtns: IdealTableColumnOperate[] = [
  // { title: '修改', prop: 'edit' },  华为公有云无此接口暂时屏蔽
  // { title: '复制', prop: 'copy' },
  { title: '删除', prop: 'delete' }
]
//判断按钮是否可用
const newOperate = (item: any) => {
  const tempArr = JSON.parse(JSON.stringify(operateBtns))
  const arr = handleOperateButton(item, tempArr)
  return arr
}

const handleOperateButton = (item: any, arr: IdealTableColumnOperate[]) => {
  let resultArr: IdealTableColumnOperate[] = []
  //华为云底层不支持修改安全组规则
  if (RegExp(/HuaweiCloud/g).test(cloudPlatformTypeCode)) {
    resultArr = arr.filter(
      (item: IdealTableColumnOperate) => item.prop !== 'edit'
    )
  } else {
    resultArr = arr
  }
  return resultArr
}

// 重置
const clickReset = () => {
  state.page = 1
  getDataList()
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
// 监听
watchEffect(() => {
  addOneKey()
})
</script>

<style scoped lang="scss">
.enter-rule {
  width: calc(100% - 40px);
  padding: 20px;
  background-color: white;
  .enter-rule__tip {
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary);
    padding: 15px 20px;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
