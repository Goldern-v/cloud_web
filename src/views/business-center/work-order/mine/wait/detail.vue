<template>
  <div class="ideal-large-margin wait-detail">
    <div class="wait-detail-info">
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

    <div class="wait-detail-handle-box ideal-large-margin-top">
      <div class="flex-row ideal-header-container">
        <el-divider direction="vertical" />
        <div>处理流程</div>
      </div>

      <div class="flex-row wait-detail-flow">
        <div class="flex-row wait-detail__apply wait-detail-handle-item">
          <div class="flex-row wait-detail__apply-icon">
            <svg-icon
              icon="text-icon"
              color="var(--el-color-primary)"
            ></svg-icon>
          </div>

          <div class="flex-column wait-detail__apply-text">
            <div class="custom-title">节点名称：工单申请</div>
            <div class="custom-content">参与用户：test1.1</div>
          </div>
        </div>

        <div class="flex-row flex-row-center wait-detail-handle-arrow">
          <div class="line-style"></div>
          <div class="arrow-right"></div>
        </div>

        <div class="flex-row wait-detail__handle wait-detail-handle-item">
          <div class="flex-row wait-detail__apply-icon">
            <svg-icon
              icon="handle-icon"
              color="var(--el-color-primary)"
            ></svg-icon>
          </div>

          <div class="flex-column wait-detail__apply-text">
            <div class="custom-title">节点名称：工单处理</div>
            <div class="custom-content">参与用户：运维管理员</div>
          </div>

          <div class="custom-vertical-divider"></div>

          <div class="flex-column">
            <div>
              <el-button
                class="handle-button"
                @click="clickHandle"
              >
                <svg-icon
                  icon="edit-pen"
                  color="var(--el-color-primary)"
                  class="ideal-svg-margin-right"
                ></svg-icon>
                处理
              </el-button>
            </div>
            <div>
              <el-button
                class="recall-button"
                @click="clickRecall"
              >
                <svg-icon
                  icon="recall-icon"
                  color="$error6-light"
                  class="ideal-svg-margin-right"
                ></svg-icon>
                驳回
              </el-button>
            </div>
          </div>
        </div>

        <div v-if="isHandle" class="flex-row flex-row-center wait-detail-handle-arrow">
          <div class="line-style"></div>
          <div class="arrow-right"></div>
        </div>

        <div v-if="isHandle" class="flex-row wait-detail__apply wait-detail-handle-item">
          <div class="flex-row wait-detail__apply-icon" style="background-color:var(--el-color-primary)">
            <svg-icon
              icon="text-icon"
              color="white"
            ></svg-icon>
          </div>

          <div class="flex-column wait-detail__apply-text">
            <div class="custom-title">节点名称：工单处理完毕</div>
            <div class="custom-content">参与用户：运维管理员</div>
          </div>
        </div>
      </div>

      <el-divider border-style="dashed" />

      <div v-if="isHandle" class="flex-row ideal-large-margin-top">
        <div style="width: 120px">解决方案描述</div>
        <el-input type="textarea" :autosize="{ minRows: 4 }" />
      </div>
    </div>

    <div class="wait-detail-button ideal-large-margin-top">
      <el-button type="primary" @click="clickSave">{{ t('save') }}</el-button>
      <el-button type="info" @click="clickBack">{{ t('back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">

const { t } = useI18n()

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
// 工单是否待处理: false未处理 true已处理
const isHandle = ref(false)
// 处理
const clickHandle = () => {
  isHandle.value = true
}
// 驳回
const clickRecall = () => {
  isHandle.value = true
}
const router = useRouter()
// 保存
const clickSave = () => {}
// 返回
const clickBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.wait-detail {
  box-sizing: border-box;
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 2px var(--el-color-primary) solid;
  }
  .flex-row-center {
    justify-content: center;
    align-items: center;
  }
  .wait-detail-info,
  .wait-detail-handle-box,
  .wait-detail-button {
    background-color: white;
    padding: 20px;
    .wait-detail-handle-item {
      width: 22%;
    }
    .wait-detail-handle-arrow {
      width: 17%;
      padding: 0 10px;
    }
  }
  .wait-detail__title {
    justify-content: flex-start;
    align-items: center;
    background-color: rgba($color: $gray4-light, $alpha: .5);
    padding-left: 10px;
    height: $headerContainerHeight;
    line-height: $headerContainerHeight;
    width: calc(100% - 20px);
  }
  .wait-detail-flow {
    align-items: center;
    margin-top: 20px;
    .wait-detail__apply,
    .wait-detail__handle {
      border: 1px solid $sub5-light;
      border-radius: $circleRadiusSize;
      align-items: center;
      height: 90px;
      .wait-detail__apply-icon {
        background-color: var(--el-color-primary-light-9);
        justify-content: center;
        align-items: center;
        width: 70px;
        height: 100%;
      }
      .wait-detail__apply-text {
        padding: 0 10px;
      }
    }
    .wait-detail__handle {
      padding-right: 10px;
      .handle-button {
        border: 1px solid var(--el-color-primary);
        color: var(--el-color-primary);
        margin-bottom: 5px;
      }
      .recall-button {
        border: 1px solid $error6-light;
        color: $error6-light;
        margin-top: 5px;
        --el-button-hover-text-color: $error6-light; 
        --el-button-hover-bg-color: rgba($color: $error6-light, $alpha: 0.3);
      }
    }
  }
  .custom-vertical-divider {
    height: 30px;
    width: 1px;
    padding: 0 10px;
    border-left: 1px solid $gray4-light;
  }
  .line-style {
    width: 240px;
    height: 1px;
    border-top: 1px solid $gray7-light;
  }
  .arrow-right {
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-left: 8px solid $gray7-light;
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
