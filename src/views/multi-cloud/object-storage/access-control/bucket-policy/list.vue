<template>
  <div class="bucket-policy">
    <div class="flex-row bucket-policy-tip">
      <svg-icon icon="info-warning" class-name="info-warning" class="ideal-svg-margin-right"/>
      <div>OBS访问权限控制特性提供桶、目录、对象的访问权限控制，可对账户下的用户和其他账户进行操作级别的权限控制。</div>
    </div>

    <div class="bucket-policy-title ideal-middle-margin-top">桶策略</div>
    <div class="ideal-tip-text ideal-middle-margin-bottom">桶策略提供基于各种条件的集中访问控制，可以与ACL共同作用，如果授权产生冲突，以桶策略大于桶ACL的优先级决定授权结果。</div>

    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      ref="multipleTableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
      @expandChange="expandChange"
    >
      <template #expandTable>
        <el-table-column type="expand">
        </el-table-column>
      </template>

      <template #user>
        <el-table-column label="被授权用户">
          <template #default="props">
            <div>{{ props.row.user }}</div>
            <div v-if="showExpand">{{ props.row.userContent }}</div>
          </template>
        </el-table-column>
      </template>

      <template #resource>
        <el-table-column label="授权资源">
          <template #default="props">
            <div>{{ props.row.user }}</div>
            <div v-if="showExpand">
              <div v-for="(item,idx) of props.row.resourceContent" :key="idx">{{ item }}</div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'

const showExpand = ref(false)
const expandChange = () => {
  showExpand.value = !showExpand.value
}
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'id' }
]

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)

state.dataList = [
  { name: 'test01', potency: '允许', user: '包含所有用户', userContent: '*/', resource: '包含当前桶、桶内所有对象', resourceContent: ['-11231313', '-11231313/*'], operation: '包含5个动作', condition: '无条件'}
]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '策略名称', prop: 'name' },
  { label: '效力', prop: 'potency' },
  { label: '被授权用户', prop: 'user', useSlot: true },
  { label: '授权资源', prop: 'resource', useSlot: true },
  { label: '授权操作', prop: 'operation' },
  { label: '条件', prop: 'condition' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '修改', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'change') {
    // showDialog.value = true
    // dialogType.value = OperateEventEnum.change
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { 
    title: '创建',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '复制', prop: 'copy' }
])
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  } else if (value === 'copy') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.copy
  } 
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = ''
}
</script>

<style scoped lang="scss">
.bucket-policy {
  background-color: white;
  padding: $idealPadding;
  :deep(.info-warning) {
    color: var(--el-color-primary);
  }
  .bucket-policy-tip {
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary);
    padding: 10px;
  }
  .bucket-policy-title {
    font-size: $largeFontSize;
    font-weight: 500;
  }
}
</style>
