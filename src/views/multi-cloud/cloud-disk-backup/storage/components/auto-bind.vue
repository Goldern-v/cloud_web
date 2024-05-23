<template>
  <div class="auto-bind">
    <div class="flex-row">
      <svg-icon icon="info-warning" class-name="auto-bind-warning" class="ideal-svg-margin-right"/>
      <div>
        <div class="auto-bind-title">确定启用自动绑定功能吗？</div>
        <div>启用自动绑定功能后，存储库将在下一个备份周期自动扫描并绑定未备份的磁盘，并开始备份。</div>
      </div>
    </div>

    <ideal-table-list
      :table-data="tableArray"
      :table-headers="tableHeaders"
      :show-pagination="false">
      <template #name>
        <el-table-column label="名称/ID">
          <template #default="props">
            <div>{{ props.row.name }}</div>
            <div>{{ props.row.uuid }}</div>
          </template>
        </el-table-column>
      </template>
      
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.status"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="ideal-default-margin-top">支持按标签过滤需要绑定的磁盘。设置标签后，存储库将只绑定使用以下指定标签标识的磁盘。</div>

    <div
      v-for="(item, index) of tags"
      :key="index"
      class="flex-row ideal-default-margin-top"
      style="align-items:center;"
    >
      <el-input
        v-model="item.key"
        placeholder="标签键"
        class="ideal-default-margin-right"
        style="width: 210px"
      />
      <el-input
        v-model="item.value"
        placeholder="标签值"
        class="ideal-default-margin-right"
        style="width: 210px"
      />
      <svg-icon
        icon="plus-icon"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
        @click="clickAddTag"
      />
      <svg-icon
        v-if="tags.length > 1"
        icon="delete-icon"
        color="var(--el-color-primary)"
        @click="clickDeleteTag(index)"
      />
    </div>

    <div class="ideal-tip-text ideal-default-margin-top">仅支持选择已存在的标签，若暂无标签请前往对应服务页面设置。</div>
    <div class="ideal-tip-text">支持最多5个不同标签的组合搜索。如果输入多个标签，则不同标签之间为或的关系。</div>

    <div class="flex-row footer-button ideal-default-margin-top">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEmpty } from '@/utils/is'
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

interface AutoBindProps {
  rowData?: any
}
const props = withDefaults(defineProps<AutoBindProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

const tableArray = ref<any[]>([])
onMounted(() => {
  if (!isEmpty(props.rowData)) {
    tableArray.value = [props.rowData]
  }
})
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true }
]
// 标签
const tags = ref<any[]>([
  { key: '', value: '' }
])
// 添加标签
const clickAddTag = () => {
  if (tags.value.length === 5) {
    return
  }
  tags.value.push({ key: '', value: '' })
}
const clickDeleteTag = (index: number) => {
  if (tags.value.length === 1) {
    return
  }
  tags.value.splice(index, 1)
}
// 点击事件
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
.auto-bind {
  width: 100%;
  :deep(.auto-bind-warning) {
    color: $warning4-light;
    width: 32px;
    height: 32px;
  }
  .auto-bind-title {
    font-weight: 500;
    font-size: 16px;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
