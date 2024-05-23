<template>
  <div class="relate-role">
    <div class="relate-role-box">
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
          <el-table-column label="操作" width="185">
            <template #default="props">
              <el-button
                v-auth="'sys:user:role'"
                link
                type="primary"
                @click="clickDelete(props.row)"
                >移除</el-button
              >
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm">{{ t('back') }}</el-button>
    </div>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :associated-role="state.dataList"
      :remove-roles="removeRoles"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import dialogBox from '../dialog-box.vue'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import { roleBindUserUrl } from '@/api/java/business-center'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '角色', prop: 'roleName', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {
    id: detailInfo.id
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
const state: IHooksOptions = reactive({
  dataListUrl: roleBindUserUrl,
  queryForm: {
    id: detailInfo.id
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '角色', prop: 'name' },
  { label: '描述', prop: 'remark' }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '关联角色',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white',
    authority: 'sys:user:role'
  },
  {
    title: '移除',
    prop: 'remove',
    disabled: true,
    disabledText: '请选择一个角色',
    authority: 'sys:user:role'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'relate-role'
  } else if (value === 'remove') {
    showDialog.value = true
    dialogType.value = 'remove-role'
  }
}

const removeRoles: any = ref([])
watch(
  () => state.dataListSelections,
  (val: any) => {
    removeRoles.value = val
    if (val.length) {
      leftButtons?.value.forEach((item: any, index: number) => {
        item.disabled = false
        item.disabledText = ''
      })
    } else {
      leftButtons?.value.forEach((item: any, index: number) => {
        item.disabled = index !== 0
        item.disabledText = '请选择一个角色'
      })
    }
  }
)
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
const clickDelete = (row: any) => {
  removeRoles.value = [row]
  showDialog.value = true
  dialogType.value = 'remove-role'
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}

const router = useRouter()
const cancelForm = () => {
  router.back()
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>

<style scoped lang="scss">
.relate-role {
  width: 100%;
  .relate-role-box {
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
