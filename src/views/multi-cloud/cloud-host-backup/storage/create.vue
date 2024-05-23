<template>
  <div class="create">
    <create-form v-show="stepsIndex === 1" ref="formRef"/>
    <create-confirm v-show="stepsIndex === 2" :data="orderInfo.form"/>

    <div v-if="stepsIndex === 3" class="flex-column create-success">
      <svg-icon
        icon="success-icon"
        class-name="create-success-icon"
      />
      <div>任务提交成功！</div>
      <div>您的存储库{{ orderInfo.form.name }}已创建成功。</div>
      <div>{{ count }}秒返回</div>
    </div>

    <create-footer 
      :steps-index="stepsIndex"
      @clickPrevious="clickPrevious"
      @clickCreate="clickCreate"
      @clickSubmit="clickSubmit"/>
  </div>
</template>

<script setup lang="ts">
import createForm from './create-form.vue'
import createConfirm from './create-confirm.vue'
import createFooter from './create-footer.vue'
import type { FormInstance } from 'element-plus'

const stepsIndex = ref(1)
const formRef = ref()

const orderInfo: any = reactive({})
onMounted(() => {
  orderInfo.form = formRef.value.form
})
const clickPrevious = () => {
  if (stepsIndex.value === 1) {
    return
  }
  stepsIndex.value--
}
const clickCreate = () => {
  if (stepsIndex.value === 3) {
    return
  }
  if (stepsIndex.value === 1) {
    const basicRef = formRef.value.formRef
    checkForm(basicRef)
  } else if (stepsIndex.value === 2) {
    clickSubmit()
  }
}
// 校验表单
const checkForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(valid => {
    if (valid) {
      stepsIndex.value++
    } else {
      return false
    }
  })
}
const router = useRouter()
const count = ref(5)
// 计时器处理器
const timerHandler = () => {
  let timer = setInterval(() => {
    if (count.value > 1) {
      count.value--
    } else {
      router.back()
      clearInterval(timer)
    }
  }, 1000)
}
// 提交
const clickSubmit = () => {
  if (stepsIndex.value === 3) {
    return
  }
  stepsIndex.value++
  timerHandler()
}
</script>

<style scoped lang="scss">
:deep(.el-step__title.is-success) {
  color: var(--el-color-primary);
}
:deep(.el-step__head.is-success) {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
.create {
  margin: $idealMargin $idealMargin 80px;
  .create-success {
    width: 100%;
    margin-top: 100px;
    justify-content: center;
    align-items: center;
    // 修改等待连接结果图标大小
    :deep(.create-success-icon) {
      width: 92px !important;
      height: 92px !important;
    }
    :deep(.svg-icon svg) {
      fill: $success5-light;
    }
  }
}
</style>