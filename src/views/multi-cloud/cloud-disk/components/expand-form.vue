<template>
  <div class="expand-form">
    <div class="expand-box">
      <div class="flex-row expand-tip">
        <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-svg-margin-right"></svg-icon>
        <div
          >扩容时都不会影响已有数据，但误操作可能会导致数据丢失或者异常，建议扩容前<el-button link type="primary">创建快照</el-button>。</div
        >
      </div>

      <div class="flex-row expand-support ideal-default-margin-top">
        <div class="flex-row expand-support-item">
          <svg-icon icon="circle-tick" color="#56C08D" class="ideal-svg-margin-right"/>
          <div>系统盘和数据盘均支持扩容</div>
        </div>

        <div class="flex-row expand-support-item">
          <svg-icon icon="circle-tick" color="#56C08D" class="ideal-svg-margin-right"/>
          <div>数据盘最高30TiB</div>
        </div>
      </div>

      <div class="expand-info ideal-default-margin-top">
        <div>当前配置</div>
        <ideal-detail-info
          :label-array="labelArray"
          :item-number="3"
          :detail-info="form"
          label-position="left"
          class="ideal-large-margin-top"
        ></ideal-detail-info>

        <el-divider border-style="dashed" />

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="left">
          <el-form-item label="计费模式">
            <div class="flex-row">
              <div>{{ form.billTypeDes }}</div>
              <div v-if="form.billType === 'PACKAGE'">( {{ form.expiredTime }} 到期)</div>
            </div>
          </el-form-item>
          <el-form-item label="当前容量">
            <div>{{ form.size }}GiB</div>
          </el-form-item>
          <el-form-item label="目标容量">
            <div>
              <div class="flex-row">
                <el-input-number v-model="form.targetSize" :min="minSize" :max="30000" class="ideal-default-margin-right"/>
                <el-text>GiB</el-text>
              </div>

              <div>
                最小值：{{ minSize }} GiB最大值：30000 GiB
              </div>

              <el-text type="warning">磁盘不支持缩容，建议您合理选择扩容容量。</el-text>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { BillingEnum } from '@/utils/enum'

const route = useRoute()
const detail = JSON.parse(route.query.data as any)

const formRef = ref<FormInstance>()
const form = reactive({
  billTypeDes: '',
  price: '0.0388',
  size: 1,
  targetSize: 1,
  ...detail
})
const rules = reactive<FormRules>({})

onMounted(() => {
  if (detail) {
    form.diskAttribute = detail?.bootable ? '系统盘' : '数据盘'
    form.billTypeDes = detail?.billType === BillingEnum.PACKAGE ? '包年包月' : '按需计费'
    form.size = detail?.size
    form.targetSize = detail?.size + 1
  }
})

const labelArray = ref([
  { label: '磁盘名称', prop: 'name' },
  { label: '区域', prop: 'regionName' },
  { label: '磁盘类型', prop: 'volumeTypeName' },
  { label: '磁盘ID', prop: 'id' },
  { label: '可用区', prop: 'availableZone' },
  { label: '磁盘属性', prop: 'diskAttribute' }
])

// 容量最小值
const minSize = computed(() => form.size + 1)

defineExpose({
  formRef,
  form
})
</script>

<style scoped lang="scss">
.expand-form {
  width: 100%;
  margin-bottom: 60px;
  .expand-box {
    width: 100%;
    .expand-tip {
      padding: 10px;
      background-color: var(--el-color-primary-light-9);
      border-radius: $circleRadiusSize;
      border: 1px solid var(--el-color-primary);
    }
    .expand-support {
      padding: 10px;
      background-color: white;
      border-radius: $circleRadiusSize;
      .expand-support-item {
        padding: 5px 10px;
        border-radius: $circleRadiusSize;
        background-color: $success1-light;
        margin: 0 5px;
        align-items: center;
      }
    }
    .expand-info {
      padding: $idealPadding;
      border-radius: $circleRadiusSize;
      background-color: white;
    }
  }
}
</style>
