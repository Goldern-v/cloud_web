<template>
  <div class="ideal-main-container safe-group">
    <ideal-search
      :exit-search-result="exitSearchResult"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    />

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
      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip width="280">
          <template #default="props">
            <div
              class="ideal-theme-text"
              @click="clickDetail(props.row, 'basicInfo')"
            >
              {{ props.row.name }}
            </div>

            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #ruleNum>
        <el-table-column label="安全组规则" width="150">
          <template #default="props">
            <div class="ideal-theme-text" @click="toRule(props.row)">
              {{ props.row.ruleNum }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #instance>
        <el-table-column label="关联实例" width="150">
          <template #default="props">
            <div class="ideal-theme-text" @click="toInstance(props.row)">
              {{ props.row.instanceNum }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #tag>
        <el-table-column label="标签" width="150">
          <template #default="props">
            <ideal-tag-show
              :row="props.row"
              tag-key="cloudLabelDetails"
            ></ideal-tag-show>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="225" fixed="right">
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
      :multiple-selection="multipleSelection"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>

    <ideal-set-table-header
      :show-drawer="showDrawer"
      :data-array="headerArray"
      @update:showDrawer="showDrawer = $event"
      @onClickSubmit="onClickSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { querySafeGroupPage } from '@/api/java/network'

const route = useRoute()
onMounted(() => {
  tableHeaders.value = headerArray
  if (Object.keys(route.query).length) {
    for (let key in route.query) {
      if (key !== 'open') {
        exitSearchResult.value.push({
          label: key + '：' + route.query[key],
          prop: key,
          value: route.query[key]
        })
      } else {
        showDialog.value = true
        dialogType.value = OperateEventEnum.create
      }
    }
  }
})

/**
 * 搜索类型
 * @type {IdealSearch[]}
 */
const exitSearchResult: any = ref([])
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'ID', prop: 'id', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: querySafeGroupPage,
  deleteUrl: '',
  queryForm: {},
  createdIsNeed:
    !Object.keys(route.query).length || route.query?.open ? true : false
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
// 表头
const tableHeaders = ref<IdealTableColumnHeaders[]>([])
const headerArray: IdealTableColumnHeaders[] = [
  {
    label: '名称/ID',
    prop: 'name',
    useSlot: true,
    check: true,
    disabled: true
  },
  {
    label: '安全组规则',
    prop: 'ruleNum',
    useSlot: true,
    check: true,
    disabled: false
  },
  {
    label: '关联实例',
    prop: 'instance',
    useSlot: true,
    check: true,
    disabled: false
  },
  {
    label: '云平台类别',
    prop: 'cloudPlatformCategory',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '云平台类型',
    prop: 'cloudPlatformType',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '云平台名称',
    prop: 'cloudPlatformName',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '资源池名称',
    prop: 'resourcePoolName',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '所属项目',
    prop: 'projectName',
    check: true,
    disabled: false,
    width: '150'
  },
  {
    label: '描述',
    prop: 'description',
    check: true,
    disabled: false,
    width: '150'
  },
  {
    label: '创建时间',
    prop: 'createTime.date',
    check: true,
    disabled: false,
    width: '150'
  },
  { label: '标签', prop: 'tag', useSlot: true, check: true, disabled: false }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建安全组',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '删除', prop: 'delete', disabled: true, disabledText: '请先选择' },
  { title: '导出', prop: 'export', disabled: true, disabledText: '请先选择' },
  { title: '批量解绑标签', prop: 'unbindTag', disabled: false }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  } else if (value === 'unbindTag') {
    dialogType.value = 'unbindTag'
    showDialog.value = true
  }
}
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'refresh',
    icon: 'refresh-icon'
  },
  {
    prop: 'download',
    icon: 'download-icon'
  },
  {
    prop: 'setting',
    icon: 'setting-icon'
  }
]
const clickRightEvent = (value: string | number | object) => {
  if (value === 'setting') {
    drawerType.value = 'setting'
    showDrawer.value = true
  } else if (value === 'refresh') {
    getDataList()
  }
}

watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.ruleTextType = 'primary'
        item.showCopy = false
        item.operate = newOperate(item)
      })
    }
  }
)

// 根据每行数据状态判断操作是否禁用或存在
const newOperate = (item: any): IdealTableColumnOperate[] => {
  const tempArr = JSON.parse(JSON.stringify(operateBtns))
  return handleOperateByResourcePool(item, tempArr)
}

//华为公有云支持管理实例
const handleOperateByResourcePool = (
  item: any,
  array: IdealTableColumnOperate[]
) => {
  let resultArr: IdealTableColumnOperate[] = []
  //华为公有云和腾讯云支持管理实例功能
  if (
    item.cloudPlatformCategoryCode === 'PRIVATE' &&
    item.cloudPlatformTypeCode === 'HUAWEI_CLOUD'
  ) {
    resultArr = array.filter(item => item.prop !== 'relateInstance')
  } else {
    resultArr = array
  }
  return resultArr
}

const multipleSelection: any = ref([])
watch(
  () => state.dataListSelections,
  arr => {
    multipleSelection.value = arr
    leftButtons.value.forEach((item: any, index: number) => {
      item.disabled = index !== 0
      item.disabledText = '请至少选择安全组'
    })
    if (arr?.length) {
      leftButtons.value.forEach((item: any) => {
        item.disabled = false
        item.disabledText = ''
      })
    }
  },
  { deep: true }
)

const router = useRouter()
const clickDetail = (row: any, type: string) => {
  const {
    id, //安全组id
    uuid, //安全组uuid
    name,
    cloudPlatformTypeCode,
    cloudPlatformCategoryCode,
    vdcId,
    resourcePoolId,
    regionId,
    projectId
  } = row
  const data = Object.assign(
    {},
    {
      id,
      uuid,
      name,
      cloudPlatformTypeCode,
      cloudPlatformCategoryCode,
      vdcId,
      resourcePoolId,
      regionId,
      projectId,
      type
    }
  )
  router.push({
    path: '/multi-cloud/safe-group/detail',
    query: { ...data }
  })
}
const toRule = (row: any) => {
  clickDetail(row, 'enterRule')
}
//列表操作栏
const operateBtns: IdealTableColumnOperate[] = [
  { title: '配置规则', prop: 'enterRule' },
  { title: '管理实例', prop: 'relateInstance' },
  { title: '修改', prop: 'change' },
  { title: '删除', prop: 'delete' },
  { title: '标签管理', prop: 'associateTag' }
]
const rowData = ref({})
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  const data = JSON.stringify(Object.assign(row, { type: command }))
  if (command === 'enterRule') {
    clickDetail(row, command)
  } else if (command === 'relateInstance') {
    toInstance(row)
  } else if (command === 'change') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.change
  } else if (command === 'copy') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.copy
  } else if (command === 'delete') {
    showDialog.value = true
    dialogType.value = 'handleDelete'
  } else if (command === 'associateTag') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.associate
  }
}

const toInstance = (row: any) => {
  clickDetail(row, 'relateInstance')
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  if (dialogType.value === 'resourcePool') {
    dialogType.value = OperateEventEnum.create
  } else {
    showDialog.value = false
    getDataList()
  }
}

/**
 * 抽屉
 */
// 抽屉是否显示
const showDrawer = ref(false)
// 抽屉类型
const drawerType = ref('')
const onClickSubmit = (value: IdealTableColumnHeaders[]) => {
  const tempArr = value.filter((item: IdealTableColumnHeaders) => item.check)

  let array: IdealTableColumnHeaders[] = []
  headerArray.forEach((item: IdealTableColumnHeaders) => {
    tempArr.forEach((child: IdealTableColumnHeaders) => {
      if (child.prop === item.prop) {
        array.push(item)
      }
    })
  })
  tableHeaders.value = array
}
</script>

<style scoped lang="scss">
.safe-group {
  padding: $idealPadding;
  .ideal-theme-text {
    cursor: pointer;
  }
  .safe-group-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 3px;
  }
}
</style>
