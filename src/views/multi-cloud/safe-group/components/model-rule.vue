<template>
  <div class="model-rule">
    <el-tabs v-model="activeName" @tab-click="tabChange">
      <el-tab-pane
        v-for="item in tabControllers"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="ruleList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      @handleSelectionChange="selectionChangeHandle"
    >
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import store from '@/store'
import type { TabsPaneContext } from 'element-plus'
import { querySafeGroupModelRule } from '@/api/java/network'

// 属性值
interface modelRuleProps {
  ruleTemplate?: string // 所选创建模板
  customRule?: any
  formData?: any
}

const props = withDefaults(defineProps<modelRuleProps>(), {
  ruleTemplate: '',
  customRule: () => ({}),
  formData: () => ({})
})

const activeName = ref('ingress')
const tabControllers = ref([
  { label: '入方向', name: 'ingress' },
  { label: '出方向', name: 'egress' }
])

const templateMode = computed(() => props.ruleTemplate)

const { resourcePool } = store.resourceStore

/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: querySafeGroupModelRule,
  deleteUrl: '',
  isPage: false,
  queryForm: {
    resourcePoolId: resourcePool?.resourcePoolId,
    ruleModel: templateMode
  },
  createdIsNeed: false
})

watch(
  () => [props.formData.regionId, props.formData.projectId],
  ([region, project]) => {
    if (region && project) {
      state.queryForm.regionId = region
      state.queryForm.projectId = project
      getDataList()
    }
  }
)

watch(
  () => props.formData.name,
  value => {
    state.dataList?.forEach(item => {
      item.address =
        item.sourceAddressType === '1'
          ? item.remoteIpPrefix
          : item.sourceAddressType === '2'
          ? item.remoteAddressGroupId
          : props.formData.name
    })
  }
)
const { selectionChangeHandle, getDataList } = useCrud(state)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '优先级', prop: 'priority' },
  { label: '策略', prop: 'strategy' },
  { label: '类型', prop: 'ethertype' },
  { label: '协议端口', prop: 'protocolPort' },
  { label: '源地址', prop: 'address' }
]

const ruleList: any = ref([]) //列表展示方向
const allRuleList: any = ref([]) //所有方西规则
const entryRules: any = ref([]) //入方向规则
const exitRules: any = ref([]) //出方向规则
watch(
  () => state.dataList,
  arr => {
    arr?.forEach((item: any) => {
      item.strategy = item.action === 'allow' ? '允许' : '拒绝'
      item.protocolPort =
        item.protocol === 'all'
          ? '全部'
          : item.protocol.toUpperCase() +
            ':' +
            (item.multiport === 'all' ? '全部' : item.multiport)
      item.address =
        item.sourceAddressType === '1'
          ? item.remoteIpPrefix
          : item.sourceAddressType === '2'
          ? item.remoteAddressGroupId
          : props.formData.name
    })
    allRuleList.value = arr //用于传参
    if (props.ruleTemplate === 'QADD_PORT') {
      ruleList.value = arr?.filter(
        (item: any) =>
          item.direction === activeName.value && item.inboundRules === '0'
      )
      entryRules.value = arr?.filter(
        (item: any) => item.direction === 'ingress' && item.inboundRules === '0'
      )
      exitRules.value = arr?.filter(
        (item: any) => item.direction === 'egress' && item.inboundRules === '0'
      )
    } else {
      ruleList.value = arr?.filter(
        (item: any) => item.direction === activeName.value
      )
    }
  }
)
watch(
  () => props.ruleTemplate,
  () => {
    getDataList()
  }
)

watch(
  () => props.customRule,
  rule => {
    const arr = rule.checkedDataBase
      .concat(rule.checkedRemoteLogin)
      .concat(rule.checkedWebServer)
    const rules = arr.map((item: string) => {
      const index = item.indexOf('(')
      return item.substring(0, index)
    })
    const arr1 = allRuleList.value.filter(
      (item: any) =>
        rules.some((ele: any) => ele === item.bulidRule) ||
        item.inboundRules === '0'
    )
    entryRules.value = arr1?.filter((item: any) => item.direction === 'ingress')
    if (activeName.value === 'ingress') {
      ruleList.value = entryRules.value
    }
  },
  { deep: true }
)

const tabChange = (tab: TabsPaneContext, event: Event) => {
  if (props.ruleTemplate !== 'QADD_PORT' || tab.paneName === 'egress') {
    ruleList.value = state.dataList?.filter(
      (item: any) => item.direction === tab.paneName
    )
  } else {
    ruleList.value = entryRules.value
  }
}

defineExpose({
  allRuleList,
  entryRules,
  exitRules
})
</script>

<style scoped lang="scss">
.model-rule {
  width: 100%;
  :deep(.ideal-table-list__container) {
    padding: 0;
  }
}
</style>
