<template>
  <div class="lbs-group ideal-default-margin-top">
    <div v-for="(item, index) of selectArray" :key="index">
      <div class="flex-row lbs-group-box">
        <div>
          <div class="flex-row">
            <div class="lbs-group-box-label">负载均衡器</div>

            <el-select
              v-model="item.lbs"
              placeholder="请选择"
              class="input-box ideal-default-margin-right"
            >
              <el-option
                v-for="(item, index) of lbsArray"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="flex-row ideal-default-margin-top">
            <div class="lbs-group-box-label">后端端口</div>
            <el-input v-model="item.port" class="input-box"/>
          </div>
        </div>

        <div>
          <div class="flex-row">
            <div class="lbs-group-box-label">后端云服务器组</div>

            <el-select
              v-model="item.ecs"
              placeholder="请选择"
              class="input-box ideal-default-margin-right"
            >
              <el-option
                v-for="(item, index) of ecsArray"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="flex-row ideal-default-margin-top">
            <div class="lbs-group-box-label">权重</div>
            <el-input v-model="item.weight" class="input-box"/>
          </div>
        </div>

        <svg-icon v-if="selectArray.length > 1" icon="delete-icon" @click="clickDeleteLbs(index)"/>
      </div>
    </div>

    <div class="flex-row">
      <el-button link :disabled="!availableQuota" @click="clickAddLbs">
        <svg-icon icon="circle-add" class="ideal-svg-margin-right"/>
        新增一个负载均衡器
      </el-button>

      <div class="ideal-tip-text">您还可以增加{{ availableQuota }}个子网</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LbsGroupProps {
  lbsArray?: any // 负载均衡器下拉select数据
  ecsArray?: any // 云服务器组下拉select数据
  quota?: number
}
const props = withDefaults(defineProps<LbsGroupProps>(), {
  lbsArray: () => ([]),
  ecsArray: () => ([]),
  quota: 6
})

const selectArray = ref<any[]>([
  { lbs: '', ecs: '', port: '', weight: '' }
])
// 子网可新增配额
const availableQuota = computed(() => {
  let result = props.quota - selectArray.value.length
  if (result < 0) {
    result = 0
  }
  return result
})
// 增加子网
const clickAddLbs = () => {
  selectArray.value.push({ lbs: '', ecs: '', port: '', weight: '' })
}
// 删除子网
const clickDeleteLbs = (index: number) => {
  selectArray.value.splice(index, 1)
}

// 方法
// enum EventEnum {
//   add = 'addSubnet',
//   refresh = 'refreshSubnet',
//   create = 'createSubnet'
// }
// interface EventEmits {
//   (e: EventEnum.cancel): void
//   (e: EventEnum.success): void
// }
// const emit = defineEmits<EventEmits>()
</script>

<style scoped lang="scss">
.lbs-group {
  width: 100%;
  .lbs-group-box {
    margin-bottom: 10px;
    .lbs-group-box-label {
      width: 120px;
    }
  }
  .input-box {
    width: 200px;
  }
}
</style>
