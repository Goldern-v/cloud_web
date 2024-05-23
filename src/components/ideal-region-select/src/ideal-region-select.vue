<template>
  <div class="custom-select-option">
    <el-select
      ref="selectValueRef"
      v-model="selectValue"
      placeholder="请选择"
      popper-class="custom-select-option__select"
      :popper-append-to-body="false"
      @visible-change="closeSelect"
    >
      <el-option value="1" hidden></el-option>

      <div
        v-for="(item, index) of dataList"
        :key="index"
        class="flex-row"
        style="width: 100%;"
      >
        <div
          class="custom-select-option__select-title"
          :class="{ 'is-active': selectIndex === index }"
          @click="clickLabel(index)"
        >
          {{ item[leftLabel] }}
        </div>

        <div class="flex-row custom-select-option__select-container">
          <div
            v-for="(v, i) of item[rightList]"
            :key="i"
            class="custom-select-option__select-item"
            @click="clickItem(v)"
          >
            <el-tooltip
              popper-class="custom-tooltip"
              effect="dark"
              :content="v[rightLabel]"
              placement="right"
            >
              {{ v[rightLabel] }}
            </el-tooltip>
          </div>
        </div>
      </div>
    </el-select>
  </div>
</template>

<script setup lang="ts">
/**
 * el-select下拉菜单自定义
 * el-option必须要有,所以设置hidden
 */

interface IdealRegionSelectProps {
  dataList: any[]
  leftLabel?: string
  rightList?: string
  rightLabel?: string
  rightValue?: string
}

const props = withDefaults(defineProps<IdealRegionSelectProps>(), {
  dataList: [] as any,
  leftLabel: 'arealName', // 左侧列表需展示
  rightList: 'regionList', // 右侧列表
  rightLabel: 'regionName', // 右侧列表需展示
  rightValue: 'regionId'
})

// 获取当前el-select
const selectValueRef: any = ref(null)
// 选择结果
const selectValue = ref('')

enum EventEnum {
  select = 'clickSelectRegion'
}
interface EventEmits {
  (e: EventEnum.select, v?: string): void
}
const emits = defineEmits<EventEmits>()

// 下拉框关闭时，将搜索框内容置空
const closeSelect = (value: string) => {}

const selectIndex = ref(0)
const clickLabel = (index: number) => {
  selectIndex.value = index
}
const clickItem = (v: any) => {
  selectValueRef?.value?.blur()
  selectIndex.value = 0
  selectValue.value = v[props.rightLabel]
  emits(EventEnum.select, v[props.rightValue])
}

</script>

<style scoped lang="scss">
.custom-select-option {
  width: 100%;
}
</style>

<style lang="scss">
:deep(.el-select-dropdown__list) {
  margin: 0 !important;
}
.custom-select-option__select {
  width: 460px;

  .custom-select-option__select-title {
    width: 20%;
    margin-right: 5px;
    padding: 8px;
    text-align: center;
    border-right: 2px solid $sub5-light;
    cursor: pointer;
  }
  .is-active {
    border-right: 2px solid var(--el-color-primary);
  }
  .custom-select-option__select-container {
    width: 80%;
    flex-wrap: wrap;
    .custom-select-option__select-item {
      width: calc(25% - 12px);
      background-color: var(--custom-information-bg-color);
      margin: 4px 2px;
      padding: 4px;
      text-align: center;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
