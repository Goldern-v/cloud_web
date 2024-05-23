<template>
  <div class="relate-instance ideal-large-margin-top">
    <el-tabs v-model="activeName" class="relate-instance-tabs" type="card">
      <el-tab-pane
        v-for="item in tabControllers"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>
    <component
      :is="tabs[activeName]"
      :detail-info="detailInfo"
      @updatePageNumber="updatePageNumber"
    ></component>
  </div>
</template>

<script setup lang="ts">
import server from './server.vue'
import extensionCard from './extension-card.vue'
import assistNic from './assist-card.vue'
import other from './other.vue'
import { querySafeGroupDetail } from '@/api/java/network'

const activeName = ref('server')

const tabs: any = { server, extensionCard, assistNic, other }
const tabControllers = ref([
  { label: '服务器(0)', name: 'server' },
  // { label: '扩展网卡(0)', name: 'extensionCard' },
  { label: '辅助弹性网卡(0)', name: 'assistNic' }
  // { label: '其他(0)', name: 'other' }
])
const updatePageNumber = (total: number, index: number) => {
  const labelArray = ['服务器', '辅助弹性网卡']
  tabControllers.value[index].label = `${labelArray[index]}(${total})`
}

onMounted(() => {
  queryDetailData()
})

const route = useRoute()
const id = route.query.id as string
//请求安全组详情

const detailInfo: any = ref({})
const queryDetailData = () => {
  querySafeGroupDetail({ id })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        detailInfo.value = data
        const labelArray = ['服务器', '辅助弹性网卡']
        const labelField: any = {
          server: 'ECS',
          assistNic: 'NIC'
        }
        tabControllers.value.forEach((item: any, index: number) => {
          item.label = `${labelArray[index]}(${
            data.instanceTypeCount[labelField[item.name]] || 0
          })`
        })
      }
    })
    .catch(_ => {})
}
</script>

<style scoped lang="scss">
.relate-instance {
  width: 100%;
  .relate-instance-tabs {
    background-color: white;
    padding: $idealPadding $idealPadding 0;
  }
}
</style>
