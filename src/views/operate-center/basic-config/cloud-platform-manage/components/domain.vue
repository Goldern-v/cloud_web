<template>
  <div class="domain">
    <ideal-search
      ref="searchRef"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event as any, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import { ElMessage } from 'element-plus'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import {
  cloudPlatformDomainUrl,
  cloudPlatformDomainAdd
} from '@/api/java/operate-center'

const route = useRoute()
const cloudPlatformId = route.query.id as string

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '域名标识', prop: 'name', type: FiltrateEnum.input },
  { label: '域名名称', prop: 'domainName', type: FiltrateEnum.input }
])

const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {
    cloudPlatformId
  }
  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

// 获取搜索组件
const searchRef = ref()

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: cloudPlatformDomainUrl,
  deleteUrl: cloudPlatformDomainUrl,
  isPage: false,
  queryForm: {
    cloudPlatformId
  }
})

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  deleteHandle,
  getDataList
} = useCrud(state)

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '域名标识', prop: 'name' },
  { label: '域名名称', prop: 'domainName' },
  { label: '域名访问地址', prop: 'objectUrl' },
  { label: '协议类型', prop: 'protocol' }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '新增域名',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
])

const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'addDomain'
  }
}

const operateBtns = ref<IdealTableColumnOperate[]>([
  { title: '删除', prop: 'delete' }
])
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'delete') {
    deleteHandle(row.id, '/')
  }
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()

const clickCloseEvent = () => {
  showDialog.value = false
}

const clickRefreshEvent = (value: any) => {
  showDialog.value = false
  // 新增域名弹框此处调用添加接口 兼容弹框组件的使用
  if (dialogType.value === 'addDomain') {
    addDomain(value)
  } else {
    getDataList()
  }
}
const addDomain = (dic: any) => {
  const params = Object.assign(dic, { cloudPlatformId })
  cloudPlatformDomainAdd(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('域名添加成功')
      getDataList()
    } else {
      ElMessage.error('域名添加失败')
    }
  })
}
</script>

<style scoped lang="scss">
.domain {
  padding: $idealPadding;
}
</style>
