<template>
  <div class="analyze-record">
    <div class="flex-row analyze-record__tip">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <ul>
        <li>
          为了提升全球DNS解析体验，华为云推出新的NS地址。<el-text type="primary"
            >查看详情</el-text
          >
        </li>
        <li>
          华为云提供
          <el-text type="primary">域名解析检测</el-text
          >,为您快速验证域名解析是否生效。
        </li>
        <li>
          您需要在域名服务商处把域名的DNS改成：<el-text type="danger"
            >ns1.huaweicloud-dns.org，ns1.huaweicloud-dns.net,
            ns1.huaweicloud-dns.cn，ns1.huaweicloud-dns.com</el-text
          >解析才会生效。<el-text type="primary"> 如何修改</el-text>
        </li>
        <li>
          修改域名DNS服务器的生效时间请以域名服务商处的说明为准。<el-text
            type="primary"
          >
            查看解析生效时间</el-text
          >
        </li>
      </ul>
    </div>
    <div>
      <div class="ideal-tip-text quota-text">
        您还可以添加{{ recordNum }}个记录集。
      </div>
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
        :total="state.total"
        is-multiple
        @clickSizeChange="sizeChangeHandle"
        @clickCurrentChange="currentChangeHandle"
        @handleSelectionChange="selectionChangeHandle"
      >
        <template #status>
          <el-table-column label="状态">
            <template #default="props">
              <ideal-status-icon
                v-if="props.row.status"
                :status-icon="props.row.statusIcon"
                :status-text="props.row.statusText"
              />
            </template>
          </el-table-column>
        </template>

        <template #value>
          <el-table-column label="状态">
            <template #default="props">
              <div v-for="item in props.row.value" :key="item">
                {{ item }}
              </div>
            </template>
          </el-table-column>
        </template>

        <template #operation>
          <el-table-column label="操作" width="185">
            <template #default="props">
              <ideal-table-operate
                :max-buttons="3"
                :buttons="operateButtons"
                @clickMoreEvent="clickOperateEvent($event, props.row)"
              >
              </ideal-table-operate>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>
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
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealTableColumnHeaders
} from '@/types'
import { OperateEventEnum } from '@/utils/enum'
import dialogBox from '../../dialog-box.vue'

const attrData = reactive({
  timeRanges: '', // 日期范围
  leftButtons: [] as IdealButtonEventProp[]
})

//列表顶部按钮
attrData.leftButtons = [
  { title: '添加记录集', prop: 'addRecordSet' },
  { title: '快速添加解析', prop: 'addAnalyze' },
  { title: '启用', prop: 'enable' },
  { title: '暂停', prop: 'pause' },
  { title: '删除', prop: 'delete' }
]

const clickLeftEvent = (command: string | number | object) => {
  if (command === 'addRecordSet') {
    dialogType.value = OperateEventEnum.add
    showDialog.value = true
  } else if (command === 'addAnalyze') {
    dialogType.value = 'addAnalysis'
    showDialog.value = true
  }
}
/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '域名', prop: 'domainName' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '类型', prop: 'type' },
  { label: '线路类型', prop: 'lineType' },
  { label: 'TTL(秒)', prop: 'ttl' },
  { label: '值', prop: 'value', useSlot: true },
  { label: '权重', prop: 'weight' },
  { label: '描述', prop: 'remark' }
]
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

const recordNum = ref(500)
watch(
  () => state.dataList,
  arr => {
    recordNum.value = arr?.length ? 500 - arr?.length : 500
    arr?.forEach((item: any) => {
      item.operate = newOperate(item)
    })
  }
)

const operateButtons: IdealTableColumnOperate[] = [
  { type: 'primary', title: '修改', prop: 'edit' },
  { type: 'primary', title: '暂停', prop: 'pause' },
  { type: 'primary', title: '删除', prop: 'delete' }
]

// 根据每行数据状态判断操作是否禁用
const newOperate = (item: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateButtons))
  if (item.recordType === 'default') {
    const tip = '该记录为系统默认域名记录值，不能操作'
    resultArr = setOperateBtns(true, tip, tempArr)
  }
  return resultArr
}

const rowData: any = ref({})
const clickOperateEvent = (command: string | number | object, row: any) => {}

state.dataList = [
  {
    domainName: 'e1xample.com',
    status: 'normal',
    statusText: '正常',
    statusIcon: 'status-success',
    lineType: '电信',
    ttl: 600,
    value: [
      'ns1.huaweicloud-dns.org',
      'ns1.huaweicloud-dns.cn',
      'ns1.huaweicloud-dns.net',
      'ns1.huaweicloud-dns.com'
    ],
    weight: 10,
    remark: '备注',
    type: 'NS',
    recordType: 'default'
  }
]

// 根据状态设置操作禁用状态
const setOperateBtns = (
  disabled: boolean,
  disabledText: string,
  array: IdealTableColumnOperate[]
) => {
  const arr: IdealTableColumnOperate[] = []
  array.forEach((item: any) => {
    if (!item.children) {
      item.disabled = disabled
      item.disabledText = disabledText
    }
    if (item.children && item.children.length > 0) {
      setOperateBtns(disabled, disabledText, item.children)
    }
    arr.push(item)
  })
  return arr
}

//根据多选情况判断按钮是否可点
const multipleSelection: any = ref([])
watch(
  () => state.dataListSelections,
  arr => {
    multipleSelection.value = arr
    attrData.leftButtons.forEach((item: any, index: number) => {
      item.disabled = index > 1
      item.disabledText = '请选择记录集'
    })
    if (arr?.length) {
      attrData.leftButtons.forEach((item: any) => {
        item.disabled = false
        item.disabledText = ''
      })
    }
  },
  { deep: true, immediate: true }
)

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
</script>

<style scoped lang="scss">
.analyze-record {
  .analyze-record__tip {
    background-color: var(--custom-information-bg-color);
    border: 1px solid var(--el-color-primary);
    padding: 15px 20px;
    margin-bottom: 20px;
    ul {
      li {
        list-style-type: none;
      }
    }
  }
  .quota-text {
    height: 20px;
  }
}
</style>
