<template>
  <div class="ideal-table-list__container virtual-ip">
    <div class="flex-row virtual-ip__search">
      <ideal-select-search
        :search-type="SearchTypeEnum.title"
        prefix-title="模糊查询"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
      </ideal-select-search>
    </div>

    <el-divider />

    <el-button type="primary" @click="clickApplyVirtualIp">
      <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
      申请虚拟IP
    </el-button>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <ideal-table-operate
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
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum, OperateEventEnum } from '@/utils/enum'

/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '虚拟IP地址', prop: 'virtualIpAddress' },
  { label: '弹性的绑定公网IP', prop: 'bindIp' },
  { label: '绑定的服务器类型', prop: 'bindServerType' },
  { label: '绑定的服务器名称（网卡）', prop: 'bindServerName' },
  { label: '备注', prop: 'remark' }
]
state.dataList = [
  {
    virtualIpAddress: '192.168.0.11',
    bindIp: 'fe80::f816:3eff:fe9b:5f2d',
    bindServerType: 'fe80::f816:3eff:fe9b:5f2d',
    stabindServerNametus: 'network-card-00123',
    remark: 'xxxxxxx'
  }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { type: 'primary', title: '删除', prop: 'delete' }
]
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

const clickOperateEvent = (command: string | number | object, row: object) => {}
const clickApplyVirtualIp = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.apply
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  currentChangeHandle(state.page as number) // 查询当前页数据
}
</script>

<style scoped lang="scss">
.virtual-ip {
  width: 100%;
  padding: 20px;
  .virtual-ip__search {
    align-items: center;
    justify-content: flex-start;
    .virtual-ip__time-range {
      width: 30%;
      margin-right: 20px;
    }
  }
  .virtual-ip-table-title {
    color: var(--el-color-primary);
    cursor: pointer;
  }
  .virtual-ip-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
