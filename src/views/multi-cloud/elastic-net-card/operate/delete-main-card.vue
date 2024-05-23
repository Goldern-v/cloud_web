<template>
  <div>
    <div class="warning_desc">
      无法删除弹性网卡<span>{{ rowData.fixedIp }}</span>
    </div>
    <el-alert type="error" show-icon>
      <template #title
        ><span class="ideal-tip-text"
          >您暂时无法直接删除该弹性网卡，详细原因请参考如下解释。</span
        ></template
      >
    </el-alert>

    <ideal-table-list
      :table-headers="tableHeaders"
      :show-pagination="false"
      :table-data="tableData"
    >
      <template #reason>
        <el-table-column label="原因">
          <template #default="props">
            <div>
              不能直接删除主弹性网卡，请<el-text
                type="primary"
                @click="toInstance(props.row)"
                >删除主弹性网卡绑定的实例</el-text
              >该网卡将被同步删除
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" disabled>{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
interface NicProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<NicProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

const tableData: any = ref([])
onMounted(() => {
  tableData.value = [props.rowData]
})
const tableHeaders: any = ref([
  { label: '原因', prop: 'reason', useSlot: true }
])

const toInstance = (row: any) => {}

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}
</script>

<style scoped lang="scss">
.warning_desc {
  margin: 10px 0;
  font-size: 14px;
  align-items: center;
  span {
    font-weight: bolder;
    color: var(--el-text-color-primary);
    margin-left: 5px;
  }
}

.el-alert {
  padding: 12px;
}
.ideal-theme-text {
  cursor: pointer;
}
</style>
