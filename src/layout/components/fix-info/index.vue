<template>
  <div class="fix-container">
    <template v-for="(item, index) in showInfoList">
      <el-popover
        v-if="item.usePopover"
        :key="index + 'info'"
        :width="item.popverWidth"
        placement="left"
        trigger="hover"
      >
        <template #reference>
          <div class="info-item">
            <svg-icon
              v-if="item.icon"
              :icon="item.icon"
              :color="item.color"
              :height="item.height"
              :width="item.width"
            ></svg-icon>
          </div>
        </template>
        <component :is="item.component" :list="item.listData"> </component>
      </el-popover>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getContact } from '@/api/java/operate-center'
import infoBox from '@/layout/components/Info-box/index.vue'

const showInfoList = reactive([
  {
    icon: 'icon-sever',
    color: '#333',
    height: '20px',
    width: '20px',
    usePopover: true,
    popverWidth: 360,
    listData: [],
    component: infoBox
  }
])

onMounted(async () => {
  await getContactInfo()
})

const getContactInfo = () => {
  return new Promise((resolve, reject) => {
    getContact().then(res => {
      if (res.code == '200') {
        const { data: list } = res
        showInfoList[0].listData = list.reduce(
          (preLi: any, nextLi: any, index: any) => {
            return [
              ...preLi,
              {
                title: nextLi.vdcFirst,
                children: nextLi.contacts.map((item: any) => {
                  const { vdcSecond, name, email } = item
                  return `${vdcSecond}：${name} ${email}`
                })
              }
            ]
          },
          []
        )
        resolve(true)
      }
    })
  })
}
</script>

<style lang="scss" scoped>
.fix-container {
  position: fixed;
  padding: 10px 0;
  border-radius: 22px;
  right: 0;
  bottom: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;
  z-index: 100;
  .info-item {
    cursor: pointer;
    position: relative;
    padding: 0 10px;
  }
}
</style>
