<template>
  <div class="default-alarm-template">
    <ideal-search
      ref="searchRef"
      :type-array="typeArray"
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      @clickSearch="onClickSearch"
    >
      <template #right-btn>
        <ideal-button-events
          :right-btns="rightButtons"
          @clickRightEvent="clickRightEvent"
        />
      </template>
    </ideal-search>

    <el-divider border-style="solid" />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #expandTable>
        <el-table-column type="expand">
          <template #default="props">
            <div class="expandTable">
              <ideal-detail-info
                :label-array="expandOptions"
                :item-number="2"
                :detail-info="props.row"
                label-position="left"
                class="ideal-large-margin-top"
              ></ideal-detail-info>
              <ideal-table-list
                :table-data="props.row.historyRuleConfigs"
                :table-headers="expandTableHeaders"
                :show-pagination="false"
                show-border
              >
              </ideal-table-list>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #rule>
        <el-table-column label="告警规则数">
          <template #default="props">
            <div>
              {{ props.row.historyRuleConfigs?.length }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <el-button link type="primary" @click="copyOperate(props.row)"
              >复制</el-button
            >
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
    >
    </dialog-box>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import type {
  IdealTableColumnHeaders,
  IdealTextProp,
  IdealSearch,
  IdealButtonEventProp
} from '@/types'
import { OperateEventEnum, FiltrateEnum, EventEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { expenseTypeList } from '@/api/java/operate-center'
import dialogBox from './dialog-box.vue'
import { alarmTemplateUrl } from '@/api/java/maintenance-center'

const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: '资源类型', prop: 'resourceType', type: FiltrateEnum.list }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {
    type: 'DEFAULT'
  }
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      if (item.prop === 'resourceType') {
        const result = resourceTypeList.value.find(
          (item: any) => item.name === temp[1]
        )
        state.queryForm.resourceType = result?.code
      } else {
        state.queryForm[item.prop] = temp[1]
      }
    })
  }
  getDataList()
}

// 列表右侧按钮
const rightButtons = ref<IdealButtonEventProp[]>([
  { prop: 'refresh', icon: 'refresh-icon' }
])

const searchRef = ref()
const clickRightEvent = (value: string | number | object) => {
  if (value === 'refresh') {
    searchRef.value.clickDeleteAll()
  }
}
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '模板名称', prop: 'name' },
  { label: '描述', prop: 'typeDes' },
  { label: '资源类型', prop: 'resourceTypeDes' },
  { label: '告警规则数', prop: 'rule', useSlot: true }
]
const expandOptions: IdealTextProp[] = [
  { label: '名称', prop: 'name' },
  { label: '资源类型', prop: 'resourceTypeDes' },
  { label: '描述', prop: 'remark' }
]
const expandTableHeaders: IdealTableColumnHeaders[] = [
  { label: '规则名称', prop: 'name' },
  { label: '规则描述', prop: 'overview' },
  { label: '告警级别', prop: 'reportLevelDes' }
]
const state: IHooksOptions = reactive({
  dataListUrl: alarmTemplateUrl,
  deleteUrl: '',
  queryForm: {
    type: 'DEFAULT'
  }
})
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

onMounted(() => {
  getExpenseType()
})
const resourceTypeList: any = ref([])
const getExpenseType = () => {
  expenseTypeList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        const typeItem = typeArray.value.find(
          (item: IdealSearch) => item.prop === 'resourceType'
        )
        typeItem!.array = data
        typeItem!.arrayKey = 'code'
        typeItem!.arrayProp = 'name'
        resourceTypeList.value = data
      } else {
        resourceTypeList.value = []
      }
    })
    .catch(_ => {
      resourceTypeList.value = []
    })
}

const rowData = ref({})
const copyOperate = (row: any) => {
  rowData.value = row
  showDialog.value = true
  dialogType.value = OperateEventEnum.copy
}

interface EventEmits {
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()
/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  emit(EventEnum.refresh)
}
</script>

<style scoped lang="scss">
.default-alarm-template {
  background-color: #fff;
  .flex-row-center {
    align-items: center;
    justify-content: center;
  }
  .expandTable {
    padding: 0 $idealPadding;
  }
  ul {
    flex-wrap: wrap;
    li {
      width: 50%;
      list-style-type: none;
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
