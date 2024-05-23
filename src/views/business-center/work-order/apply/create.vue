<template>
  <div class="ideal-large-margin apply">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left" class="apply-form">
      <el-form-item label="工单资源类型">
        <div class="resource-pool">
          <div
            v-for="(item, index) of resourcePoolList"
            :key="index"
            class="flex-row"
            :class="
              resourcePoolIndex === index
                ? 'resource-pool-item-active'
                : 'resource-pool-item'
            "
            @click="clickResourcePool(index)"
          >
            <div class="flex-row resource-pool-item-left">
              <svg-icon
                :icon="item.icon"
                color="#25314C"
                class="ideal-svg-margin-right"
              ></svg-icon>
              <div>{{ item.label }}</div>
            </div>

            <div class="top-right-tick">
              <svg-icon
                v-if="resourcePoolIndex === index"
                icon="top-right-tick"
                class-name="top-right-tick"
              ></svg-icon>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="工单类型">
        <el-radio-group v-model="form.type">
          <el-radio-button
            v-for="(item, index) in typeList"
            :key="index"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="工单问题">
        <el-input
          v-model="form.question"
          type="textarea"
          :autosize="{ minRows: 3 }"
          class="resource-pool-input"
        />
      </el-form-item>

      <el-form-item label="工单提醒">
        <el-radio-group v-model="form.remind">
          <el-radio label="1">手机</el-radio>
          <el-radio label="2">邮箱</el-radio>
        </el-radio-group>
      </el-form-item>

      <template v-if="isEmail">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="form.email"
            type="email"
            class="resource-pool-input"
          />
        </el-form-item>

        <el-form-item label="抄送邮箱" prop="sendEmail">
          <el-input
            v-model="form.sendEmail"
            type="email"
            class="resource-pool-input"
          />
        </el-form-item>
      </template>

      <el-form-item v-else label="手机号码" prop="phone">
        <el-input
          v-model="form.phone"
          maxlength="11"
          oninput="value=value.replace(/[^\d]/g, '')"
          class="resource-pool-input"
        />
      </el-form-item>
    </el-form>

    <div class="flex-row apply-button">
      <el-button type="info" @click="cancelForm"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { validateMobile, validateEmail } from '@/utils/validate'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  type: '', // 工单类型
  question: '', // 工单问题
  remind: '', // 工单提醒
  phone: '', // 手机号码
  email: '',
  sendEmail: ''
})
const typeList: any = ref([
  { label: '资源开通', value: 'open' },
  { label: '资源变通', value: 'change' },
  { label: '资源回收', value: 'recycle' }
])
const checkPhone = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!validateMobile(value)) {
    callback(new Error('请输入正确手机号'))
  }
  callback()
}
const rules = reactive<FormRules>({
  phone: [{ required: false, validator: checkPhone, trigger: 'blur' }],
  email: [{ required: false, validator: validateEmail, trigger: 'blur' }],
  sendEmail: [{ required: false, validator: validateEmail, trigger: 'blur' }]
})

const resourcePoolList = ref([
  { label: '弹性云主机', icon: 'cloud-host' },
  { label: '云硬盘', icon: 'cloud-disk' },
  { label: '对象存储', icon: 'object-storage' },
  { label: '弹性文件', icon: 'elastic-file' },
  { label: '虚拟私有云', icon: 'virtual-private-cloud' },
  { label: '弹性IP', icon: 'elastic-ip' },
  { label: '共享带宽', icon: 'share-bandwidth' },
  { label: '安全组', icon: 'safe-group' },
  { label: 'ACL', icon: 'acl' },
  { label: '负载均衡', icon: 'load-balance' },
  { label: 'VPN', icon: 'vpn' },
  { label: '云专线', icon: 'cloud-line' }
])
const resourcePoolIndex = ref(-1)
const clickResourcePool = (index: number) => {
  resourcePoolIndex.value = index
  console.log(resourcePoolList.value)
}
const isEmail = computed(() => form.remind === '2')
const router = useRouter()
// 点击事件
const cancelForm = () => {
  router.back()
}
const submitForm = () => {
  
}
</script>

<style scoped lang="scss">
.apply {
  box-sizing: border-box;
  .apply-form {
    padding: 20px;
    background-color: white;
    .resource-pool {
      padding: 0 10px;
      width: 90%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      .resource-pool-item,
      .resource-pool-item-active {
        border: 1px solid white;
        width: calc(25% - 62px);
        margin: 10px;
        background-color: $gray1-light;
        border-radius: 4px;
        justify-content: flex-start;
      }
      .resource-pool-item-active {
        border: 1px solid var(--el-color-primary);
      }
      .resource-pool-item-left {
        margin: 5px 20px;
        width: calc(100% - 14px - 40px);
      }
      .top-right-tick,
      .top-right-tick-active {
        width: 14px;
        :deep(.svg-icon svg) {
          vertical-align: 0.7em; // 调整勾选中图标顶部边距
        }
      }
    }
    :deep(.top-right-tick) {
      color: var(--el-color-primary);
      width: 14px;
      height: 14px;
    }
    .resource-pool-input {
      width: 40%;
    }
  }
  .apply-button {
    margin-top: 20px;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    padding: 20px;
  }
}
</style>
