<template>
  <div class="ideal-large-margin role-auth">
    <collapse-layout :slot-names="collapseActiveNames" style="height: 100%">
      <template #basicInfo>
        <ideal-detail-info
          :label-array="labelArray"
          :detail-info="detail"
          label-position="left"
          class="role-auth-detail"
        >
        </ideal-detail-info>
      </template>

      <template #permissionConfig>
        <permission-config
          ref="permissionConfigRef"
          @updateInfo="updateInfo"
        ></permission-config>
      </template>
    </collapse-layout>
  </div>
</template>

<script setup lang="ts">
import collapseLayout from './components/collapse-layout.vue'
import permissionConfig from './components/permission-config.vue'

const labelArray = ref([
  { label: '角色名称', prop: 'name' },
  { label: '角色描述', prop: 'remark' },
  { label: '绑定用户数量', prop: 'bindUserCount' },
  { label: '创建时间', prop: 'createTime' }
])

const route = useRoute()

const isEdit = route.query.type === 'edit' // 是否编辑模式
const collapseActiveNames = ref([
  { name: 'basicInfo', title: '基本信息' },
  { name: 'permissionConfig', title: '授权信息' }
])

//查询角色信息
const detail = ref({})
const updateInfo = (val: any) => {
  detail.value = val
}
</script>

<style scoped lang="scss">
.role-auth {
  height: 100%;
  .role-auth-detail {
    padding: $idealPadding;
  }
  .custom-input {
    width: 400px;
  }
}
</style>
