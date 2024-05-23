<template>
  <div class="quota-view">
    <div v-for="(item, index) of dataArray" :key="index" class="flex-column quota-item" :class="quotaItemClass(index)">
      <div>
        <div class="quota-item-label">{{ item.label }}</div>
          <div class="flex-row">
            <el-input
              v-model="item.quota"
              placeholder="请输入内容"
              class="ideal-default-margin-right"
              style="width: 150px;"
            >
              <template #prepend>
                <div style="width: 20px;">配额</div>
              </template>
            </el-input>

            <el-input
              v-model="item.already"
              style="width: 180px;"
              disabled
            >
              <template #prepend>
                <div style="width: 50px;">已分配配额</div>
              </template>
            </el-input>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface QuotaViewProps {
  dataArray?: any[]
}

const props = withDefaults(defineProps<QuotaViewProps>(),{
  dataArray: () => []
})
// 根据索引显示样式
const quotaItemClass = computed(() => (value: number) => {
  const result = value % 3
  if (result === 1) {
    return 'quota-item-input-center'
  } else if (result === 2) {
    return 'quota-item-input-right'
  } else {
    return 'quota-item-input'
  }
})
</script>

<style scoped lang="scss">
.quota-view {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .quota-item {
    width: 33.3%;
    margin: 10px 0;
    .quota-item-label {
      color: $textColorSecondary;
      padding: 5px 0;
    }
  }

  .quota-item-input {
      justify-content: center;
      align-items: flex-start;
    }
    .quota-item-input-center {
      justify-content: center;
      align-items: center;
    }
    .quota-item-input-right {
      justify-content: center;
      align-items: flex-end;
    }
}
</style>
