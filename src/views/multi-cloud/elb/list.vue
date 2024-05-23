<template>
  <div class="ideal-main-container lbs">
    <div class="flex-row lbs__search">
      <ideal-select-search
        :options="searchOptions"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
      </ideal-select-search>
    </div>

    <el-divider />

    <ideal-button-events
      :left-btns="attrData.leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      is-multiple
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID" width="280" show-overflow-tooltip>
          <template #default="props">
            <div class="table-title" @click="handleRedirectDetail(props.row)">
              {{ props.row.name }}
            </div>

            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <!-- <template #serviceAddress>
        <el-table-column
          label="服务地址与所属网络"
          width="150"
          show-overflow-tooltip
        >
          <template #default="props">
            <div class="table-id">{{ props.row.ipAddress }}</div>
            <div class="table-title">{{ props.row.vpc }}</div>
          </template>
        </el-table-column>
      </template>

      <template #monitorListener>
        <el-table-column label="监听器(前端协议/端口)" show-overflow-tooltip>
          <template #default="props">
            <div v-if="!props.row.Ibs">
              <span class="table-desc ideal-default-margin-right">未添加监听器</span
              ><span class="table-title" @click="addListener">去添加</span>
            </div>
          </template>
        </el-table-column>
      </template> -->

      <template #operation>
        <el-table-column label="操作" width="230">
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
      :row-data="rowData"
      :multiple-selection="multipleSelection"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { clickCopy } from '@/utils/tool'
import dialogBox from './dialog-box.vue'
import { loadBalanceInfo } from './list'

const {
  state,
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  clickSearch,
  clickReset,
  searchOptions,
  tableHeaders,
  operateBtns,
  clickOperateEvent,
  clickLeftEvent,
  dialogType,
  attrData,
  handleRedirectDetail,
  clickRefreshEvent,
  clickCloseEvent,
  showDialog,
  rowData,
  multipleSelection,
  addListener
} = loadBalanceInfo()
</script>

<style scoped lang="scss">
.lbs {
  padding: $idealPadding;
  .lbs__search {
    align-items: center;
    justify-content: space-between;
  }
  .table-title {
    color: var(--el-color-primary);
    cursor: pointer;
  }
  .table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 3px;
  }
  .table-desc {
    color: $errorColor;
  }
}
</style>
