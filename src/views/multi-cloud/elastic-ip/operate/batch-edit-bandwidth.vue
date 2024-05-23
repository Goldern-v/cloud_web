<template>
  <div class="edit-bandwidth">
    <div v-if="stepsIndex === 1" class="edit-bandwidth__content">
      <div class="edit-bandwidth__content-config">
        <p class="edit-bandwidth__content-title">当前配置</p>
        <ideal-table-list
          :table-data="selectEipData"
          :table-headers="tableHeaders"
          :show-pagination="false"
          style="padding: 20px"
        >
          <template #operation>
            <el-table-column label="操作" width="100px">
              <template #default="props">
                <el-button
                  size="small"
                  link
                  type="primary"
                  @click="remove(props.$index)"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </template>
        </ideal-table-list>
        <p class="ideal-warning-text">
          共{{
            selectEipData.length
          }}个带宽将按照下面选定的修改类型修改，如暂不需要修改，请从列表中移除。
        </p>
      </div>

      <el-form :model="configForm" label-position="left">
        <el-form-item label="带宽名称" prop="bandwidthName">
          <div class="flex-column">
            <el-radio-group
              v-model="configForm.bandwidthType"
              class="custom-radio"
            >
              <el-radio-button
                v-for="item of typeList"
                :key="item.label"
                type="text"
                :label="item.label"
                >{{ item.name }}
              </el-radio-button>
            </el-radio-group>
            <p class="ideal-warning-text">
              同时修改计费方式和带宽大小，修改后，所有带宽规格将统一为相同的计费方式和带宽大小。
            </p>
          </div>
        </el-form-item>

        <el-form-item label="计费方式" prop="billingMode">
          <el-radio-group v-model="configForm.billingMode" class="custom-radio">
            <el-radio-button
              v-for="item of chargeModeList"
              :key="item.label"
              type="text"
              :label="item.label"
              >{{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="带宽大小(MBit/s)">
          <el-radio-group
            v-model="configForm.bandwidthSize"
            class="custom-margin-right number-radio"
          >
            <el-radio-button
              v-for="(item, index) of sizeList"
              :key="index"
              type="text"
              :label="item"
              >{{ item }}
            </el-radio-button>
          </el-radio-group>
          <span style="margin: 0 10px">自定义</span>
          <el-input-number
            v-model="configForm.bandwidthSize"
            class="custom-margin-right"
          >
          </el-input-number>
          <span class="ideal-warning-text">带宽范围:1-2,000 Mbit/s</span>
        </el-form-item>
      </el-form>

      <div class="edit-bandwidth__content-config">
        <p class="edit-bandwidth__content-title">修改详情</p>
        <ideal-table-list
          :table-data="modifiedData"
          :table-headers="modifiedHeaders"
          :show-pagination="false"
          style="padding: 20px"
        >
          <template #config>
            <el-table-column label="配置">
              <template #default="props">
                <div
                  v-for="(item, index) in eipConfig"
                  :key="index"
                  class="flex-row"
                >
                  <div class="table_item_label">
                    {{ item.label }}
                  </div>
                  <div class="table_item_content">
                    {{ props.row[item.prop] }}
                  </div>
                </div>
              </template>
            </el-table-column>
          </template>

          <template #beforeChange>
            <el-table-column label="变更前">
              <template #default="props">
                <div
                  v-for="(item, index) in beforeConfig"
                  :key="index"
                  class="flex-row"
                >
                  <div class="table_item_label">
                    {{ item.label }}
                  </div>
                  <div class="table_item_content">
                    {{ props.row[item.prop] }}
                  </div>
                </div>
              </template>
            </el-table-column>
          </template>

          <template #afterChange>
            <el-table-column label="变更后">
              <template #default="props">
                <div
                  v-for="(item, index) in afterConfig"
                  :key="index"
                  class="flex-row"
                >
                  <div class="table_item_label">
                    {{ item.label }}
                  </div>
                  <div class="table_item_content">
                    {{ props.row[item.prop] }}
                  </div>
                </div>
              </template>
            </el-table-column>
          </template>
        </ideal-table-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { bandwidthInfo } from './batch-edit-bandwidth'
import type { IdealTableColumnHeaders } from '@/types'

const { configForm, typeList, chargeModeList, sizeList, modifiedData } =
  bandwidthInfo()
const stepsIndex = ref(1)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '带宽名称', prop: 'productType' },
  { label: '弹性公网IP', prop: 'ipAddress' },
  { label: '带宽大小(Mbit/s)', prop: 'billingModeText' },
  { label: '计费类型', prop: 'billingMode' },
  { label: '价格', prop: 'price' }
]
const modifiedHeaders: IdealTableColumnHeaders[] = [
  { label: '配置', prop: 'config', useSlot: true },
  { label: '变更前', prop: 'beforeChange', useSlot: true },
  { label: '变更后', prop: 'afterChange', useSlot: true },
  { label: '价格', prop: 'price' }
]

const eipConfig = [
  { label: '带宽名称', prop: 'bandwidthName' },
  { label: '弹性公网IP', prop: 'ipAddress' },
  { label: '计费类型', prop: 'billingMode' },
  { label: '当前价格', prop: 'price' }
]

const beforeConfig = [
  { label: '计费方式', prop: 'billingMode' },
  { label: '带宽大小', prop: 'bandwidthSize' }
]

const afterConfig = [
  { label: '计费方式', prop: 'billingMode' },
  { label: '带宽大小', prop: 'bandwidthSize' }
]

const selectEipData = ref([])
const route = useRoute()
onMounted(() => {
  const data = JSON.parse(route.query.data as any)
  selectEipData.value = data
})

const remove = (index: number) => {
  selectEipData.value.splice(index, 1)
}
</script>

<style scoped lang="scss">
.edit-bandwidth {
  padding: 0 10%;
  .custom-input {
    width: 352px;
  }
  .edit-bandwidth__content {
    background-color: #fff;
    padding: $idealPadding;
  }
  .edit-bandwidth__content-config {
    background-color: var(--custom-information-bg-color);
    padding: $idealPadding;
    .edit-bandwidth__content-title {
      font-weight: 600;
      font-size: 15px;
    }
  }
  :deep(.ideal-table-list__container) {
    background-color: var(--custom-information-bg-color);
    padding: 20px 0 !important;
  }

  :deep(.number-radio .el-radio-button__inner) {
    width: 70px;
  }
  .table_item_label {
    color: #8b8b8b;
    font-size: 14px;
    width: 160px;
    text-align: left;
  }
  .table_item_content {
    color: #000000;
    font-size: 14px;
  }
}
</style>
