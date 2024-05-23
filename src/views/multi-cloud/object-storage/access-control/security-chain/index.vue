<template>
  <div class="security-chain">
    <div>防盗链</div>
    <div class="ideal-tip-text">
      OBS提供同时支持允许白名单访问和阻止黑名单访问的配置，以防止盗链。
    </div>

    <div class="flex-row ideal-middle-margin-top">
      <div>白名单Referer</div>
      <div class="ideal-default-margin-left">
        <el-input
          v-model="whiteList"
          :autosize="{ minRows: 5, maxRows: 15 }"
          maxlength="5000"
          show-word-limit
          type="textarea"
          :disabled="whiteDisabled"
        />
        <div class="ideal-tip-text">
          白名单Referer可以设置多个，多个Referer之间使用换行分隔。
        </div>
      </div>
      <svg-icon
        icon="edit-pen"
        class="ideal-svg-margin-left"
        @click="clickEditWhiteList"
      />
    </div>

    <div class="flex-row ideal-middle-margin-top">
      <div>黑名单Referer</div>
      <div class="ideal-default-margin-left">
        <el-input
          v-model="blackList"
          :autosize="{ minRows: 5, maxRows: 15 }"
          maxlength="5000"
          show-word-limit
          type="textarea"
          :disabled="blackDisabled"
        />
        <div class="ideal-tip-text">
          黑名单Referer可以设置多个，多个Referer之间使用换行分隔。
        </div>
      </div>
      <svg-icon
        icon="edit-pen"
        class="ideal-svg-margin-left"
        @click="clickEditBlackList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const whiteList = ref('') // 白名单Referer
const whiteDisabled = ref(true)
const clickEditWhiteList = () => {
  whiteDisabled.value = false
}
const blackList = ref('') // 黑名单Referer
const blackDisabled = ref(true)
const clickEditBlackList = () => {
  blackDisabled.value = false
}
</script>

<style scoped lang="scss">
.security-chain {
  background-color: white;
  padding: $idealPadding;
}
</style>
