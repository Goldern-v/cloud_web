<template>
  <div class="add-eni">
    <div v-if="onDemand">
      <div class="flex-row">
        <div>{{ tip }}</div>
        <div class="flex-row" style="align-items: center">
          单击<el-link type="primary" @click="triggerVisible">这里</el-link
          >{{ showTable ? '隐藏详情' : '显示详情' }}
        </div>
      </div>

      <ideal-table-list
        v-if="showTable"
        :table-data="tableArray"
        :table-headers="tableHeaders"
        :show-pagination="false"
      >
      </ideal-table-list>
    </div>

    <div v-else>确认要开通自动续费吗？</div>

    <div class="flex-row footer-button ideal-default-margin-top">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" :disabled="onDemand" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

interface EventTipProp {
  type?: OperateEventEnum | string | undefined
  selectData?: any[]
}
const props = withDefaults(defineProps<EventTipProp>(), {
  type: '',
  selectData: () => ([])
})

const { t } = useI18n()

// 提示信息
const tip = ref('')
const tipDic: { [key: string]: string } = {
  openAutoRenew: '以下1块云硬盘无法进行开通自动续费操作，',
  changeAutoRenew: '以下1块云硬盘无法进行修改自动续费操作，',
  IMToOnDemand: '以下1块云硬盘无法进行设置即时转按需操作，',
  expireToOnDemand: '以下1块云硬盘无法进行设置到期转按需操作，'
}
onMounted(() => {
  tip.value = tipDic[props?.type]
  handleData()
})
// 操作不可进行原因
const reasonDic: { [key: string]: string } = {
  openAutoRenew: '按需资源不支持开通自动续费',
  changeAutoRenew: '按需资源不支持修改自动续费',
  IMToOnDemand: '按需资源不支持设置即时转按需',
  expireToOnDemand: '按需资源不支持设置到期转按需'
}
const tableArray = ref<any[]>([])
const onDemand = ref(false) // 是否包含按需
// 处理选择数据
const handleData = () => {
  if (!props?.selectData?.length) { return }
  const arr = props.selectData.filter((item: any) => item.billingMode === 'onDemand')
  tableArray.value = JSON.parse(JSON.stringify(arr))
  tableArray.value.forEach((item: any) => {
    item.reason = ''
    if (item.billingMode === 'onDemand') {
      onDemand.value = true
      item.reason = reasonDic[props?.type]
      item.reasonTextType = 'warning'
    }
  })
}
// 显示列表
const showTable = ref(true)
const triggerVisible = () => {
  showTable.value = !showTable.value
}
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '原因', prop: 'reason', setTextType: true, textTypeProp: 'reasonTextType' }
]
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
.add-eni {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
