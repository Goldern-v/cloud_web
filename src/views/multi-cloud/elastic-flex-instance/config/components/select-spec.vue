<template>
  <div class="spec">
    <div class="flex-row" style="justify-content: space-between;">
      <div class="flex-row">
        <el-select
          v-model="series"
          multiple
          placeholder="请选择"
          style="width: 30%;"
        >
          <el-option
            v-for="item in seriesList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <div class="flex-row" style="width: 25%;">
          <div style="width: 80px;">vCPUs</div>
          <el-select
            v-model="vCPUs"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in vCPUsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <div class="flex-row" style="width: 30%;">
          <div style="width: 100px;">内存(GiB)</div>
          <el-select
            v-model="memory"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in memoryList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <div class="flex-row" style="width: 25%;">
        <div style="width: 100px;">规格名称</div>
        <el-input v-model="specName" placeholder="请输入规格名称">
          <template #suffix>
            <svg-icon icon="search-icon"/>
          </template>
        </el-input>
      </div>
    </div>

    <div class="spec-type ideal-default-margin-top">
      <div
        v-for="(item,index) of typeList"
        :key="index"
        :class="typeIndex === index ? 'spec-type-item-active':'spec-type-item'"
        @click="clickType(index)">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

// 规格系列
const series = ref('')
const seriesList = ref<any[]>([])
// vCPUs
const vCPUs = ref('')
const vCPUsList = ref<any[]>([])
// 内存
const memory = ref('')
const memoryList = ref<any[]>([])
// 规格名称
const specName = ref('')
// 弹性云服务器类型
const type = ref('')
const typeList = ref<any[]>([
  { label: '通用计算型', value: '1' },
  { label: '通用计算增强型', value: '2' },
  { label: '内存优化型', value: '3' },
  { label: '超大内存型', value: '4' },
  { label: '磁盘增强型', value: '5' },
  { label: '超高I/O型', value: '6' },
  { label: 'GPU加速型', value: '7' },
  { label: '通用入门型', value: '8' },
  { label: 'AI加速型', value: '9' }
])
const typeIndex = ref(0)
const clickType = (index: number) => {
  typeIndex.value = index
}

</script>

<style scoped lang="scss">
.spec {
  width: 100%;
  .spec-type {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    .spec-type-item, .spec-type-item-active {
      padding: 0 5px;
      margin: 0 5px;
      cursor: pointer;
      border-radius: $circleRadiusSize;
    }
    .spec-type-item-active {
      background-color: var(--el-color-primary);
      color: white;
    }
  }
  :deep(.el-table) {
    height: 196px;
  }
}
</style>
