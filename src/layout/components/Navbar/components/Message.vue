<template>
  <div class="message">
    <el-popover
      placement="top"
      :width="240"
      trigger="hover"
      popper-class="custom-popover"
    >
      <template #reference>
        <svg-icon icon="mail" />
      </template>
      <div class="flex-row message-header">
        <div>消息列表</div>
        <el-button type="primary" link @click="clickConfig"
          >消息接收配置</el-button
        >
      </div>
      <el-scrollbar style="width: 100%; height: 100px">
        <ul v-for="(item, index) of dataArray" :key="index" class="message-ul">
          <li class="message-li">
            <el-tooltip effect="dark" placement="top">
              <template #content
                >【{{ item.messageCategoryName }}】：{{
                  item.content
                }}</template
              >
              <div class="message-title">
                【{{ item.messageCategoryName }}】：{{ item.content }}
              </div>
            </el-tooltip>
            <div>{{ item.operTime }}</div>
          </li>
        </ul>
      </el-scrollbar>
      <div class="flex-row message-footer" style="margin-top: 5px">
        <el-button type="primary" link @click="clickStation"
          >查看更多</el-button
        >
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import store from '@/store'
import { messageList } from '@/api/java/public'

onMounted(() => {
  getMessage()
})
const dataArray = ref<any>([])
const getMessage = () => {
  const params = {
    userId: store.userStore.user.id, // 当前登录人的id
    readOrNot: false
  }
  messageList(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        dataArray.value = data
      } else {
        dataArray.value = []
      }
    })
    .catch(_ => {
      dataArray.value = []
    })
}
const router = useRouter()
// 消息接收配置
const clickConfig = () => {
  router.push({
    path: '/operate-center/notice-announcement/message-receive/index'
  })
}
// 站内消息
const clickStation = () => {
  router.push({
    path: '/operate-center/notice-announcement/station-message/index'
  })
}
</script>

<style scoped lang="scss">
.message {
  width: 100%;
}
</style>
<style lang="scss">
.custom-popover {
  .message-header {
    justify-content: space-between;
  }
  .message-ul {
    list-style: none;
    padding: 0 10px;
    .message-li {
      padding: 2px 0;
      .message-title {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  .message-footer {
    justify-content: flex-end;
  }
}
</style>
