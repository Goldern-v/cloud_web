<template>
  <div class="basic-info">
    <ideal-detail-info
      :label-array="labelArray"
      :item-number="1"
      label-position="left"
      :detail-info="detailInfo"
      class="ideal-large-margin-top"
      @edit-info="editInfo"
    >
    </ideal-detail-info>
  </div>
</template>

<script setup lang="ts">
import { querySafeGroupDetail } from '@/api/java/network'
import { showLoading, hideLoading } from '@/utils/tool'
import { safeGroupEdit } from '@/api/java/network'
import { ElMessage } from 'element-plus/es'
const labelArray = ref([
  { label: '名称', prop: 'name', isEdit: true },
  { label: 'ID', prop: 'id', isCopy: true },
  { label: '描述', prop: 'description', isEdit: true }
])

onMounted(() => {
  queryDetailData()
})

const route = useRoute()
const id = route.query?.id

//请求安全组详情

const detailInfo: any = ref([])
const queryDetailData = () => {
  querySafeGroupDetail({ id })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        detailInfo.value = data
      } else {
        detailInfo.value = {}
      }
    })
    .catch(_ => {})
}

//公共参数
const commonParams = () => {
  const { resourcePoolId, regionId, projectId } = detailInfo.value
  const params = {
    resourcePoolId,
    regionId,
    projectId
  }
  return params
}

//修改安全组
const editInfo = (val: any, config: any) => {
  const params: any = {
    name: val.name,
    description: val.description,
    uuid: val.uuid,
    ...commonParams()
  }
  showLoading('更新中...')
  safeGroupEdit(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        ElMessage.success('更新安全组成功')
        config.showEdit = false
        queryDetailData()
      } else {
        ElMessage.error('更新安全组失败')
      }
      hideLoading()
    })
    .catch(err => {
      ElMessage.error(err)
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.basic-info {
  width: 100%;
  background-color: white;
}
.flex-row-center {
  align-items: center;
}
.custom-input {
  width: $formInputWidth;
}
</style>
