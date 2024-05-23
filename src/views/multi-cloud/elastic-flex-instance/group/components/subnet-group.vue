<template>
  <div class="subnet-group">
    <div v-for="(item, index) of selectArray" :key="index">
      <div class="subnet-group-box">
        <div class="flex-row">
          <el-select
            v-model="item.value"
            placeholder="请选择"
            class="input-box ideal-default-margin-right"
          >
            <el-option
              v-for="(item, index) of dataArray"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <div v-if="index === 0" class="ideal-tip-text">
            本子网作为云服务器的主网卡
          </div>

          <svg-icon
            v-else
            icon="delete-icon"
            @click="clickDeleteSubnet(index)"
          />
        </div>

        <div class="flex-row">
          <el-checkbox v-model="item.isCheck" label="源/目的检查" />

          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="为安全起见，默认情况下“源/目的检查”的状态为“ON”，系统会检查弹性云服务器发送的报文中源IP地址是否正确，如果不正确，则不允许发送该报文。通过该功能，有助于防止伪装报文攻击，提升安全性。以下两种场景，您需要通过设置“源/目的检查”状态为“OFF”，禁用该功能，以保证报文正常转发：
                    1. 在SNAT场景下，配置SNAT的弹性云服务器起转发作用，这种保护机制会导致报文的发送者无法接收到返回的报文。
                    2. 在虚拟IP场景下，绑定虚拟IP的弹性云服务器，绑定的网卡需要发送源IP为虚拟IP的报文。"
            placement="right"
          >
            <svg-icon icon="question-icon" class="ideal-svg-margin-left" />
          </el-tooltip>
        </div>
      </div>
    </div>

    <div class="flex-row">
      <el-button link :disabled="!availableQuota" @click="clickAddSubnet">
        <svg-icon icon="circle-add" class="ideal-svg-margin-right" />
        <div class="ideal-tip-text">
          您还可以增加{{ availableQuota }}个子网
        </div>
      </el-button>

      <svg-icon
        icon="refresh-icon"
        class="ideal-svg-margin-right ideal-svg-margin-left"
      />

      <el-button link type="primary">新建子网</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SubnetGroupProps {
  dataArray?: any
  quota?: number
}
const props = withDefaults(defineProps<SubnetGroupProps>(), {
  dataArray: () => [],
  quota: 5
})

// 方法
// enum EventEnum {
//   add = 'addSubnet',
//   refresh = 'refreshSubnet',
//   create = 'createSubnet'
// }
// interface EventEmits {
//   // (e: EventEnum.cancel): void
//   // (e: EventEnum.success): void
// }
// const emit = defineEmits<EventEmits>()

const selectArray = ref<any[]>([{ value: '', isCheck: true }])
// 子网可新增配额
const availableQuota = computed(() => {
  let result = props.quota - selectArray.value.length
  if (result < 0) {
    result = 0
  }
  return result
})
// 增加子网
const clickAddSubnet = () => {
  selectArray.value.push({ value: '', isCheck: true })
}
// 删除子网
const clickDeleteSubnet = (index: number) => {
  selectArray.value.splice(index, 1)
}
</script>

<style scoped lang="scss">
.subnet-group {
  width: 100%;
  .subnet-group-box {
    margin-bottom: 10px;
  }
}
</style>
