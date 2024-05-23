<template>
  <div class="user">
    <div class="flex-row">
      <el-avatar
        shape="circle"
        :size="40"
        :src="userAvatar"
      ></el-avatar>

      <div class="ideal-default-margin-left" style="width: calc(100% - 40px);">
        <div class="flex-row" style="align-items: flex-start;width: 100%;">
          <div class="user-role-label ideal-default-margin-right">{{ userName }}</div>
          <div class="user-role">
            <div v-for="(item,index) of roleNameList" :key="index" class="flex-row user-role-item">{{ item }}</div>
          </div>
        </div>
        <div style="margin: 5px 0">ID:{{ loginName }}</div>
        <div style="margin: 5px 0">上次登录时间：{{ lastLoginDate }}</div>
      </div>
    </div>

    <div class="user-title ideal-middle-margin-top">我的管理</div>
    <div class="flex-row ideal-default-margin-top user-manage">
      <div>
        <div>用户</div>
        <div class="user-title">{{ userQuantity }}</div>
      </div>

      <div>
        <div>项目</div>
        <div class="user-title">{{ projectQuantity }}</div>
      </div>

      <div>
        <div>VDC</div>
        <div class="user-title">{{ vdcQuantity }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { homeUserCollect } from '@/api/java/home'
import defaultAvatar from '@/assets/default-avatar.png'

const userAvatar = computed(() => defaultAvatar)

onMounted(() => {
  getInfo()
})
const roleNameList = ref<any[]>([])
const userName = ref('')
const loginName = ref('')
const lastLoginDate = ref('')
const projectQuantity = ref(0)
const userQuantity = ref(0)
const vdcQuantity = ref(0)
const getInfo = () => {
  homeUserCollect().then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      roleNameList.value = data.roleNameList
      userName.value = data.userName
      lastLoginDate.value = data.operatorTime
      loginName.value = data.loginName
      projectQuantity.value = data.projectQuantity
      userQuantity.value = data.userQuantity
      vdcQuantity.value = data.vdcQuantity
    } else {
      roleNameList.value = []
      userName.value = ''
      lastLoginDate.value = ''
      loginName.value = ''
      projectQuantity.value = 0
      userQuantity.value = 0
      vdcQuantity.value = 0
    }
  }).catch(_ => {
    roleNameList.value = []
    userName.value = ''
    lastLoginDate.value = ''
    loginName.value = ''
    projectQuantity.value = 0
    userQuantity.value = 0
    vdcQuantity.value = 0
  })
}
</script>

<style scoped lang="scss">
.user {
  background-color: white;
  margin-left: 10px;
  padding: $idealPadding;
  .user-role-label {
    width: 30px;
  }
  .user-role {
    width: calc(100% - 30px);
    display: flex;
    flex-wrap: wrap;
    .user-role-item {
      background-color: var(--el-color-primary-light-9);
      border-radius: 1px;
      padding: 3px 5px;
      margin: 2px;
      color: var(--el-color-primary)
    }
  }
  .user-manage {
    justify-content: space-around;
    background-color: #FAFAFA;
    padding: $idealPadding 0;
  }
  .user-title {
    font-size: $mediumFontSize;
      font-weight: 500;
  }
}
</style>
