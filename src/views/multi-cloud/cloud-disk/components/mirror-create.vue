<template>
  <div class="mirror-create">
    <div>只支持数据盘镜像创建磁盘。</div>

    <div class="flex-row search-container ideal-default-margin-top">
      <el-select v-model="type">
        <el-option
          v-for="(item, idx) of typeList"
          :key="idx"
          :label="item.label"
          :value="item.value"
        >
          {{ item.label }}
        </el-option>
      </el-select>

      <el-input
        v-model="searchValue"
        class="custom-input"
      >
        <template #prepend>
          <el-select
            v-model="searchSelect"
            placeholder="请选择"
            style="width: 115px"
          >
            <el-option
              v-for="(item, index) of searchOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>

        <template #suffix>
          <el-button :icon="Search" @click="handleSearch"></el-button>
        </template>
      </el-input>

      <el-button :icon="RefreshRight" />
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :show-pagination="false"
    >
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()

const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '备份名称', prop: 'mirrorName' },
  { label: '状态', prop: 'status' },
  { label: '磁盘名称', prop: 'diskName' },
  { label: '容量(GiB)', prop: 'size' },
  { label: '磁盘类型', prop: 'diskType' },
  { label: '可用区', prop: 'zone' },
  { label: '创建时间', prop: 'createTime' }
]
//
const type = ref('1')
const typeList: any = [
  { label: '私有镜像', value: '1' },
  { label: '共享镜像', value: '2' }
]

const searchValue = ref('')
const searchSelect = ref('')
// 列表下拉搜索
const searchOptions = [
  { label: '镜像名称', value: 'name' },
  { label: '镜像ID', value: 'uuid' }
]
const handleSearch = () => {}

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
.mirror-create {
  width: 100%;
  .search-container {
    justify-content: flex-end;
    align-items: center;
    .custom-input {
      width: 320px;
      margin: 0 10px;
      :deep(.el-button) {
        border-color: transparent;
        padding: 5px;
      }
    }
  }
}
</style>
