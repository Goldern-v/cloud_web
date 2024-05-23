<template>
  <div class="ideal-large-margin finished-detail">
    <div class="finished-detail-info">
      <div class="flex-row ideal-header-container">
        <el-divider direction="vertical" />
        <div>工单详情</div>
      </div>

      <ideal-detail-info
        :label-array="labelArray"
        :item-number="3"
        :detail-info="detailInfo"
        class="ideal-large-margin-top"
      ></ideal-detail-info>
    </div>

    <div class="finished-detail-handle-box ideal-large-margin-top">
      <div class="flex-row ideal-header-container">
        <el-divider direction="vertical" />
        <div>处理流程</div>
      </div>

      <div class="flex-row finished-detail-flow">
        <div class="flex-row finished-detail__apply finished-detail-handle-item">
          <div class="flex-row finished-detail__apply-icon">
            <svg-icon
              icon="text-icon"
              color="var(--el-color-primary)"
            ></svg-icon>
          </div>

          <div class="flex-column finished-detail__apply-text">
            <div class="custom-title">节点名称：工单申请</div>
            <div class="custom-content">参与用户：test1.1</div>
          </div>
        </div>

        <div class="flex-row flex-row-center finished-detail-handle-arrow">
          <div class="line-style"></div>
          <div class="arrow-right"></div>
        </div>

        <div class="flex-row finished-detail__handle finished-detail-handle-item">
          <div class="flex-row finished-detail__apply-icon">
            <svg-icon
              icon="handle-icon"
              color="var(--el-color-primary)"
            ></svg-icon>
          </div>

          <div class="flex-column finished-detail__apply-text">
            <div class="custom-title">节点名称：工单处理</div>
            <div class="custom-content">参与用户：运维管理员</div>
          </div>
        </div>

        <div class="flex-row flex-row-center finished-detail-handle-arrow">
          <div class="line-style"></div>
          <div class="arrow-right"></div>
        </div>

        <div class="flex-row finished-detail__apply finished-detail-handle-item">
          <div class="flex-row finished-detail__apply-icon">
            <svg-icon
              icon="text-icon"
              color="var(--el-color-primary)"
            ></svg-icon>
          </div>

          <div class="flex-column finished-detail__apply-text">
            <div class="custom-title">节点名称：工单处理完毕</div>
            <div class="custom-content">参与用户：运维管理员</div>
          </div>
        </div>
      </div>

      <el-divider border-style="dashed" />

      <div class="flex-row ideal-large-margin-top">
        <div style="width: 120px">解决方案描述</div>
        <div>作为审批者你在审批意见的最后是需要给出你的结论或者结果,即总结性的话语,包括对所审核事物的看法,判断等等,你的关键点和你的结论都应该出现在你的审批意见当中。 提出建议和意见 ...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const labelArray = ref([
  { label: '工单编号', prop: 'number' },
  { label: '工单类型', prop: 'type' },
  { label: '工单状态', prop: 'status' },
  { label: '工单创建时间', prop: 'createTime' },
  { label: '工单描述', prop: 'description' }
])
const detailInfo = ref({
  number: '79358308585',
  type: '弹性云主机',
  status: '待处理',
  createTime: '2023.4.10 11:55:11',
  description: '云主机创建规格不显示'
})

</script>

<style scoped lang="scss">
.finished-detail {
  box-sizing: border-box;
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 2px var(--el-color-primary) solid;
  }
  .flex-row-center {
    justify-content: center;
    align-items: center;
  }
  .finished-detail-info,
  .finished-detail-handle-box {
    background-color: white;
    padding: 20px;
    .finished-detail-handle-item {
      width: 22%;
    }
    .finished-detail-handle-arrow {
      width: 17%;
      padding: 0 10px;
    }
  }
  .finished-detail-flow {
    align-items: center;
    margin-top: 20px;
    .finished-detail__apply,
    .finished-detail__handle {
      border: 1px solid $sub5-light;
      border-radius: $circleRadiusSize;
      align-items: center;
      height: 90px;
      .finished-detail__apply-icon {
        background-color: var(--el-color-primary-light-9);
        justify-content: center;
        align-items: center;
        width: 70px;
        height: 100%;
      }
      .finished-detail__apply-text {
        padding: 0 10px;
      }
    }
    .finished-detail__handle {
      padding-right: 10px;
    }
  }
  .line-style {
    width: 240px;
    height: 1px;
    border-top: 1px solid #8b8b8b;
  }
  .arrow-right {
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-left: 8px solid #8b8b8b;
    border-bottom: 6px solid transparent;
  }
  .custom-title {
    color: #000000;
    font-size: 14px;
  }
  .custom-content {
    color: #5e5e5e;
    font-size: 12px;
  }
}
</style>
