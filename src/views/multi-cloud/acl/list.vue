<template>
  <div class="ideal-main-container acl">
    <div class="flex-row acl__search">
      <ideal-select-search
        :options="searchOptions"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
      </ideal-select-search>
    </div>

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip>
          <template #default="props">
            <el-button link type="primary" @click="clickDetail">{{
              props.row.name
            }}</el-button>
            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <div class="flex-row">
              <div>{{ props.row.statusDes }}</div>
              <el-tooltip
                effect="dark"
                placement="right"
                :content="props.row.statusTip"
                popper-class="login-config__tooltip"
              >
                <svg-icon
                  icon="question-icon"
                  class="ideal-svg-margin-left"
                ></svg-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </template>

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
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'

const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}

// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}

// 列表下拉搜索
const searchOptions = [{ label: '名称', prop: 'name' }]
state.dataList = [
  {
    name: 'test-acl-001',
    uuid: '9e68fdce-0c1d-43d4-a061-759033aec532',
    statusDes: '已开启',
    status: true,
    statusTip: '网络ACL的规则都生效。',
    rules: '2',
    subnet: '0',
    description: '--'
  },
  {
    name: 'acl-002',
    uuid: 'fcdf2097-c5a1-4c6e-8494-bc0833326fd8',
    statusDes: '未开启',
    status: false,
    statusTip: '网络ACL的自定义规则将失效，只有默认规则有效。',
    rules: '4',
    subnet: '0',
    description: '描述'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '网络ACL规则', prop: 'rules' },
  { label: '关联子网', prop: 'subnet' },
  { label: '描述', prop: 'description' }
]
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建网络ACL',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    clickAclCreate()
  }
}
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '关联子网', prop: 'associate' },
  { title: '配置规则', prop: 'config' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'associate') {
    router.push({
      path: '/multi-cloud/acl/detail',
      query: { type: 'associateSubnet' }
    })
  } else if (command === 'config') {
    router.push({
      path: '/multi-cloud/acl/detail',
      query: { type: 'enterRule' }
    })
  }
}
// 根据每行数据状态判断操作是发布还是取消发布
const newOperate = (item: any): IdealTableColumnOperate[] => {
  const resultArr: IdealTableColumnOperate[] = JSON.parse(
    JSON.stringify(operateBtns)
  )
  if (item.status) {
    resultArr.push({ title: '关闭', prop: 'close' })
    resultArr.push({ title: '删除', prop: 'delete' })
  } else {
    resultArr.push({ title: '开启', prop: 'open' })
    resultArr.push({ title: '删除', prop: 'delete' })
  }
  return resultArr
}
const router = useRouter()
const clickDetail = () => {
  router.push({ path: '/multi-cloud/acl/detail', query: { type: 'basicInfo' } })
}
// 联调后删除此代码
onMounted(() => {
  state?.dataList?.forEach((item: any) => {
    item.showCopy = false
    item.operate = newOperate(item)
  })
})
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.showCopy = false
        item.operate = newOperate(item)
      })
    }
  }
)
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickAclCreate = () => {
  showDialog.value = true
  dialogType.value = 'resourcePool'
}
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  if (dialogType.value === 'resourcePool') {
    dialogType.value = OperateEventEnum.create
  }
  // showDialog.value = false
}
</script>

<style scoped lang="scss">
.acl {
  padding: $idealPadding;
  .acl__search {
    align-items: center;
    justify-content: space-between;
  }
}
</style>
<style lang="scss">
.login-config__tooltip {
  width: 260px;
}
</style>
