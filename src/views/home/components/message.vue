<template>
  <div class="message">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="item of tabControllers"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <ul v-infinite-scroll="load" :infinite-scroll-immediate="false" class="message-list" style="overflow: auto">
      <li v-for="(item, index) of tableData" :key="index" class="message-list-item">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus'
import { homeMessageList } from '@/api/java/home'
// tabs标签页 0: 公告 1：财务消息 2：运维消息 3：产品消息
const tabControllers = ref([
  { label: '公告', name: '0' },
  { label: '财务消息', name: '1' },
  { label: '运维消息', name: '2' },
  { label: '产品消息', name: '3' }
])
const activeName = ref('0')
const category = ref('0')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
  category.value = tab.paneName as string
  pageNum.value = 0
  tableData.value = []
  getMessage()
}

const pageNum = ref(0)
onMounted(() => {
  getMessage()
})
const load = () => {
  if (isLast.value) { return }
  pageNum.value += 1
  getMessage()
}
const tableData = ref<any[]>([])
const isLast = ref(false)
const getMessage = () => {
  const params = {
    pageNum: pageNum.value,
    pageSize: 10,
    messageCategory: category.value
  }
  homeMessageList(params).then((res: any) => { 
    const { code, data } = res
    if (code === 200) {
      if (data.length) {
        tableData.value.push(...data)
        isLast.value = false
      } else {
        isLast.value = true
      }
    }
  })
}

</script>

<style scoped lang="scss">
.message {
  background-color: white;
  margin-left: 10px;
  padding: $idealPadding;
  height: calc(100% - 40px);
  .message-list {
    height: 85%;
    padding: 0;
    margin: 0;
    list-style: none;
    .message-list-item {
      padding: 5px 0;
    }
  }
}
</style>
