<template>
  <div class="flex-row ideal-detail-info">
    <div
      v-for="(item, index) in labelArray"
      :key="index + 'detail'"
      class="flex-row ideal-detail-info-item"
      :style="itemWidth"
      @mouseenter="handleMouseEnter(item)"
      @mouseleave="handleMouseLeave(item)"
    >
      <div
        :class="labelPosition === 'right' ? 'alignRight' : ''"
        style="width: 150px; color: #8b8b8b"
        class="ideal-default-margin-right"
      >
        {{ item.label }}
        <el-tooltip
          v-if="item.icon"
          :content="item.tip"
          :disabled="!item.tip"
          placement="top"
          ><svg-icon :icon="item.icon"></svg-icon
        ></el-tooltip>
      </div>

      <div v-if="item.useSlot" class="ideal-detail-info-item__content">
        <slot :name="item.prop"></slot>
      </div>

      <div v-else-if="item.isEdit" class="ideal-detail-info-item__content">
        <div v-show="!item.showEdit" class="flex-row">
          {{ detailData[item.prop] }}
          <svg-icon
            v-show="item.visible"
            icon="edit-pen"
            class="ideal-svg-margin-left"
            @click="item.showEdit = !item.showEdit"
          ></svg-icon>
        </div>
        <div v-show="item.showEdit" class="flex-row flex-row-center">
          <el-input
            v-model="detailData[item.prop]"
            class="custom-input"
          ></el-input>
          <svg-icon
            icon="check"
            class="ideal-svg-margin-left"
            color="var(--el-color-success)"
            @click="editInfo(item)"
          ></svg-icon>
          <svg-icon
            icon="close"
            class="ideal-svg-margin-left"
            color="var(--el-color-danger)"
            @click="cancelEdit(item)"
          ></svg-icon>
        </div>
      </div>

      <div v-else-if="item.isSkip" class="ideal-detail-info-item__content">
        <el-text
          type="primary"
          style="cursor: pointer"
          @click="toInstance(item.prop)"
        >
          {{ detailData[item.prop] }}</el-text
        >
      </div>

      <div v-else class="ideal-detail-info-item__content">
        {{ detailData[item.prop] }}
        <svg-icon
          v-show="item.isCopy && detailData[item.prop] && item.visible"
          icon="copy-icon"
          class="ideal-svg-margin-left"
          @click="clickCopy(detailData[item.prop])"
        ></svg-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="IdealDetailInfo">
import type { IdealTextProp } from '@/types'
import { clickCopy } from '@/utils/tool'
import { ElTooltip } from 'element-plus'

// 多数情况用于展示详情信息,少数情况需要对文本进行编辑或开关等操作,用插槽在父视图实现
interface TextProp extends IdealTextProp {
  useSlot?: boolean
  isCopy?: boolean //是否支持复制
  isEdit?: boolean //是否支持修改
  showEdit?: boolean //是否展示修改框
  visible?: boolean //hover可视
  isSkip?: boolean //是否支持跳转
  icon?: any
  tip?: string
}

interface IdealDetailInfo {
  labelArray?: TextProp[] // 需要展示的详情label
  detailInfo?: any // 详情数据
  itemNumber?: number // 每行显示几条,默认2条
  labelPosition?: string //标签对齐方式
}

const props = withDefaults(defineProps<IdealDetailInfo>(), {
  labelArray: () => [],
  detailInfo: () => ({}),
  itemNumber: 2,
  labelPosition: 'left'
})
// 每条宽
const itemWidth = computed(
  () => `width: calc((100% / ${props.itemNumber}) - 20px)`
)

const detailData: any = ref([])
onMounted(() => {
  if (props.detailInfo) {
    detailData.value = Object.assign({}, props.detailInfo)
  }
})
watch(
  () => props.detailInfo,
  val => {
    detailData.value = Object.assign({}, val)
  }
)

//支持修改
const emit = defineEmits(['editInfo', 'toInstance'])
const editInfo = (item: any) => {
  emit('editInfo', detailData.value, item)
}

const handleMouseEnter = (item: any) => {
  item.visible = true
}
const handleMouseLeave = (item: any) => {
  item.visible = false
}

const cancelEdit = (item: any) => {
  detailData.value[item.prop] = props.detailInfo[item.prop]
  item.showEdit = !item.showEdit
}

//跳转详情
const toInstance = (prop: string) => {
  emit('toInstance', prop)
}
</script>

<style scoped lang="scss">
.ideal-detail-info {
  padding: 0 10px;
  width: calc(100% - 20px);
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .ideal-detail-info-item {
    box-sizing: border-box;
    padding: 10px;
    align-items: center;
    .alignRight {
      text-align: right;
    }
    .ideal-detail-info-item__content {
      width: calc(100% - 150px);
      word-wrap: break-word;
      overflow: hidden;
    }
  }
  .flex-row-center {
    align-items: center;
  }
  .custom-input {
    width: $formInputWidth;
  }
  .skip-content {
    cursor: pointer;
  }
}
</style>
