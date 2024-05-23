<template>
  <div class="bucket-acl">
    <div class="bucket-acl-title-weight">桶ACLs</div>
    <div class="ideal-tip-text ideal-middle-margin-bottom">桶ACL是基于账号或用户组的桶级访问控制，桶的拥有者可以通过桶ACL授予指定账号或用户组特定的访问权限。</div>

    <div class="bucket-acl-title">公共权限</div>
    <el-radio-group v-model="publicAuth">
      <el-radio label="private">私有</el-radio>
      <el-radio label="publicRead">公共读</el-radio>
      <el-tag class="ideal-default-margin-right" type="warning">中风险</el-tag>
      <el-radio label="publicReadWrite">公共读写</el-radio>
      <el-tag type="danger">高风险</el-tag>
    </el-radio-group>

    <div class="bucket-acl-title ideal-middle-margin-top">用户权限</div>
    <ideal-select-search
      class="ideal-middle-margin-top"
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
    >
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

const publicAuth = ref('private')
watch(() => publicAuth.value, value => {
  if (value === 'publicReadWrite') {
    showDialog.value = true
    dialogType.value = 'publicReadWrite'
  } else if (value === 'publicRead') {
    showDialog.value = true
    dialogType.value = 'publicRead'
  }
})

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
  { type: '拥有者', account: '377868a8f7e802564a8c43', bucketAuth: '读取权限｜写入权限', aclAuth: '读取权限｜写入权限' },
  { type: '匿名用户', account: '--', bucketAuth: '--', aclAuth: '--' },
  { type: '日志投递用户组', account: '--', bucketAuth: '--', aclAuth: '--' }
]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '用户类型', prop: 'type' },
  { label: '账号', prop: 'account' },
  { label: '桶访问权限', prop: 'bucketAuth' },
  { label: 'ACL访问权限', prop: 'aclAuth' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' }
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
    title: '增加',
    prop: 'add',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '导出', prop: 'export' }
])
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'add') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.add
  }
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  if (publicAuth.value === 'publicReadWrite') {
    publicAuth.value = 'private'
  } else if (publicAuth.value === 'publicRead') {
    publicAuth.value = 'private'
  }
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
.bucket-acl {
  background-color: white;
  padding: $idealPadding;
  .bucket-acl-title, .bucket-acl-title-weight {
    font-size: $largeFontSize;
  }
  .bucket-acl-title-weight {
    font-weight: 500;
  }
}
</style>
