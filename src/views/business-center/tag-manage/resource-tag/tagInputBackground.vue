<template>
  <div class="tagInput">
    <el-color-picker v-model="colorSelect" color-format="hex"></el-color-picker>
    <div class="inputBody">
      <div class="tagItem">
        <div
          v-for="(item, index) in labelArr"
          :key="index"
          class="itemBox"
          :style="{ background: colorSelect }"
        >
          <span>{{ item }}</span>
          <i class="tagClose" @click="removeItem(index, item)"></i>
        </div>
        <input
          v-model="currentVal"
          placeholder="以回车结束生成标签"
          size="5"
          class="input"
          type="text"
          @keyup.enter="addLabel"
          @blur="inputBlur"
        />
      </div>
    </div>
    <el-button @click="deleteInput">删除</el-button>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
interface tagProps {
  colorItem?: any
}

const props = withDefaults(defineProps<tagProps>(), {
  colorItem: () => ({})
})
const colorSelect = ref('')
const currentVal = ref('')
const labelArr: any = ref([])

onMounted(() => {
  colorSelect.value = props.colorItem.tagColor
})

const emit = defineEmits(['deleteDate', 'getDate', 'deleteAllDate'])
// 移除标签
const removeItem = (index: any, item: any) => {
  emit(
    'deleteDate',
    labelArr.value[index],
    colorSelect.value,
    props.colorItem.sequence
  )
  labelArr.value.splice(index, 1)
  inputBlur()
}

// input回车加入labelArr中
const addLabel = () => {
  const nameReg = new RegExp('^[-\u4e00-\u9fa50-9a-zA-Z_——]{1,64}$')
  if (nameReg.test(currentVal.value)) {
    const count = labelArr.value.indexOf(currentVal.value)
    if (count === -1) {
      labelArr.value.push(currentVal.value)
    } else {
      ElMessage.error('请不要输入相同的标签名')
    }
  } else {
    ElMessage.error(
      '标签名称的长度最大36字符，由英文字母、数字、下划线、中划线中文字符组成'
    )
  }
  currentVal.value = ''
}
// 失去焦点时传参给父组件
const inputBlur = () => {
  emit('getDate', labelArr.value, colorSelect.value, props.colorItem.sequence)
}
//删除输入框
const deleteInput = () => {
  labelArr.value = []
  emit(
    'deleteAllDate',
    labelArr.value,
    colorSelect.value,
    props.colorItem.sequence
  )
}

watch(
  () => colorSelect.value,
  color => {
    console.log(color, '------------')
    emit('getDate', labelArr.value, color, props.colorItem.sequence)
  }
)
</script>

<style lang="scss" scoped>
.tagInput {
  display: flex;
  width: 100%;
  :deep .el-input--small {
    .el-input__inner {
      height: 100%;
    }
  }
}

.inputBody {
  width: 100%;
  background-color: white;
  // background-color: green;
  border: 1px solid #dcdee2;
  border-radius: 6px;
  text-align: left;
  margin: 0 10px;
  font-size: 0;
  .tagItem {
    border-radius: 6px;
    padding: 4px 1px 1px 6px;
    text-align: left;
    font-size: 0;
    .itemBox {
      line-height: 25px;
      margin: 2px;
      padding: 0 10px;
      //background-color: #1abc9c;
      color: white;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
      display: inline-block;
      position: relative;
      vertical-align: middle;
      overflow: hidden;
      transition: 0.25s linear;
      &:hover {
        padding: 0 17px 0 3px;
        .tagClose {
          padding: 0 10px 5px 0;
          opacity: 1;
          -webkit-filter: none;
          filter: none;
        }
      }
      .tagClose {
        color: white;
        padding: 0 10px 0 0;
        cursor: pointer;
        font-size: 12px;
        position: absolute;
        right: -3px;
        text-align: right;
        text-decoration: none;
        top: 0;
        width: 100%;
        bottom: 0;
        z-index: 2;
        opacity: 0;
        filter: 'alpha(opacity=0)';
        transition: opacity 0.25s linear;
        font-style: normal;
        &:after {
          content: 'x';
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          line-height: 27px;
        }
      }
    }
    .input {
      font-size: 14px;
      border: none;
      box-shadow: none;
      outline: none;
      background-color: transparent;
      padding: 0;
      width: auto !important;
      max-width: inherit;
      min-width: 180px;
      vertical-align: top;
      height: 30px;
      color: #34495e;
      margin: 2px;
      line-height: 30px;
    }
  }
}
.colorItem {
  position: absolute;
  top: 9px;
  left: 8px;
}
</style>
