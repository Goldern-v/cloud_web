<template>
  <div class="ideal-main-container service-catalog">
    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      prefix-title="名称"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
    </ideal-select-search>

    <el-divider border-style="solid" />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
      :pagination-type="PaginationTypeEnum.totalSizes"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #name>
        <el-table-column label="名称">
          <template #default="props">
            <div class="flex-row" style="align-items: center;">
              <el-image style="width: 15px; height: 15px; margin-right: 5px;" :src="props.row.icon" />
              <div>{{ props.row.name }}</div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <div @click="clickSwitchStatus(props.row)">
              <el-switch
                v-model="props.row.status"
              />
            </div>
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="185">
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
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus/es'
import dialogBox from './dialog-box.vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import {
  SearchTypeEnum,
  PaginationTypeEnum,
  OperateEventEnum
} from '@/utils/enum'
import type { IdealTableColumnHeaders, IdealTableColumnOperate, IdealButtonEventProp } from '@/types'
import { serviceCategoryPageUrl, serviceCategoryUpdate, serviceCategoryUrl } from '@/api/java/operate-center'

//  列表搜索值
const searchValue = ref('')
const state: IHooksOptions = reactive({
  dataListUrl: serviceCategoryPageUrl,
  deleteUrl: serviceCategoryUrl,
  queryForm: {}
})
const {
  sizeChangeHandle,
  currentChangeHandle,
  deleteHandle,
  getDataList
} = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '顺序', prop: 'sort', width: '50' },
  { label: '名称', prop: 'name', useSlot: true },
  { label: '描述', prop: 'remark' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '创建者', prop: 'creator.name' },
  { label: '创建时间', prop: 'createTime.date' }
]
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete', disabled: false, disabledText: '内置服务禁止删除操作' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'delete') {
    deleteHandle(row.id, '/', '确定要删除当前目录配置吗？', '删除目录配置')
  } else if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
    rowData.value = row
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建目录配置',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  }
}
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.name = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.queryForm = {}
  getDataList()
}
// 状态切换
const clickSwitchStatus = (val: any) => {
  const params = {
    id: val.id,
    status: val.status
  }
  serviceCategoryUpdate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('更新状态成功')
    } else {
      ElMessage.error('更新状态失败')
    }
  }).catch(_ => {
    ElMessage.error('更新状态失败')
  })
}
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.operate = newOperate(item)
      })
    }
  }
)
// 根据每行数据状态判断操作是发布还是取消发布
const newOperate = (item: any): IdealTableColumnOperate[] => {
  const resultArr: IdealTableColumnOperate[] = JSON.parse(JSON.stringify(operateBtns))
  if (item.custom === 0) { // 内置
    resultArr[1].disabled = true
  } else if (item.custom === 0) {
    resultArr[1].disabled = false
  }
  return resultArr
}
/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const rowData = ref({}) //行数据
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  dialogType.value = ''
  getDataList()
}
</script>
<style lang="scss" scoped>
.service-catalog {
  padding: $idealPadding;
}
</style>
