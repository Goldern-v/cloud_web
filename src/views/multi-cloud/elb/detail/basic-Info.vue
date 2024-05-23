<template>
  <div>
    <ideal-detail-info
      :label-array="labelArray"
      label-position="left"
      :show-colon="false"
      :detail-info="detailInfo"
      class="basic-info"
      @edit-info="editInfo"
      @click-detail="toDetail"
    >
      <template #serviceAddress>
        <p>
          IPv4私有地址 | <span>{{ detailInfo.privateIp }}</span
          ><svg-icon
            icon="copy-icon"
            class="ideal-svg-margin-left"
            @click="clickCopy(detailInfo.ipv4)"
          ></svg-icon>
        </p>
        <p>
          IPv4公网地址 |
          <span style="color: var(--el-color-primary)">{{
            detailInfo.publicIp
          }}</span
          ><svg-icon
            icon="copy-icon"
            class="ideal-svg-margin-left"
            @click="clickCopy(detailInfo.ipv4)"
          ></svg-icon>
        </p>
      </template>
    </ideal-detail-info>
  </div>
</template>
<script lang="ts" setup>
import { clickCopy } from '@/utils/tool'
const labelArray = ref([
  { label: '名称', prop: 'name', isEdit: true },
  { label: '所属VPC', prop: 'vpc', isSkip: true },
  { label: 'ID', prop: 'uuid', isCopy: true },
  { label: 'IPv4子网', prop: 'ipv4', isSkip: true },
  { label: '实例类型', prop: 'instanceType' },
  { label: '性能保障模式', prop: 'propertyMode' },
  { label: '计费模式', prop: 'billingMode' },
  { label: '服务地址', prop: 'serviceAddress', useSlot: true },
  { label: '描述', prop: 'remark', isEdit: true },
  { label: '公网计费信息', prop: 'remark', useSlot: true },
  { label: '创建时间', prop: 'createDate' },
  { label: '修改保护', prop: 'editProtect' }
])

const detailInfo: any = ref({
  name: 'elb-978a',
  uuid: 'ags-swn-73dh-28sh-dqw2',
  instanceType: '共享型',
  billingMode: '按需计费',
  createDate: '2023/10/11',
  propertyMode: '已开启',
  privateIp: '192.168.0.199',
  publicIp: '1.194.55.154',
  vpc: 'vpc-default'
})
const route = useRoute()
onMounted(() => {
  // detailInfo.value = JSON.parse(route.query.detail as any)
})

const editInfo = (val: any) => {
  console.log(val)
}

const toDetail = (obj: any, detailInfo: any) => {
  console.log(obj, detailInfo, '--------')
}
</script>
<style lang="scss" scoped>
.basic-info {
  width: calc(100% - $idealPadding * 2);
  margin: $idealMargin 0;
  background-color: #fff;
  padding: $idealPadding;
  .skip-text {
    color: var(--el-color-primary);
    font-size: $defaultFontSize;
    cursor: pointer;
  }
  .basic-info-tile {
    font-size: $mediumFontSize;
    margin: 0 20px 20px;
  }
}
</style>
