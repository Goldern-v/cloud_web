<template>
  <div class="ideal-main-container cloud-host">
    <ideal-search
      :exit-search-result="exitSearchResult"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    ></ideal-search>

    <el-divider />

    <ideal-button-events
      :left-btns="attrData.leftButtons"
      :right-btns="attrData.rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    />

    <ideal-table-list
      ref="cloudHostTableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID" width="280" show-overflow-tooltip>
          <template #default="props">
            <el-button
              link
              type="primary"
              :disabled="props.row.statusIcon === 'loading'"
              @click="handleRedirectDetail(props.row)"
              >{{ props.row.name }}</el-button
            >

            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #osType>
        <el-table-column label="操作系统" width="120">
          <template #default="props">
            <div class="flex-row">
              <svg-icon
                v-if="props.row?.image?.osType"
                :icon="props.row.osType"
                class="ideal-svg-margin-right"
              />
              <el-tooltip
                effect="dark"
                placement="top-start"
                :content="'镜像：'+props.row?.image?.osVersion">
                <div>{{ props.row?.image?.platform }}</div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态" width="120">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            />
          </template>
        </el-table-column>
      </template>

      <template #spec>
        <el-table-column label="规格" show-overflow-tooltip>
          <template #default="props">
            <div v-if="props.row.flavor.uuid">{{ props.row.flavor.name }}</div>
            <div v-if="props.row.flavor.vcpus">
              {{ props.row.flavor.vcpus }}核｜{{ props.row.flavor.ram }}G
            </div>
          </template>
        </el-table-column>
      </template>

      <template #ipAddress>
        <el-table-column label="IP地址" width="150" show-overflow-tooltip>
          <template #default="props">
            <ip-address
              :data-array="props.row.nicList"
              @mouseEnterPrivate="
                value => (props.row.nicList[0].privateIpCopy = value)
              "
              @mouseLeavePrivate="
                value => (props.row.nicList[0].privateIpCopy = value)
              "
              @mouseEnterPublic="
                value => (props.row.nicList[0].eip.publicIpCopy = value)
              "
              @mouseLeavePublic="
                value => (props.row.nicList[0].eip.publicIpCopy = value)
              "
            />
          </template>
        </el-table-column>
      </template>

      <template #tag>
        <el-table-column label="标签" width="150">
          <template #default="props">
            <ideal-tag-show :row="props.row"></ideal-tag-show>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
              :mode="MoreOperateEnum.cascaderPanel"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="attrData.rowData"
      :select-data="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />

    <ideal-set-table-header
      :show-drawer="showDrawer"
      :data-array="headerArray"
      @update:showDrawer="showDrawer = $event"
      @onClickSubmit="onClickSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import ipAddress from './components/ip-address.vue'
import { existPropWithArray } from '@/utils/tool'
import { MoreOperateEnum } from '@/utils/enum'
import { useList } from './list'

const {
  headerArray,
  state,
  tableHeaders,
  sizeChangeHandle,
  currentChangeHandle,
  selectionChangeHandle,
  handleRedirectDetail,
  clickLeftEvent,
  clickRightEvent,
  clickOperateEvent,
  loopUpdateList,
  onClickSubmit,
  showDialog,
  dialogType,
  attrData,
  showDrawer,
  typeArray,
  onClickSearch,
  exitSearchResult
} = useList()

const clickCloseEvent = () => {
  showDialog.value = false
  attrData.rowData = {}
}
const router = useRouter()
const cloudHostTableRef = ref()
const clickRefreshEvent = () => {
  showDialog.value = false
  attrData.rowData = {}
  cloudHostTableRef.value.IdealTableList.clearSelection()

  if (dialogType.value === 'resourcePool') {
    router.push({ path: '/multi-cloud/cloud-host/create' })
  }

  const existLoading = existPropWithArray(
    'loading',
    state?.dataList as any[],
    'statusIcon'
  )
  // 列表存在创建中、配置变更中,则不用再调一次 次数轮询方法
  if (existLoading) {
    return
  }
  // 重启、开机、关机后状态改变 调用轮询
  loopUpdateList()
}
</script>

<style scoped lang="scss">
.cloud-host {
  padding: $idealPadding;
  :deep(.el-date-editor) {
    --el-date-editor-daterange-width: 280px;
  }
  :deep(.el-date-editor.el-input__wrapper) {
    height: 34px;
  }
}
</style>
