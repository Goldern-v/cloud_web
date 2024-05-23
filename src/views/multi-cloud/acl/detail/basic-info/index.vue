<template>
  <div class="basic-info">
    <ideal-detail-info
      :label-array="labelArray"
      :detail-info="detailInfo"
      class="ideal-large-margin-top"
    ></ideal-detail-info>
  </div>
</template>

<script setup lang="ts">

const labelArray = ref([
  { label: '名称', prop: 'name' },
  { label: '状态', prop: 'status' },
  { label: 'ID', prop: 'uuid' },
  { label: '描述', prop: 'description' }
])
const detailInfo = ref({
  name: 'fw-b7ix',
  status: '已开启',
  uuid: '8ae3822b-43ad-4901-92eb8c8f',
  description: '--'
})
</script>

<style scoped lang="scss">
.basic-info {
  background-color: white;
}
</style>
