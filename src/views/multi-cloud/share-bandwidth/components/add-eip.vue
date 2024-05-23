<template>
  <div class="add-eip">
    <div class="add-eip-tip">
      <div class="flex-row">
        <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-default-margin-right"></svg-icon>
        <div>
          <div>弹性公网IP和IPv6网卡添加到共享带宽后，原本的带宽峰值无效，并和共享带宽相同：5Mbit/s。</div>
          <div>原本的计费方式无效，不额外计流量和带宽费用。</div>
          <div>包年/包月弹性公网IP暂时不支持添加到共享带宽。</div>
          <div>当前共享带宽的线路类型为普通带宽，可添加的EIP线路类型为全动态BGP、静态BGP。</div>
        </div>
      </div>
    </div>

    <div class="flex-row add-eip-info">
      <div class="">共享带宽：</div>
      <div>
        <div>{{ rowData.name }}</div>
        <div>当前共享带宽还可以添加弹性IP数:{{ availableIP }}</div>
        <div>单个共享带宽最多可以添加弹性IP的个数：20</div>
      </div>
    </div>

    <div class="flex-row add-eip-type">
      <div>公网IP：</div>
      <el-radio-group v-model="eipType" size="small">
        <el-radio-button label="IPv4">弹性公网IP</el-radio-button>
        <el-radio-button label="IPv6">IPv6网卡</el-radio-button>
      </el-radio-group>
    </div>

    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
    </ideal-table-list>

    <div class="flex-row add-eip-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()
interface AddEipProp {
  rowData?: any
}
const props = withDefaults(defineProps<AddEipProp>(), {
  rowData: () => ({})
})

// 可添加弹性IP数
const availableIP = computed(() => {
  let ipNumber = 0
  if (props.rowData) {
    let ipArr = props.rowData.ip.split(',')
    ipNumber = ipArr.length
  }
  return 20 - ipNumber
})

const eipType = ref('IPv4') // 弹性IP选择
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle, getDataList } =
  useCrud(state)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP', prop: 'ip' },
  { label: 'IPv6地址', prop: 'ipv6' },
  { label: '状态', prop: 'status' },
  { label: '类型', prop: 'name' },
  { label: '共享带宽', prop: 'boundResourceName' },
  { label: '已绑定实例', prop: 'bandwidth' }
]
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'uuid' }
]
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.add-eip {
  width: 100%;
  .add-eip-tip {
    background-color: var(--el-color-primary-light-9);
    padding: 20px;
    border-radius: $circleRadiusSize;
    border: 1px solid var(--el-color-primary);
  }
  .add-eip-info {
    margin: 10px 0;
  }
  .add-eip-type {
    margin: 10px 0;
    align-items: center;
  }
  .add-eip-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
}
</style>
