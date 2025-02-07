<template>
  <div class="cloud-type">
    <div class="flex-row cloud-type__title">
      <el-divider direction="vertical" />
      <div>请选择已经创建的云平台类型</div>
    </div>

    <el-input
      v-model="searchValue"
      placeholder="搜索"
      class="cloud-type__search"
    >
      <template #suffix>
        <svg-icon icon="search-icon" style="cursor: pointer;" @click="clickSearch"></svg-icon>
      </template>
    </el-input>

    <div v-for="(item, index) of cloudList" :key="index">
      <div class="flex-row cloud-type__container" @click="clickArrowIcon(item)">
        <el-icon>
          <template v-if="item.arrowDown">
            <svg-icon icon="down-arrow"></svg-icon>
          </template>
          <template v-else>
            <svg-icon icon="up-arrow"></svg-icon>
          </template>
        </el-icon>
        <div>{{ item.name }}</div>
      </div>

      <div v-if="item.arrowDown" class="table-child-view">
        <div
          v-for="(v, i) of item.cloudPlatformTypes"
          :key="i"
          class="table-child-view__item"
          @click="clickCloudType(v, item)"
        >
          <el-image
            style="width: 200px; height: 120px"
            :src="v.url"
            :crossorigin="null"
            fit="fill"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloudPlatformCategory } from '@/api/java/operate-center'

const searchValue = ref('')
// 存放云平台类型
const cloudList = ref<any>([])
onMounted(() => {
  platformCategory()
})
// 云平台类别、类型
const platformCategory = (name: string = '') => {
  const params = { name }
  cloudPlatformCategory(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      cloudList.value = data.map((item: any) => {
        item.arrowDown = false // 箭头: false向上 true向下
        return item
      })
    } else {
      cloudList.value = []
    }
  }).catch(_ => {
    cloudList.value = []
  })
}
const clickSearch = () => {
  platformCategory(searchValue.value)
}
watch(() => searchValue.value, value => {
  platformCategory(value)
})

// 重置箭头图标朝向
const clickArrowIcon = (item: any) => {
  item.arrowDown = !item.arrowDown
  if (!item.arrowDown) {
    return
  }
  // 如果箭头有向下代表有选择,此时其他向下选择箭头重置为向上。向下的箭头保持唯一
  cloudList.value.forEach((v: any) => {
    if (v !== item) {
      v.arrowDown = false
    }
  })
}

interface EventEmits {
  (e: 'clickCloudSelect', value: any , row: any): void
}
const emits = defineEmits<EventEmits>()

const clickCloudType = (item: any, row: any) => {
  emits('clickCloudSelect', item, row)
}
</script>

<style scoped lang="scss">
.cloud-type {
  width: calc(100% - 40px);
  padding: 20px;
  .cloud-type__title {
    justify-content: flex-start;
    align-items: center;
  }
  :deep(.el-divider--vertical) {
    border-left: 2px var(--el-color-primary) solid;
  }

  .cloud-type__search {
    width: 80%;
    margin: 20px 10% 10px;
    :deep(.el-input__wrapper) {
      border-radius: 50px;
    }
  }
  .cloud-type__container {
    background-color: $gray1-light;
    margin: 10px 0;
    align-items: center;
    padding: 20px;
    cursor: pointer;
  }
  .table-child-view {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    .table-child-view__item {
      cursor: pointer;
      border: 1px solid $sub5-light;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      margin: 10px;
      :deep(.cloud-class) {
        width: 200px !important;
        height: 128px !important;
      }
    }
  }
}
</style>
