<template>
  <div class="tagMultipleSelect">
    <el-popover
      trigger="manual"
      :visible="visible"
      popper-class="multiple-search-select-popper"
      width="180px"
    >
      <template #reference>
        <div
          :id="selectId + 'select'"
          class="multiple-search-select el-select"
          @click="visible = !visible"
        >
          <div class="el-select__tags">
            <div class="flex-row">
              <span
                v-for="(item, index) in selectedList"
                :key="index + '-selectedList'"
                class="item"
              >
                <span
                  v-if="item.labelType === 320001"
                  class="el-tag el-tag--info el-tag--small el-tag--light"
                  :style="{ background: item.color }"
                >
                  <span class="el-select__tags-text">{{ item.name }}</span>
                  <i @click="selectItem(item)"
                    ><svg-icon icon="close-icon"></svg-icon
                  ></i>
                </span>
                <span
                  v-else
                  class="el-tag el-tag--info el-tag--small el-tag--light"
                  style="background-color: #ffffff"
                  :style="
                    'border:' +
                    '1px' +
                    ' ' +
                    'solid' +
                    ' ' +
                    item.color +
                    ';' +
                    'color:' +
                    item.color +
                    ';'
                  "
                >
                  <span class="el-select__tags-text">{{ item.name }}</span>
                  <i @click="selectItem(item)"
                    ><svg-icon icon="circle-close"></svg-icon
                  ></i>
                </span>
              </span>
            </div>
          </div>
          <div
            class="el-input el-input--suffix"
            :class="{ 'is-focus': selecting }"
          >
            <el-input :id="selectId + 'Input'" readonly :placeholder="inputTip">
              <template #suffix>
                <span
                  @mouseover="handleHoverIcon(true)"
                  @mouseleave="handleHoverIcon(false)"
                  ><span class="el-input__suffix-inner">
                    <i v-show="!showEmptyIcon"
                      ><svg-icon icon="down-arrow"></svg-icon
                    ></i>

                    <i
                      v-show="selectedList.length != 0 && showEmptyIcon"
                      @click="empty"
                      ><svg-icon icon="circle-close"></svg-icon></i></span
                ></span>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <div :id="selectId + 'ul'" class="search-ul-wrap">
        <div class="el-scrollbar">
          <div class="el-select-dropdown__wrap el-scrollbar__wrap">
            <ul class="el-scrollbar__view el-select-dropdown__list">
              <li
                v-for="(item, index) in optionList"
                :key="index + '-optionList'"
                :class="{
                  'el-select-dropdown__item': true,
                  selected: tagIds.indexOf(item.id) != -1
                }"
                @click="selectItem(item)"
              >
                <div
                  v-if="item.labelType === 320001"
                  class="tag-checked-box"
                  :class="{
                    clickSelect: selectedList.some((ele:any)=> ele.id === item.id)
                  }"
                  style="width: 100px; height: 95%; color: #ffffff"
                  :style="'background:' + item.color + ';'"
                >
                  {{ item.name }}
                </div>
                <div
                  v-else
                  class="tag-checked-box"
                  :class="{
                    clickSelect: selectedList.some((ele:any)=> ele.id === item.id)
                  }"
                  style="width: 100px; height: 95%"
                  :style="
                    'border:' +
                    '2px' +
                    ' ' +
                    'solid' +
                    ' ' +
                    item.color +
                    ';' +
                    'color:' +
                    item.color +
                    ';'
                  "
                >
                  {{ item.name }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-popover>
    <el-dialog v-model:visible="tagNumExceedsTip" title="提示" width="70%">
      <span>每个资源最多只能绑定<span style="color: red">6</span>个标签</span>
      <div style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { queryResourceLabelList } from '@/api/java/business-center'
interface tagProps {
  selected?: any
  options?: any
}

const props = withDefaults(defineProps<tagProps>(), {
  selected: () => [],
  options: () => []
})

const inputTip = ref('请选择标签')
const selectId = Math.ceil(Math.random()) //本组件唯一ID
const visible = ref(false) //下拉展示隐藏状态
const showEmptyIcon = ref(false) //清空选择图标的展示隐藏状态
const selectedList: any = ref([]) //本组件的已选项
const optionList: any = ref([]) //本组件的已选项
const tagIds: any = ref([]) //纯数组:已选

const selecting = ref(false)
const tagNumExceedsTip: any = ref(false)

onMounted(() => {
  queryTags()
  selectedList.value = props.selected
  const dropdown = document.getElementById(selectId + 'select')
  const popover = document.getElementById(selectId + 'ul')
  document.addEventListener('click', function (event) {
    const target: any = event.target
    if (!dropdown || !dropdown.childNodes.length) {
      return
    }
    if (dropdown?.contains(target) || popover?.contains(target)) {
      return
    }
    visible.value = false
    document.getElementById(selectId + 'Input') &&
      document.getElementById(selectId + 'Input')?.blur()
    selecting.value = false
  })
})

//查询标签
const tagsList = reactive({
  privateTags: [] as any[],
  publicTags: [] as any[]
})
const queryTags = () => {
  queryResourceLabelList().then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      optionList.value = data
    } else {
      optionList.value = []
    }
  })
}

// 选单个
const selectItem = (selectedItem: any) => {
  document.getElementById(selectId + 'Input')?.focus()
  selecting.value = true
  //   改变已选数组
  if (tagIds.value.indexOf(selectedItem.id) === -1) {
    selectedList.value.push(selectedItem)
  } else {
    selectedList.value.splice(tagIds.value.indexOf(selectedItem.id), 1)
  }
}

// 方法
interface EventEmits {
  (e: 'selectTag', v: number): void
}
const emit = defineEmits<EventEmits>()

watch(
  () => props.selected,
  (val: any) => {
    if (val) {
      selectedList.value = val
      inputTip.value = selectedList.value.length > 0 ? '' : '请选择标签'
    }
  }
)
watch(
  () => selectedList.value,
  (val: any) => {
    tagIds.value = val.map((item: any) => item.id)
    inputTip.value = val?.length ? '' : '请选择标签'
    emit('selectTag', val) //id：标签id,name:标签名称
  },
  { deep: true }
)

const handleHoverIcon = (sign: any) => {
  showEmptyIcon.value = sign ? selectedList.value.length != 0 : sign
  if (!visible.value) {
    document.getElementById(selectId + 'Input')?.blur()
    selecting.value = false
  }
}

//全部清空
const empty = () => {
  selectedList.value.splice(0, selectedList.value.length)
}

const confirm = () => {
  tagNumExceedsTip.value = false
  selectedList.value.splice(-1, 1)
}
</script>

<style lang="scss" scoped>
.multiple-search-select {
  width: 100%;
  .el-select__tags {
    flex-wrap: nowrap;
    // 隐藏两个之后的所有Tag，并在第三个Tag之前展示...
    .item {
      &:nth-child(n + 3) {
        width: 0;
        padding: 0;
        height: 0;
        margin: 0;
        color: rgba(255, 255, 255, 0);
        border-color: unset;
        background: none;
        .el-tag {
          display: none;
        }
        i {
          display: none;
        }
      }
      &:nth-child(3) {
        position: relative;
        .el-tag {
          display: none;
        }
        &:before {
          content: '...';
          position: absolute;
          left: 5px;
          width: 26px;
          height: 24px;
          padding: 0 8px;
          line-height: 22px;
          font-size: 12px;
          background-color: #f4f4f5;
          color: #909399;
          box-sizing: border-box;
          border: 1px solid #e9e9eb;
          border-radius: 4px;
        }
      }
      .el-tag {
        color: #ffffff;
        .el-select__tags-text {
          max-width: 50px;
          display: inline-block;
        }
        .el-icon-close {
          color: #ffffff;
        }
      }
      span {
        margin-left: 5px;
      }
    }
  }
}
.search-ul-wrap {
  .el-scrollbar {
    .el-select-dropdown__wrap {
      .el-select-dropdown__list {
        .el-select-dropdown__item {
          margin-bottom: 10px;
          .tag-checked-box {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100px;
            padding: 0 10px;
            text-align: center;
            border-radius: 4px;
            line-height: 30px;
            height: 30px;
            box-sizing: border-box;
          }
          .clickSelect {
            position: relative;
            background: linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.5) 0%,
              rgba(255, 255, 255, 0.5) 100%
            );
            &::after {
              position: absolute;
              top: -5px;
              right: 0;
              content: url('@/icons/svg/selected.svg');
            }
          }
        }
        .selected {
          color: #165dff;
          &:after {
            position: absolute;
            right: 20px;
            content: '\e005';
            font-size: 12px;
            font-weight: 700;
            -webkit-font-smoothing: antialiased;
          }
        }
      }
    }
  }
}
// 隐藏两个之后的所有Tag，并在第三个Tag之前展示...
</style>
