<template>
  <div class="relate-project">
    <div class="relate-project-box">
      <ideal-search
        ref="searchRef"
        :type-array="typeArray"
        :show-category="false"
        :show-platform-type="false"
        :show-resource-pool="false"
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
        ref="multipleTableRef"
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
      </ideal-table-list>
    </div>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm">{{ t('back') }}</el-button>
    </div>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :associated-project="state.dataList"
      :remove-projects="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus'
import { router } from '@/router'
import {
  OperateEventEnum,
  FiltrateEnum
} from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import {
  userRelatedProject,
  userRelateProject
} from '@/api/java/business-center'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '项目', prop: 'projectName', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {
    userId: detailInfo.id
  }

  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

const { t } = useI18n()
const route = useRoute()
const detailInfo = JSON.parse(route.query.detail as any)

// 列表
const multipleTableRef = ref()
const state: IHooksOptions = reactive({
  dataListUrl: userRelatedProject,
  queryForm: {
    userId: detailInfo?.id
  }
})

onMounted(() => {
  leftButtons.value[0].disabled = detailInfo.vdcId ? false : true
  leftButtons.value[0].disabledText = detailInfo.vdcId ? '' : '用户未关联vdc'
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '项目', prop: 'name' },
  { label: '所属VDC', prop: 'vdcName' },
  { label: '描述', prop: 'remark' }
]

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '关联项目',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white',
    authority: 'sys:user:project'
  },
  {
    title: '取消关联',
    prop: 'remove',
    disabled: true,
    disabledText: '请选择一个项目',
    authority: 'sys:user:project'
  }
])

watch(
  () => state.dataListSelections,
  (val: any) => {
    if (val.length) {
      leftButtons?.value.forEach((item: any, index: number) => {
        item.disabled = false
        item.disabledText = ''
      })
    } else {
      leftButtons?.value.forEach((item: any, index: number) => {
        item.disabled = index !== 0
        item.disabledText = '请选择一个项目'
      })
    }
  }
)
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'relate-project'
  } else if (value === 'remove') {
    showDialog.value = true
    dialogType.value = 'remove-project'
  }
}

// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'refresh',
    icon: 'refresh-icon'
  }
]
const searchRef = ref()
const clickRightEvent = (value: string | number | object) => {
  if (value === 'refresh') {
    searchRef.value.clickDeleteAll()
  }
}

const cancelForm = () => {
  router.back()
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
</script>

<style scoped lang="scss">
.relate-project {
  width: 100%;
  .relate-project-box {
    background-color: white;
    padding: $idealPadding;
  }
  .footer-button {
    margin-top: 5px;
    padding: 20px;
    background-color: white;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
