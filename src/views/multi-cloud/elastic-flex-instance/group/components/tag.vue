<template>
  <div>
    <div class="ideal-tip-text">
      如果您需要使用同一标签标识多种云资源，即所有服务均可在标签输入框下拉选择同一标签，建议在TMS中创建预定义标签。
      <el-link type="primary" :underline="false"
        >查看预定义标签</el-link
      >
      <div
        v-for="(item, index) of dataArray"
        :key="index"
        class="flex-row tag-box"
      >
        <el-input
          v-model="item.key"
          placeholder="标签键"
          class="ideal-default-margin-right"
          style="width: 210px"
        />
        <el-input
          v-model="item.value"
          placeholder="标签值"
          class="ideal-default-margin-right"
          style="width: 210px"
        />
        <svg-icon
          v-if="dataArray.length > 1"
          icon="delete-icon"
          color="var(--el-color-primary)"
          @click="clickDeleteTag(index)"
        />
      </div>
      <div class="flex-row">
        <el-button link type="primary" :disabled="!availableQuota" @click="clickAddTag"
          >添加标签</el-button
        >
        <div>您还可以添加{{ availableQuota }}个标签</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TagProps {
  quota?: number
}
const props = withDefaults(defineProps<TagProps>(), {
  quota: 10
})
// 子网可新增配额
const availableQuota = computed(() => {
  let result = props.quota - dataArray.value.length
  if (result < 0) {
    result = 0
  }
  return result
})
const dataArray = ref<any[]>([{ key: '', value: '' }])
// 添加标签
const clickAddTag = () => {
  dataArray.value.push({ key: '', value: '' })
}
const clickDeleteTag = (index: number) => {
  if (dataArray.value.length === 1) { return }
  dataArray.value.splice(index, 1)
}
</script>

<style scoped lang="scss">
.tag-box {
    margin: 10px 0 0;
    align-items: center;
    justify-content: flex-start;
  }
</style>
