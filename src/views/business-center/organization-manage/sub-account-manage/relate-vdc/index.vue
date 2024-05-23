<template>
  <div class="relate-vdc">
    <div class="relate-vdc-box">
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
        :loading="state.dataListLoading"
        :table-data="tableData"
        :table-headers="tableHeaders"
        :show-pagination="false"
        :custom-assign="detailInfo.vdcId"
      >
      </ideal-table-list>
    </div>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm">{{ t('back') }}</el-button>
    </div>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :associated-vdc="tableData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage, ElMessageBox } from 'element-plus'
import dialogBox from '../dialog-box.vue'
import { FiltrateEnum, OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealButtonEventProp,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import { userRelateVdc } from '@/api/java/business-center'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: 'VDC', prop: 'vdcName', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {}

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
const tableData: any = ref([])
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: `iams/vdc/user/vdc/${detailInfo.id}`,
  isPage: false
})

const { getDataList } = useCrud(state)
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'VDC', prop: 'name' },
  { label: '上一级VDC', prop: 'parent.name' },
  { label: '描述', prop: 'remark' }
]

watch(
  () => state.dataList,
  arr => {
    if (arr) {
      tableData.value = [arr]
    }
  }
)
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '关联VDC',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white',
    authority: 'sys:user:vdc'
  },
  // {
  //   title: '取消关联VDC',
  //   prop: 'create',
  //   authority: 'sys:user:vdc'
  // }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'relate-vdc'
  } else if (value === 'remove') {
    ElMessageBox.confirm('确定要取消当前VDC与用户的关联关系吗？', '取消关联', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      // const res: any = await deleVdcNameNormApi(row)
      // if (res.code == 200) {
      //   ElMessage.success('删除成功')
      //   getDataList()
      // } else {
      //   ElMessage.error('删除失败')
      // }
    })
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

const selectVdc: any = ref({})
const submitForm = () => {
  const detailInfo = JSON.parse(route.query.detail as any)
  const userId = detailInfo.id
  const params = {
    vdcId: selectVdc.value?.id,
    vdcCode: selectVdc.value?.code
  }
  showLoading('关联中...')
  userRelateVdc(userId, params)
    .then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        ElMessage.success('关联VDC成功')
        router.back()
      } else {
        ElMessage.error('关联VDC失败')
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}

const router = useRouter()
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
.relate-vdc {
  width: 100%;
  .relate-vdc-box {
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
