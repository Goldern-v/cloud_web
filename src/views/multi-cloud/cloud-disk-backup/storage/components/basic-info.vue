<template>
  <div class="info">
    <div class="basic-info">
      <div>基本信息</div>
      <ideal-detail-info :label-array="labelArray" :detail-info="detailInfo">
        <template #name>
          <div class="flex-row">
            <div>{{detailInfo.name}}</div>
            <svg-icon icon="edit-pen" class="ideal-svg-margin-left"></svg-icon>
          </div>
        </template>

        <template #id>
          <div class="flex-row">
            <div>{{detailInfo.id}}</div>
            <svg-icon icon="copy-icon" class="ideal-svg-margin-left"></svg-icon>
          </div>
        </template>

        <template #autoBind>
          <div class="flex-row">
            <div>{{detailInfo.autoBind}}</div>
            <svg-icon icon="edit-pen" class="ideal-svg-margin-left"></svg-icon>
          </div>
        </template>

        <template #autoExpand>
          <div class="flex-row">
            <div>{{detailInfo.autoExpand}}</div>
            <svg-icon icon="edit-pen" class="ideal-svg-margin-left"></svg-icon>
          </div>
        </template>
      </ideal-detail-info>
    </div>

    <div class="billing-info ideal-large-margin-top">
      <div>付费信息</div>
      <ideal-detail-info :label-array="billingArray" :detail-info="detailInfo">
      </ideal-detail-info>
    </div>

    <div class="info-container ideal-large-margin-top">
      <div class="flex-row flex-row-between">
        <div class="flex-row info-use">
          <svg-icon icon="success-icon" class-name="success-icon" class="ideal-svg-margin-right"/>
          <div class="info-use-label">可用</div>
          <el-divider direction="vertical" />
          <div>已存储容量</div>
          <div class="info-use-progress">
            <el-progress :percentage="50" />
          </div>
        </div>

        <el-button>
          <svg-icon icon="refresh-icon"/>
        </el-button>
      </div>

      <el-collapse accordion>
        <el-collapse-item name="1">
          <template #title>
            <span class="collapse-title" style="text-align: left;">绑定的磁盘</span>
          </template>
          <div class="flex-row flex-row-center">
            您暂时没有绑定的云硬盘。
          </div>
        </el-collapse-item>

        <el-collapse-item name="2">
          <template #title>
            <div class="flex-row collapse-title flex-row-between">
              <span>策略</span>
            </div>
          </template>
          <div class="flex-row flex-row-between">
            <div>备份策略</div>
            <div>defaultPolicy | 启用｜ 每周一、周二、周六的00:00自动执行备份</div>
            <div class="flex-row">
              <el-button link type="primary">解绑策略</el-button>
              <el-button link type="primary">编辑</el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">

const labelArray = ref([
  { label: '名称', prop: 'name', useSlot: true },
  { label: 'ID', prop: 'id', useSlot: true },
  { label: '状态', prop: 'status' },
  { label: '存储库容量(GB)', prop: 'repositorySize' },
  { label: '已绑定容量(GB)', prop: 'boundSize' },
  { label: '已存储容量(GB)', prop: 'exitSize' },
  { label: '自动绑定', prop: 'autoBind', useSlot: true },
  { label: '自动扩容', prop: 'autoExpand', useSlot: true }
])
const billingArray = ref([
  { label: '计费模式', prop: 'billingMode' },
  { label: '创建时间', prop: 'createTime' }
])
// 详情
const detailInfo = ref({
  name: 'vault-03ab',
  id: 'a01b2917-903b-49ab-8881-18076c20',
  status: '可用',
  repositorySize: '80',
  boundSize: '40',
  exitSize: '0',
  autoBind: '否',
  autoExpand: '否',
  billingMode: '按需计费',
  createTime: '2023-09-10 19:34:09'
})
</script>

<style scoped lang="scss">
.info {
  width: 100%;
  .basic-info, .billing-info, .tag-info, .info-container {
    width: calc(100% - 40px);
    padding: 20px;
    background-color: white;
  }
  .flex-row-between {
    justify-content: space-between;
    align-items: center;
  }
  .info-use {
    justify-content: flex-start;
    align-items: center;
    // 修改等待连接结果图标大小
    :deep(.success-icon) {
      width: 22px !important;
      height: 22px !important;
    }
    // svg图片颜色
    :deep(.svg-icon svg) {
      fill: $success5-light;
    }
    .info-use-label {
      color: $success5-light;
    }
    .info-use-progress {
      width: 200px;
      margin-left: 10px;
    }
  }
  .flex-row-center {
    justify-content: flex-start;
    align-items: center;
  }
  .collapse-title {
    flex: 1;
    order: 1;
  }
  .basic-info-collapse-label {
    width: 120px;
  }
  // 修改折叠框
  :deep(.el-collapse) {
    --el-collapse-header-bg-color: var(--el-color-primary-light-9);
    border-top: none;
    border-bottom: none;
  }
  :deep(.el-collapse-item__header) {
    padding-left: 10px;
  }
  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }
  :deep(.el-collapse-item) {
    border: 1px solid $sub5-light;
    margin: 10px 0;
    border-radius: $circleRadiusSize;
  }
  :deep(.el-collapse-item__content) {
    padding: 10px;
  }
}
</style>