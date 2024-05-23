<template>
  <div>
    <div class="flex-row ideal-large-margin domain-name_tip">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <ul>
        <li>温馨提示</li>
        <li>
          1、使用大陆节点服务器开展网站服务，需要将域名网站进行备案，否则将无法正常访问；<el-text
            type="primary"
          >
            查看详情</el-text
          >
        </li>
        <li>
          2、新注册域名请进行实名认证，否则会被注册局暂停解析（Serverhold），无法正常访问，待域名实名认证通过后方可恢复正常<el-text
            type="primary"
          >
            查看详情</el-text
          >
        </li>
      </ul>
    </div>
    <div class="ideal-main-container domain-name">
      <div class="flex-row domain-name__search">
        <ideal-select-search
          :search-type="SearchTypeEnum.title"
          prefix-title="模糊查询"
          @clickSearch="clickSearch"
          @clickReset="clickReset"
        >
        </ideal-select-search>
      </div>

      <el-divider />

      <div class="ideal-tip-text">
        您还可以创建{{ 50 - (state.dataList as any[])?.length }}个公网域名。
      </div>

      <ideal-button-events
        :left-btns="leftButtons"
        :left-max-buttons="3"
        more-title="批量操作"
        class="ideal-default-margin-top"
        @clickLeftEvent="clickLeftEvent"
        @clickRightEvent="clickRightEvent"
      >
      </ideal-button-events>

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
          <el-table-column label="域名">
            <template #default="props">
              <ideal-text-copy
                :row="props.row"
                label-key="name"
                copy-key="name"
                style="color: var(--el-color-primary); cursor: pointer"
                @mouseEnterEvent="value => (props.row.showCopy = value)"
                @mouseLeaveEvent="value => (props.row.showCopy = value)"
                @click="clickRedirectDetail(props.row)"
              />
            </template>
          </el-table-column>
        </template>

        <template #status>
          <el-table-column label="状态">
            <template #default="props">
              <ideal-status-icon
                :status-icon="props.row.statusIcon"
                :status-text="props.row.statusText"
              ></ideal-status-icon>
            </template>
          </el-table-column>
        </template>

        <template #operation>
          <el-table-column label="操作" width="185">
            <template #default="props">
              <ideal-table-operate
                :max-buttons="3"
                :buttons="operateBtns"
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
        :multiple-selection="state.dataListSelections"
        @clickCloseEvent="clickCloseEvent"
        @clickRefreshEvent="clickRefreshEvent"
      ></dialog-box>
    </div>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, SearchTypeEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'
import store from '@/store'

const { resourcePoolInfo, regionInfo } = storeToRefs(store.resourceStore)
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {
    resourcePoolId: resourcePoolInfo.value?.id,
    regionId: regionInfo.value?.id,
    projectId: store.resourceStore.projectId,
    vdcId: store.userStore.user.vdcId
  }
})
const {
  sizeChangeHandle,
  currentChangeHandle,
  selectionChangeHandle,
  getDataList
} = useCrud(state)

state.dataList = [
  {
    id: '1',
    name: 'cloudjtc.com',
    status: 'active',
    statusText: '正常',
    statusIcon: 'status-success',
    recordSetCount: 1,
    tags: '--',
    ttl: 300,
    createTime: '2023/04/30 22:39:20'
  },
  {
    id: '2',
    name: 'idealsc.cn',
    status: 'active',
    statusText: '正常',
    statusIcon: '',
    recordSetCount: 1,
    tags: '--',
    ttl: 300,
    createTime: '2023/04/30 22:39:20'
  }
]

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.name = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  getDataList()
}
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'uuid' }
]
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '域名', prop: 'name', useSlot: true },
  { label: 'DNS服务器地址', prop: 'status' },
  { label: '记录集个数', prop: 'recordSetCount' },
  { label: '标签', prop: 'tags' },
  { label: '邮箱', prop: 'email' },
  { label: 'TTL(秒)', prop: 'ttl' },
  { label: '创建时间', prop: 'createTime' },
  { label: '最近修改时间', prop: 'updateTime' },
  { label: '描述', prop: 'remark' }
]
// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '管理解析', prop: 'manageAnalysis' },
  { title: '暂停', prop: 'pause' },
  { title: '转移域名', prop: 'transferDomainName' },
  { title: '修改', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]

const rowData: any = ref({})
const clickOperateEvent = (command: string | number | object, row: object) => {
  rowData.value = row
  const detail = JSON.stringify(row)
  if (command === 'edit') {
    dialogType.value = OperateEventEnum.edit
    showDialog.value = true
  } else if (command === 'associateTag') {
    dialogType.value = OperateEventEnum.associate
    showDialog.value = true
  } else if (command === 'manageAnalysis') {
    router.push({
      path: '/multi-cloud/dns/manage-analyze',
      query: {
        detail
      }
    })
  } else if (command === 'pause') {
    dialogType.value = 'pause'
    showDialog.value = true
  } else if (command === 'transferDomainName') {
    const detail = JSON.stringify(Object.assign(row, { type: 'command' }))
    router.push({
      path: '/multi-cloud/dns/batch-operate',
      query: { type: command, detail }
    })
  } else if (command === 'delete') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建公网域名',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  {
    title: '删除',
    prop: 'delete',
    disabled: true,
    disabledText: '请选择要删除的域名'
  },
  {
    title: '批量添加域名',
    prop: 'addDomainName'
  },
  {
    title: '批量添加记录集',
    prop: 'addRecordSet'
  },
  {
    title: '批量删除记录集',
    prop: 'deleteRecordSet'
  },
  {
    title: '批量转移域名',
    prop: 'transferDomainName'
  },
  {
    title: '批量操作记录',
    prop: 'operateRecord'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  const tabs = [
    'addDomainName',
    'addRecordSet',
    'deleteRecordSet',
    'transferDomainName',
    'operateRecord'
  ]
  if (value === 'create') {
    clickVpcCreate()
  } else if (value === 'delete') {
    rowData.value = {}
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  } else if (tabs.includes(value as string)) {
    router.push({
      path: '/multi-cloud/dns/batch-operate',
      query: { type: value as string }
    })
  }
}

watch(
  () => state.dataListSelections,
  arr => {
    if (arr?.length) {
      {
        leftButtons.value[1].disabled = false
        leftButtons.value[1].disabledText = ''
      }
    } else {
      leftButtons.value[1].disabled = true
      leftButtons.value[1].disabledText = '请选择要删除的域名'
    }
  }
)
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'download',
    icon: 'download-icon'
  },
  {
    prop: 'setting',
    icon: 'setting-icon'
  }
]
const clickRightEvent = (value: string | number | object) => {}

const router = useRouter()
const clickVpcCreate = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.create
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
// 详情
const clickRedirectDetail = (row: object) => {
  const detail = JSON.stringify(row)
  router.push({
    path: '/multi-cloud/dns/manage-analyze',
    query: {
      detail
    }
  })
}
</script>

<style scoped lang="scss">
.domain-name_tip {
  background-color: var(--custom-information-bg-color);
  border: 1px solid var(--el-color-primary);
  padding: 15px 20px;
  ul {
    li {
      list-style-type: none;
    }
  }
}
.domain-name {
  // width: 100%;
  padding: $idealPadding;

  // 修改列表高度
  :deep(.el-table) {
    height: calc(
      100vh - var(--navigation-bar-height) - var(--theme-header-height) - 40px -
        40px - 52px - 20px - 32px - 65px
    );
  }
}
</style>
