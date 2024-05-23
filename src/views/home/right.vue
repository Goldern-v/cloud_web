<template>
  <div class="flex-column right">
    <user style="margin-bottom: 10px;"/>
    <platform-overview style="margin-bottom: 10px;"/>
    <alarm-record style="margin-bottom: 10px;"/>
    <message style="height: 350px;"/>
  </div>
</template>

<script setup lang="ts">
import user from './components/user.vue'
import platformOverview from './components/platform-overview.vue'
import alarmRecord from './components/alarm-record.vue'
import message from './components/message.vue'

</script>

<style scoped lang="scss">
.right {
  justify-content: space-between;
}
</style>
