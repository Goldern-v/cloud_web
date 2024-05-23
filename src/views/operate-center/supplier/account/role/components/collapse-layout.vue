<template>
  <el-collapse v-model="activeNames" @change="change">
    <el-collapse-item
      v-for="(item, index) in slotNames"
      :key="item.name"
      class="create-layout-collapse-item"
      :name="item.name"
    >
      <template #title>
        <div
          style="width: 100%; height: 100%"
          class="create-layout-collapse-item-title"
        >
          <span class="item-title"
            ><el-divider direction="vertical" />{{ item.title }}</span
          >
          <span v-if="isExpand[index]" class="item-button-text"
            >收起<i
              class="header-icon el-icon-d-arrow-right"
              style="transform: rotate(-90deg)"
            ></i
          ></span>
          <span v-else class="item-button-text"
            >展开<i
              class="header-icon el-icon-d-arrow-right"
              style="transform: rotate(90deg)"
            ></i
          ></span>
        </div>
      </template>
      <slot :name="item.name"></slot>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
interface collapseProps {
  slotNames: any
}

const props = withDefaults(defineProps<collapseProps>(), {
  slotNames: () => []
})

interface slotProps {
  name: string
  title: string
}

const activeNames = computed(() =>
  props.slotNames.map((item: any) => {
    return item.name
  })
)

const isExpand = ref([])

const change = () => {
  isExpand.value = props.slotNames.map((item: slotProps) => {
    return activeNames.value.includes(item.name)
  })
}

onMounted(() => {
  initIsExpand()
})

const initIsExpand = () => {
  isExpand.value = props.slotNames.map(() => {
    return true
  })
}
</script>

<style lang="scss" scoped>
@import 'src/styles/variables';

:deep(.el-divider--vertical) {
  border-left: 2px var(--el-color-primary) var(--el-border-style);
}
.create-layout-collapse-item {
  margin-bottom: $idealPadding;
}
:deep .el-collapse-item__header {
  background-color: $gray1-light;
  padding: 0 10px;
  height: $headerContainerHeight;
  line-height: $headerContainerHeight;
  width: 100%;
  border-radius: $circleRadiusSize;
}
:deep .el-collapse-item__content {
  padding-bottom: 0px;
}
.create-layout-collapse-item-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // padding: 0 $idealPadding;
  height: 46px;
  .item-title {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: #1d2129;
  }
  .item-button-text {
    color: $gray6-light;
  }
}
</style>
