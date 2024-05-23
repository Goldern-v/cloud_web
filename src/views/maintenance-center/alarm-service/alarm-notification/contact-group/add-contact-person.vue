<template>
  <div>
    <el-transfer
      v-model="contactPerson"
      style="text-align: center"
      filterable
      :props="{
        key: 'id',
        label: 'name'
      }"
      :titles="['已有联系人', '已选联系人']"
      :data="contactData"
      @right-check-change="handleSelect"
    >
    </el-transfer>
    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import {
  queryUnbindAlarmContactPerson,
  contactPersonBindContactGroup
} from '@/api/java/maintenance-center'
// 属性值
interface DialogProps {
  rowData?: any //  选中的联系人
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})

const { t } = useI18n()

const contactData: any = ref([])

const handleChange = (
  value: number | string,
  direction: 'left' | 'right',
  movedKeys: string[] | number[]
) => {
  console.log(value, direction, movedKeys)
}

onMounted(() => {
  queryUnbindContacts()
})

const contactPerson: any = ref([''])

const queryUnbindContacts = () => {
  const params = {
    id: props.rowData.id
  }
  queryUnbindAlarmContactPerson(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        contactData.value = data
      } else {
        contactData.value = []
      }
    })
    .catch(() => {
      contactData.value = []
    })
}
const selectContactPerson: any = ref([])
const handleSelect = (arr: any) => {
  selectContactPerson.value = contactData.value.filter((ele: any) =>
    arr.some((item: any) => item === ele.id)
  )
}
/**
 * 确定/取消
 */
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const cancelForm = () => {
  emit(EventEnum.cancel)
}
const submitForm = () => {
  if (!selectContactPerson.value.length) {
    return ElMessage.warning('请选择联系人')
  } else {
    const contacts: any = []
    selectContactPerson.value.forEach((ele: any) => {
      contacts.push({
        id: ele.id,
        name: ele.name
      })
    })
    const groups: any = []
    groups.push({
      id: props.rowData.id,
      name: props.rowData.name
    })
    const params = {
      contacts,
      groups
    }
    showLoading('添加中...')
    contactPersonBindContactGroup(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          ElMessage.success('添加成功')
          emit(EventEnum.success)
        } else {
          ElMessage.success('添加失败')
        }
        hideLoading()
      })
      .catch(_ => {
        hideLoading()
      })
  }
}
</script>

<style scoped lang="scss">
:deep(.el-transfer-panel__filter) {
  height: 22%;
}
</style>
<!-- <template>
  <div>
    <el-transfer
      v-model="contactPerson"
      filterable
      :filter-method="filterMethod"
      filter-placeholder="请输入搜索内容"
      :data="contactData"
    />

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { EventEnum } from '@/utils/enum'
import { queryUnbindAlarmContactPerson } from '@/api/java/maintenance-center'



const filterMethod = () => {}


</script>

<style scoped lang="scss">
:deep(.el-transfer-panel__filter) {
  height: 235;
}
</style> -->
