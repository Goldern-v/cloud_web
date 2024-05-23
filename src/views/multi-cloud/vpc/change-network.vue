<template>
  <div class="vpc-change-network">
    <div>IPv4主网段：{{ ipv4 }}</div>

    <div
      v-for="(item, index) of networkList"
      :key="index"
      class="vpc-change-network__container"
    >
      <div class="flex-row vpc__title-box">
        <div>扩展网段-1</div>
        <el-button class="vpc-button--delete" text @click="handleDelete(index)"
          >删除</el-button
        >
      </div>

      <el-radio-group v-model="item.type">
        <el-radio label="1">推荐扩展网段</el-radio>
        <el-radio label="2">自定义扩展网段</el-radio>
      </el-radio-group>

      <div class="flex-row vpc-change-network__expand">
        <span class="vpc-custom-required"></span>
        <div class="ideal-default-margin-right">扩展网段</div>
        <el-select v-model="item.expand" placeholder="请选择">
          <el-option
            v-for="(v, idx) of expandList"
            :key="idx"
            :label="v.otherName"
            :value="v.otherId"
          >
            {{ v.otherName }}
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="flex-row vpc-button__container">
      <svg-icon icon="circle-add"></svg-icon>
      <el-button
        class="vpc-button--add"
        text
        :disabled="!haveAvailable"
        @click="handleAdd"
        >添加</el-button
      >
      <el-tooltip effect="dark" :content="addTip" placement="right">
        <svg-icon icon="question-icon"></svg-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
const ipv4 = ref('192.168.0.0/16')
const networkList = ref([{ type: '1', expand: '' }])
const expandList = ref<any>([])

const handleDelete = (index: number) => {
  networkList.value.splice(index, 1)
}
const maxExpand = 2 // 最大扩展网段数
// 是否有扩展网段可添加
const haveAvailable = computed(() => {
  return maxExpand - networkList.value.length > 0
})
// 添加按钮信息提示
const addTip = computed(() => {
  let result = maxExpand - networkList.value.length
  if (result < 0) {
    result = 0
  }
  return `您还可以添加${result}个网段`
})
const handleAdd = () => {
  networkList.value.push({ type: '1', expand: '' })
}
</script>

<style scoped lang="scss">
.vpc-change-network {
  width: 100%;
  .vpc-change-network__container {
    box-shadow: 0px 0px 5px 2px #e4e6ec;
    margin: 20px 0;
    padding: 10px;
    .vpc__title-box {
      justify-content: space-between;
      align-items: center;
    }
    .vpc-button--delete {
      color: var(--el-color-primary);
    }
    .vpc-change-network__expand {
      justify-content: flex-start;
      align-items: center;
      margin-top: 10px;
    }
    .vpc-custom-required:after {
      content: '*';
      color: red;
      font-size: 150%;
    }
  }
  .vpc-button__container {
    align-items: center;
    .vpc-button--add {
      color: var(--el-color-primary);
      &.is-disabled {
        color: $gray6-light;
      }
    }
  }
}
</style>
