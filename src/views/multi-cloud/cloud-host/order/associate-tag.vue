<template>
  <div class="associate">
    <div class="flex-row associate__tip">
      <svg-icon icon="info-warning" color="#F3AD3C" class="ideal-svg-margin-right"></svg-icon>
      <span
        >如需标签批量绑定资源，请前往资源标签管理页面，点击<span class="associate__tip-enter" @click="clickTagList">立即进入</span></span
      >
    </div>

    <div class="flex-row associate-tag">
      <div class="flex-column associate-tag-left">
        <div class="flex-row associate-tag-left-header">
          <div>现有标签</div>
          <div class="flex-row" style="align-items: center;">
            <el-input v-model="searchValue" class="ideal-default-margin-right" @change="changeSearch"/>
            <el-button>查询</el-button>
          </div>
        </div>

        <ul class="associate-tag__exist">
          <li v-for="(item, index) in existTags" :key="index + 'exist'" class="flex-row associate-tag__exist-item">
            <el-checkbox v-model="item.selected"/>
            <div>{{ item.label }}</div>
            <div class="associate-tag__item-bg" :style="{backgroundColor:item.bgColor}"></div>
            <div>{{ item.env }}</div>
            <div>{{ item.type }}</div>
          </li>
        </ul>
      </div>

      <div class="flex-column associate-tag__button">
        <div>
          <el-button @click="clickPutIn">
            <svg-icon icon="right-arrow"></svg-icon>
          </el-button>
        </div>
        <div class="ideal-default-margin-top">
          <el-button @click="clickTakeOut">
            <svg-icon icon="left-arrow"></svg-icon>
          </el-button>
        </div>
      </div>

      <div class="associate-tag-right">
        <div class="associate-tag-right-header">已选标签</div>

        <ul class="associate-tag__selected">
          <li v-for="(item, index) in selectedTags" :key="index + 'exist'" class="flex-row associate-tag__selected-item">
            <el-checkbox v-model="item.selected"/>
            <div>{{ item.label }}</div>
            <div class="associate-tag__item-bg" :style="{backgroundColor:item.bgColor}"></div>
            <div>{{ item.env }}</div>
            <div>{{ item.type }}</div>
          </li>
        </ul>
      </div>
    </div>

    <div class="flex-row footer-button ideal-default-margin-top">
      <el-button @click="cancelForm"
          >{{ t('cancel') }}</el-button
        >
        <el-button type="primary" @click="submitForm"
          >{{ t('confirm') }}</el-button
        >
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'

// 标签属性
interface TagsProps {
  label?: string
  bgColor?: string
  env?: string
  type?: string
  selected?: boolean
}

const { t } = useI18n()
// 现有标签查询
const searchValue = ref('')
const changeSearch = (value: string) => {
  existTags.value = saveTags.value

  const filterArr = existTags.value.filter((item: any) => item.label === value || item.env === value || item.type === value)
  existTags.value = filterArr
  
}
// 现有标签
const existTags = ref<TagsProps[]>([])
// 搜索现有标签时,搜索结束后重新对现有标签赋值
const saveTags = ref<TagsProps[]>([])
onMounted(() => {
  existTags.value = [
    { label: 'test1', env: '测试环境1', type: '公有标签', selected: false },
    { label: 'test2', env: '测试环境2', type: '公有标签', selected: false },
    { label: 'test3', env: '测试环境3', type: '公有标签', selected: false },
    { label: 'test4', env: '测试环境4', type: '公有标签', selected: false },
    { label: 'test5', env: '测试环境5', type: '公有标签', selected: false },
    { label: 'test6', env: '测试环境6', type: '公有标签', selected: false },
    { label: 'test7', env: '测试环境7', type: '公有标签', selected: false },
    { label: 'test8', env: '测试环境8', type: '公有标签', selected: false },
    { label: 'test9', env: '测试环境9', type: '公有标签', selected: false },
    { label: 'test10', env: '测试环境10', type: '公有标签', selected: false }
  ]
  saveTags.value = existTags.value
})
watch(() => existTags.value, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    newValue.forEach((item: any) => {
      item.bgColor = bgColor()
    })
  }
})
// 随机色
const bgColor = () => {
  let color = '#'
  for (let i = 0; i < 3; i++) {
    let randomColor = Math.floor(Math.random() * 255).toString(16)
    if (randomColor.length === 1) {
      randomColor = '0' + randomColor
    }
    color += randomColor
  }
  return color
}
const clickPutIn = () => {
  // 已选
  const selected = existTags.value.filter((item: any) => item.selected)
  // 未选
  const unselected = existTags.value.filter((item: any) => !item.selected)
  existTags.value = unselected
  selected.forEach((item: any) => {
    selectedTags.value.push(item)
  })
}
// 已选标签
const selectedTags: any = ref([])
const clickTakeOut = () => {
  const selected = selectedTags.value.filter((item: any) => item.selected)
  const unselected = selectedTags.value.filter((item: any) => !item.selected)
  selectedTags.value = unselected
  selected.forEach((item: any) => {
    existTags.value.push(item)
  })
}
// 跳转标签
const clickTagList = () => {}
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
.associate {
  width: 100%;
  .associate__tip {
    background-color: #FEFBED;
    padding: 20px;
    align-items: center;
    .associate__tip-enter {
      color: var(--el-color-primary);
      cursor: pointer;
    }
  }
  .associate-tag {
    width: 100%;
    .associate-tag-left, .associate-tag-right {
      width: 45%;
      .associate-tag-left-header {
        margin: 10px 0;
        justify-content: space-between;
        align-items: center;
      }
      .associate-tag-right-header {
        margin: 10px 0;
        height: 34px;
        line-height: 34px;
      }
    }
    .associate-tag__exist, .associate-tag__selected {
      border: 1px solid #E7E7E7;
      border-radius: $circleRadiusSize;
      height: 300px;
      width: 100%;
      padding: 0;
      margin: 0;
      list-style: none;
      overflow: auto;
      .associate-tag__exist-item, .associate-tag__selected-item {
        align-items: center;
        justify-content: space-around;
        .associate-tag__item-bg {
          width: 20px;
          height: 20px;
        }
      }
    }
    .associate-tag__button {
      align-items: center;
      justify-content: center;
      width: 10%;
    }
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>