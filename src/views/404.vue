<template>
  <div class="layout-error">
    <img src="@/assets/404.png" alt="404" />
    <div>
      <el-button type="primary" @click="onBack">{{ $t('back') }}</el-button>
      <el-button type="success" @click="onToHome">{{
        $t('router.home')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const onBack = () => {
  router.back()
}
const onToHome = () => {
  router.push('/operate-center/supplier/manage/information-manage/index')
}
</script>

<style lang="scss" scoped>
.layout-error {
  img {
    width: 800px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
