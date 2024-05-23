<template>
  <div class="ideal-main-container public-tag">
    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      :slot-array="['owner']"
      prefix-title="标签"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
      <template #owner>
        <el-input v-model="labelOwner" class="ideal-default-margin-right">
          <template #prepend>标签所有者</template>
        </el-input>
      </template>
    </ideal-select-search>

    <el-divider />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #color>
        <el-table-column label="颜色">
          <template #default="props">
            <div
              v-if="props.row.labelType === 320001"
              class="vdc-tag-color"
              :style="{ backgroundColor: props.row.color }"
            ></div>
            <div
              v-else
              class="vdc-tag-color"
              :style="
                'border:' + '3px' + ' ' + 'solid' + ' ' + props.row.color + ';'
              "
            ></div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
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
import dialogBox from '../components/dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum, OperateEventEnum, MoreOperateEnum } from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import { getVdcLabelList } from '@/api/java/business-center'

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: getVdcLabelList,
  deleteUrl: '',
  queryForm: {
    labelType: 320002
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)
state.dataList = [
  {
    name: 'test111',
    color: '#23b',
    number: '34',
    owner: '超级管理员1',
    createTime: '2023-05-10 16:18:10',
    description: '测试环境'
  }
]
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '颜色', prop: 'color', useSlot: true },
  { label: '资源数量', prop: 'bindResourcesCount' },
  { label: '标签所有者', prop: 'createUserName' },
  { label: '创建时间', prop: 'createTime' },
  { label: '描述', prop: 'remark' }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '资源绑定', prop: 'bind' }
]

const rowData: any = ref({})
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  dialogType.value = OperateEventEnum.bind
  showDialog.value = true
}
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  { title: '批量删除', prop: 'powerOn' }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    handleCloudHostCreate()
  }
}

const router = useRouter()
// 新建弹性云服务器
const handleCloudHostCreate = () => {
  router.push({ path: '/multi-cloud/public-tag/create' })
}

// 详情
const handleRedirectDetail = () => {
  router.push({ path: '/multi-cloud/public-tag/detail' })
}

const labelOwner = ref('') //标签所有者
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.name = search
  state.queryForm.userName = labelOwner.value
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>

<style scoped lang="scss">
.public-tag {
  padding: $idealPadding;
  .vdc-tag-color {
    width: 20px;
    height: 20px;
  }
}
</style>
