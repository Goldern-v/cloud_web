<template>
  <div class="flex-row info-form--create">
    <el-button v-if="showSave" type="primary" @click="handleSave">{{ t('save') }}</el-button>
    <el-button @click="handleCancel">{{ t('back') }}</el-button>
  </div>
</template>

<script setup lang="ts">

const route = useRoute()
const type = route.query.type as string
// 详情不显示保存
const showSave = computed(() => type !== 'detail')

const { t } = useI18n()
enum EventEnum {
  cancel = 'clickCancel',
  save = 'clickSave'
}
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.save): void
}
const emit = defineEmits<EventEmits>()

const handleSave = () => {
  emit(EventEnum.save)
}
const handleCancel = () => {
  emit(EventEnum.cancel)
}
</script>

<style scoped lang="scss">
.info-form--create {
  justify-content: flex-start;
  align-items: center;
  box-shadow: 0 -2px 5px 0px $sub5-light;
  padding: 20px;
  width: calc(100% - 40px);
}
</style>
