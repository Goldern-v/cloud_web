<template>
  <div class="history-container">
    <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #resourceType>
        <el-table-column>
          <template #header>
            <el-dropdown
              style="vertical-align: middle; font-size: 12px"
              @command="filterResourceType"
            >
              <span>
                资源类型
                <svg-icon icon="down-arrow"></svg-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(item, index) in resourceTypeList"
                    :key="index"
                    :command="item.code"
                    >{{ item.name }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #default="props">
            <span>{{ props.row.resourceTypeDes }}</span>
          </template>
        </el-table-column>
      </template>

      <template #thresholdRule>
        <el-table-column label="阈值规则" width="120">
          <template #default="props">
            <el-tooltip :content="props.row.overview" placement="top">{{
              props.row.alertConfigRuleName
            }}</el-tooltip>
          </template>
        </el-table-column>
      </template>

      <template #notifyObj>
        <el-table-column label="通知对象" width="120">
          <template #default="props">
            <div
              v-for="(item, index) in props.row.contactGroupNames"
              :key="index"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { expenseTypeList } from '@/api/java/operate-center'
import { alarmRecordPageUrl } from '@/api/java/maintenance-center'

const typeArray = ref<IdealSearch[]>([
  { label: '资源类型', prop: 'RESOURCE_TYPE', type: FiltrateEnum.list },
  { label: '日期', prop: 'date', type: FiltrateEnum.date }
])

const onClickSearch = (v: IdealTextProp[]) => {}

const route = useRoute()
const id = route.query.id
const state: IHooksOptions = reactive({
  dataListUrl: alarmRecordPageUrl,
  deleteUrl: '',
  queryForm: {
    ploy: 'DONE_CHECK',
    alertConfigId: id
  }
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '资源类型', prop: 'resourceType', useSlot: true },
  { label: '故障资源', prop: 'resourceName' },
  { label: '阈值规则', prop: 'thresholdRule', useSlot: true },
  { label: '发生时间', prop: 'endTriggerTimeDes' },
  { label: '触发次数', prop: 'triggerTimes' },
  { label: '通知对象', prop: 'notifyObj', useSlot: true },
  { label: '确认人', prop: 'checkUserName' },
  { label: '确认时间', prop: 'checkTimeDes' }
]

const { sizeChangeHandle, currentChangeHandle } = useCrud(state)

onMounted(() => {
  getExpenseType()
})
//根据资源类型过滤列表
const filterResourceType = () => {}
//请求资源类型
const resourceTypeList: any = ref([])
const getExpenseType = () => {
  expenseTypeList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        resourceTypeList.value = data
      } else {
        resourceTypeList.value = []
      }
    })
    .catch(_ => {
      resourceTypeList.value = []
    })
}
</script>

<style scoped lang="scss">
.history-container {
  padding: 20px;
  background-color: white;
}
</style>
