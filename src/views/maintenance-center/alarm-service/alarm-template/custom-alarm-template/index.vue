<template>
  <div class="custom-alarm-template">
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

    <el-button type="primary" @click="clickCustomAlarmTemplate">
      <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
      创建自定义告警模板
    </el-button>

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
                :merge-data="props.row.mergeData"
                :merge-column="[0]"
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
            <ideal-table-operate
              :buttons="operateButtons"
              @clickMoreEvent="clickOperateEvent($event as any, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { ElMessage, ElMessageBox } from 'element-plus/es'
import type {
  IdealTableColumnHeaders,
  IdealTextProp,
  IdealTableColumnOperate,
  IdealSearch,
  IdealButtonEventProp
} from '@/types'
import { FiltrateEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { expenseTypeList } from '@/api/java/operate-center'
import {
  alarmTemplateUrl,
  alarmTemplateDelete
} from '@/api/java/maintenance-center'
import { dayjs } from 'element-plus'

const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: '资源类型', prop: 'resourceType', type: FiltrateEnum.list }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {
    type: 'CUSTOM'
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
  { label: '告警规则数', prop: 'rule', useSlot: true },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'createDate' }
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
    type: 'CUSTOM'
  }
})

const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)
watch(
  () => state.dataList,
  arr => {
    arr?.forEach((item: any) => {
      item.createDate = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      mergeTable(item)
    })
  }
)

/**
 * 列表合并
 */
const pos = ref(0)
const mergeTable = (row: any) => {
  if (!row.historyRuleConfigs) {
    return
  }

  row.mergeData = []
  for (let i = 0; i < row.historyRuleConfigs.length; i++) {
    if (i === 0) {
      row.mergeData.push(1)
      pos.value = 0
    } else {
      if (
        row.historyRuleConfigs[i].name == row.historyRuleConfigs[i - 1].name
      ) {
        row.mergeData[pos.value] += 1
        row.mergeData.push(0)
      } else {
        row.mergeData.push(1)
        pos.value = i
      }
    }
  }
}

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
//根据资源类型过滤列表
const filterResourceType = () => {}

const router = useRouter()
const clickCustomAlarmTemplate = () => {
  router.push({
    path: '/maintenance-center/alarm-service/custom-alarm-template/create',
    query: { type: 'create' }
  })
}
//侧边栏操作
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'delete') {
    ElMessageBox.confirm('确定要删除当前自定义模板吗？', '删除自定义模板', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        alarmTemplateDelete(row.id).then((res: any) => {
          let { code } = res
          if (code === 200) {
            getDataList()
            ElMessage.success('删除自定义模板成功')
          } else {
            ElMessage.success('删除自定义模板失败')
          }
        })
      })
      .catch(() => {
        ElMessage.info('取消删除自定义模板')
      })
  } else if (command === 'edit') {
    const data = JSON.stringify(row)
    router.push({
      path: '/maintenance-center/alarm-service/custom-alarm-template/create',
      query: { type: 'edit', data }
    })
  }
}
</script>

<style scoped lang="scss">
.custom-alarm-template {
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
