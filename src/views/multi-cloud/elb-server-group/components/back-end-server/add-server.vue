<template>
  <div class="add-server">
    <div class="flex-row custom-tip-box">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-large-margin-right"
      ></svg-icon>
      <ul>
        <li>
          后端服务器组关联独享型ELB实例，后端服务器安全组规则必须放通ELB后端子网所属网段（默认情况与ELB所在子网一致），否则会导致业务不可用，健康检查异常
        </li>
        <li>
          后端服务器组关联共享型ELB实例，后端服务器安全组规则必须放通100.125.0.0/16网段，否则会导致业务不可用，健康检查异常。
        </li>
        <li>使用扩展网卡之前，请先配置路由策略。</li>
      </ul>
    </div>
    <svg-icon
      icon="info-warning"
      color="var(--el-color-primary)"
      class="ideal-default-margin-right"
    ></svg-icon>
    <span
      >您最多可以添加500个后端服务器，如需中请更多配额请点击<span
        style="color: var(--el-color-primary); cursor: pointer"
        >申请扩大配额。购买云服务器</span
      ></span
    >
    <el-input placeholder="默认按照关键字搜索过滤" class="ideal-large-margin-top">
      <template #suffix>
        <svg-icon icon="search-icon"></svg-icon>
      </template>
    </el-input>

    <ideal-table-list
      ref="multipleTableRef"
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
      <template #cloudServer>
        <el-table-column label="云服务器">
          <template #default="props">
            <p>{{ props.row.name }}</p>
            <p>{{ props.row.uuid }}</p>
          </template>
        </el-table-column>
      </template>

      <template #specification>
        <el-table-column label="规格">
          <template #default="props">
            <p>{{ props.row.cpu }}vCPUs | {{ props.row.memory }}GB</p>
            <p>{{ props.row.specification }}</p>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div>已选择：{{ state.dataListSelections?.length }}个对象</div>

    <el-tag
      v-for="tag in selectServer"
      :key="tag.name"
      closable
      type="info"
      class="ideal-large-margin-top"
      @close="closeTag(tag)"
    >
      <p>{{ tag.name }}</p>
      <p>{{ tag.uuid }}</p>
    </el-tag>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelBtn">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitBtn">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { useCrud } from '@/hooks'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
/**
 * 云服务器列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
state.dataList = [
  {
    name: 'VPN跳板不要动',
    uuid: 'wdw7-3e7x-2sxs-29sy',
    cpu: '2',
    memory: '4',
    specification: 'c7.large.2',
    privateIp: '192.168.0.211'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '云服务器', prop: 'cloudServer', useSlot: true },
  { label: '规格', prop: 'specification', useSlot: true },
  { label: '私网IP地址', prop: 'privateIp' }
]
const { sizeChangeHandle, currentChangeHandle, selectionChangeHandle } =
  useCrud(state)

const selectServer: any = ref([])
watch(
  () => state.dataListSelections,
  arr => {
    selectServer.value = arr
  }
)

const multipleTableRef = ref()
//关闭监控指标的tag标签，同时取消选中该项
const closeTag = (tag: any) => {
  let obj = state.dataList?.find((item: any) => item.uuid === tag.uuid)
  multipleTableRef.value.IdealTableList.toggleRowSelection(obj, undefined)
}

interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelBtn = () => {
  emit(EventEnum.cancel)
}

const submitBtn = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.custom-tip-box {
  background-color: var(--custom-information-bg-color);
  border: 1px solid var(--el-color-primary);
  padding: 15px 20px;
  margin-bottom: 20px;
  ul li {
    line-height: 24px;
    span {
      color: var(--el-color-primary);
      cursor: pointer;
    }
  }
}
.el-tag {
  width: 33%;
  padding: 20px 15px;
  justify-content: space-between;
  p {
    line-height: 20px;
  }
}
</style>
