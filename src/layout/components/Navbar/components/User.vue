<template>
  <el-dropdown class="avatar-container" trigger="hover">
    <div class="avatar-wrapper">
      <!-- <el-divider direction="vertical" /> -->
      <span>{{ store.userStore.user.username }}</span>
      <el-avatar shape="circle" :size="30" :src="userAvatar"></el-avatar>
    </div>
    <template #dropdown>
      <el-dropdown-menu class="user-dropdown">
        <router-link to="/profile/password">
          <el-dropdown-item>
            {{ $t('router.profilePassword') }}
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item @click="logout">
          {{ $t('app.signOut') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import store from '@/store'
import defaultAvatar from '@/assets/default-avatar.png'

// 用户头像
const userAvatar = computed(() => store.userStore.user.avatar || defaultAvatar)

const logout = () => {
  store.userStore.logoutAction()
}
</script>

<style lang="scss" scoped>
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: var(--theme-header-height);
  .avatar-wrapper {
    display: flex;
    align-items: center;
    white-space: nowrap;
    cursor: pointer;
    padding: 0 8px;
    color: var(--theme-header-text-color);
    span {
      margin-left: 6px;
    }
  }
  //&:hover {
  //  background: var(--theme-header-hover-color);
  //}
  :deep(.el-divider--vertical) {
    height: 12px;
    border-left: 1px solid rgba(255, 255, 255, 0.3);
  }
}
</style>
