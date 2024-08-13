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
      <div>站内消息</div>
      <div class="divider_solid" />
      <el-scrollbar style="width: 100%; height: 150px">
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
          <div class="divider_solid" />
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
//   import { messageList } from '@/api/java/public'

onMounted(() => {
  getMessage()
})
const dataArray = ref<any>([])
const getMessage = () => {
  dataArray.value = [
    {
      messageCategoryName: '待审批通知',
      content:
        '尊敬的管理员：您有一个供应商（供应商名称）录入信息需要审批，请到供应商审批管理进行处理，谢谢',
      order: '1111',
      supplierName: '222',
      operTime: '2024/08/13 13:38:00'
    },
    {
      messageCategoryName: '待审批通知',
      content:
        '尊敬的管理员：您有一个供应商（供应商名称）录入信息需要审批，请到供应商审批管理进行处理，谢谢',
      order: '1111',
      supplierName: '222',
      operTime: '2024/08/13 13:38:00'
    },
    {
      messageCategoryName: '待审批通知',
      content:
        '尊敬的管理员：您有一个供应商（供应商名称）录入信息需要审批，请到供应商审批管理进行处理，谢谢',
      order: '1111',
      supplierName: '222',
      operTime: '2024/08/13 13:38:00'
    }
  ]
  // const params = {
  //   userId: store.userStore.user.id, // 当前登录人的id
  //   readOrNot: false
  // }
  // messageList(params)
  //   .then((res: any) => {
  //     const { code, data } = res
  //     if (code === 200) {
  //       dataArray.value = data
  //     } else {
  //       dataArray.value = []
  //     }
  //   })
  //   .catch(_ => {
  //     dataArray.value = []
  //   })
}
const router = useRouter()
// 站内消息
const clickStation = () => {
  router.push({
    path: '/operate-center/supplier/message/index'
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
.divider_solid {
  width: 100%;
  border: 1px solid #e3e3e3;
  margin: 5px 0;
}
</style>
