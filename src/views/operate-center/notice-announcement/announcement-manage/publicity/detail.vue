<template>
  <div class="ideal-main-container detail">
    <div class="flex-row detail-title">
      <div>{{ detail?.title }}</div>
    </div>
    <div class="flex-row detail-date">
      <div class="flex-row" style="width: 80%;margin-left: 10%;justify-content: center;">
        <div class="ideal-default-margin-right">发布时间{{ detail?.pulishTime }}</div>
        <div class="ideal-default-margin-right">过期时间{{ detail?.expiredTime }}</div>
        <div>状态{{ detail?.statusName }}</div>
      </div>

      <div class="flex-row" style="width: 10%;">
        <el-button type="primary" @click="clickSoldOut">下架</el-button>
        <el-button type="primary" @click="clickDelete">删除</el-button>
      </div>
    </div>
    <div>发布人 {{ detail?.creator?.name }}</div>
    <div>修改人 {{ detail?.updater?.name }}</div>
    <div>{{ detail?.content }}</div>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus'
import { announcementDetail, announcementManageDelete, announcementManageEdit } from '@/api/java/operate-center'

onMounted(() => {
  getDetail()
})
const detail = ref()
// 详情
const getDetail = () => {
  const route = useRoute()
  const id = route.query.id as string
  announcementDetail(id).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      detail.value = data
    } else {
      detail.value = {}
    }
  }).catch(_ => {
    detail.value = {}
  })
}
const clickSoldOut = () => {
  ElMessageBox.confirm('确认下架该通知公告？', '下架公告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(() => {
      const params = {
        id: detail.value?.id,
        status: '2'
      }
      announcementManageEdit(params).then((res: any) => {
        const { code } = res
        if (code === 200) {
          ElMessage.success('下架成功')
          jumpToList()
        } else {
          ElMessage.error('下架失败')
        }
      })
    })
}
const clickDelete = () => {
  ElMessageBox.confirm('确认删除该通知公告？', '删除公告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(() => {
      const id = detail.value?.id
      announcementManageDelete(id).then((res: any) => {
        const { code } = res
        if (code === 200) {
          ElMessage.success('删除成功')
          jumpToList()
        } else {
          ElMessage.error('删除失败')
        }
      })
    })
}
const router = useRouter()
const jumpToList = () => {
  router.push({ path: '/operate-center/notice-announcement/announcement-manage/index' })
}
</script>

<style scoped lang="scss">
.detail {
  background-color: white;
  padding: $idealPadding;
  .detail-title {
    justify-content: center;
  }
  .detail-date {
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}
</style>
