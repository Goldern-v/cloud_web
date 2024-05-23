<template>
  <div class="ideal-table-list__container public-tag">
    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      :slot-array="['owner']"
      prefix-title="标签"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
      <template #owner>
        <el-input class="ideal-default-margin-right" v-model="labelOwner">
          <template #prepend>标签所有者</template>
        </el-input>
      </template>
    </ideal-select-search>

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
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #color>
        <el-table-column label="颜色">
          <template #default="props">
            <div
              class="public-tag-color"
              :style="{ backgroundColor: props.row.color }"
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
      :multiple-selection="multipleSelection"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../../components/dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum, OperateEventEnum } from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import {
  getResourceLabelList,
  deleteResourceLabel
} from '@/api/java/business-center'

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: getResourceLabelList,
  deleteUrl: deleteResourceLabel,
  queryForm: {
    labelType: 320001
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)
// state.dataList = [
//   {
//     name: 'test111',
//     color: '#2e4',
//     number: '34',
//     owner: '超级管理员1',
//     createTime: '2023-05-10 16:18:10',
//     description: '测试环境'
//   }
// ]

const multipleSelection: any = ref([])
watch(
  () => state.dataListSelections,
  arr => {
    multipleSelection.value = arr
    attrData.leftButtons.forEach((item: any, index: number) => {
      item.disabled = index !== 0
      item.disabledText = '请选择一个或多个资源标签'
    })
    if (arr?.length) {
      attrData.leftButtons.forEach((item: any) => {
        item.disabled = false
        item.disabledText = ''
      })
    }
  },
  { deep: true }
)
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
  { title: '编辑', prop: 'edit' },
  { title: '绑定', prop: 'bind' },
  { title: '删除', prop: 'delete' }
]
const rowData = ref(null)
const clickOperateEvent = (command: string | number | object, row: any) => {
  showDialog.value = command !== 'delete'
  rowData.value = row
  if (command === 'delete') {
    deleteHandle(row.id, '?id=', `确定要删除${row.name}?`, '删除操作')
  } else if (command === 'bind') {
    dialogType.value = OperateEventEnum.bind
  } else if (command === 'edit') {
    dialogType.value = OperateEventEnum.edit
  }
}
const attrData = reactive({
  leftButtons: [] as IdealButtonEventProp[]
})
// 列表左侧按钮
attrData.leftButtons = [
  {
    title: '创建公有标签',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  {
    title: '批量删除',
    prop: 'batchDelete',
    disabled: true,
    disabledText: '请选择一个或多个资源标签'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    tagCreate()
  } else if (value === 'batchDelete') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  }
}

const router = useRouter()
const route = useRoute()

onMounted(() => {
  console.log(router, '路由')
})

// 新建标签
const tagCreate = () => {
  router.push({
    path: '/business-center/tag-manage/resource-tag/create',
    query: {
      labelType: 320001
    }
  })
}

const labelOwner = ref('')
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.name = search
  state.queryForm.userName = labelOwner.value
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  labelOwner.value = ''
  state.queryForm = {}
  state.queryForm.labelType = 320001
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
  width: 100%;
  padding: 20px;
  .public-tag-color {
    width: 20px;
    height: 20px;
  }
}
</style>
