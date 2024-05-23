<template>
  <div class="expand-form">
    <div class="expand-box">
      <div class="expand-info ideal-default-margin-top">
        <div>当前配置</div>
        <ideal-detail-info
          :label-array="labelArray"
          :item-number="2"
          :detail-info="detailInfo"
          class="ideal-large-margin-top"
        ></ideal-detail-info>

        <el-divider border-style="dashed" />

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="left">
          <template v-if="isExpand">
            <el-form-item label="计费模式">
              <div>{{ form.billingModeDes }}（当前费用 <el-text type="danger">¥{{ form.price }}</el-text>/小时）</div>
            </el-form-item>
            <el-form-item label="当前容量(GB)">
              <div>{{ form.currentSize }}</div>
            </el-form-item>
            <el-form-item label="已使用容量(GB)">
              <div>{{ form.usedSize }}</div>
            </el-form-item>
            <el-form-item label="新增容量(GB)">
              <el-input-number v-model="form.addSize" :min="1" :max="1024" class="ideal-default-margin-right"/>
            </el-form-item>
            <el-form-item label="扩容后容量(GB)">
              <div>{{ form.currentSize + form.addSize }}</div>
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item label="计费模式">
              <div>{{ form.billingModeDes }}</div>
            </el-form-item>
            <el-form-item label="当前容量">
              <div>{{ form.currentSize }}GB(已使用<span>{{ form.usedSize }}</span>GB)</div>
            </el-form-item>
            <el-form-item label="当前费用">
              <div>¥{{ form.price }}/小时</div>
            </el-form-item>
            <el-form-item label="缩容后容量">
              <el-input-number v-model="form.reduceSize" :min="1" :max="form.currentSize"/>
            </el-form-item>
          </template>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'

interface ExpandFormProps {
  type?: string
}
const props = withDefaults(defineProps<ExpandFormProps>(), {
  type: 'expand' // expand: 扩容 reduce: 缩容
})
const isExpand = computed(() => props.type === 'expand')

const labelArray = ref([
  { label: '存储库名称', prop: 'name' },
  { label: '区域', prop: 'area' },
  { label: '存储库ID', prop: 'uuid' }
])
const detailInfo = ref({
  name: 'vpn跳板-不要动',
  area: '上海一',
  uuid: 'e916a9f9-9dae-439f-a24a-becdfa7ab9ce'
})

const formRef = ref<FormInstance>()
const form = reactive({
  billingModeDes: '按需计费',
  billingMode: 'onDemand',
  price: '0.0388',
  currentSize: 100, // 当前容量
  usedSize: 0, // 已使用容量
  addSize: 0, // 新增容量
  reduceSize: 100 // 缩容后容量
})
const rules = reactive<FormRules>({})

</script>

<style scoped lang="scss">
.expand-form {
  width: 100%;
  margin-bottom: 60px;
  .expand-box {
    width: 100%;
    .expand-info {
      padding: $idealPadding;
      border-radius: $circleRadiusSize;
      background-color: white;
    }
  }
}
</style>
