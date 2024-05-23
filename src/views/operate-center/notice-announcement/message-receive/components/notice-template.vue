<template>
  <div class="notice">
    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #type>
        <el-table-column label="模版类型" width="120">
          <template #default="props">
            <div class="flex-row">
              <div>{{ props.row.channelTypeText }}</div>
              <svg-icon icon="eye" @click="clickPreview(props.row)" />
            </div>
          </template>
        </el-table-column>
      </template>

      <template #parameters>
        <el-table-column label="变量参数" width="160">
          <template #default="props">
            <div v-for="(item, index) of props.row.params" :key="index">
              <div class="flex-row">
                <div>{{ item.title }}</div>
                <div>{{ item.value }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #message>
        <el-table-column label="消息内容">
          <template #default="props">
            <div
              v-if="props.row.channelType !== 'SMS'"
              class="flex-row notice-message"
            >
              <div class="required-sign">*</div>
              <div class="notice-title">标题</div>
              <el-input v-model="props.row.title" style="width: 90%" />
            </div>

            <div class="flex-row notice-message">
              <div class="required-sign">*</div>
              <div class="notice-content">内容</div>
              <el-input
                v-model="props.row.content"
                autosize
                type="textarea"
                style="width: 90%"
              />
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row notice-footer ideal-middle-margin-top">
      <el-button type="primary" @click="clickRecover">{{
        t('recover')
      }}</el-button>
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>

    <el-dialog v-model="dialogPreviewVisible" title="模板预览" width="30%">
      <div>
        <div v-if="!isNote">【 {{ dialogTitle }} 】</div>
        <div style="margin: 5px">{{ dialogHeader }}</div>
        <div style="margin: 5px">
          &nbsp;&nbsp;&nbsp;&nbsp;{{ dialogContent }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import {
  receiverReceiveTemplate,
  receiverReceiveTemplateReset,
  receiverReceiveTemplateUpdate
} from '@/api/java/operate-center'

// 属性值
interface AddProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<AddProps>(), {
  rowData: null
})

const { t } = useI18n()

const tableData = ref<any[]>([])
onMounted(() => {
  getTemplate()
})
// 获取模版配置
const getTemplate = () => {
  if (!props.rowData?.messageType) {
    return
  }
  const params = { messageType: props.rowData.messageType }
  receiverReceiveTemplate(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        tableData.value = data.map((item: any) => {
          // 处理变量参数
          item.params = Object.keys(item.param).map((key: string) => {
            const dic = {
              title: key,
              value: item.param[key]
            }
            return dic
          })
          return item
        })

      } else {
        tableData.value = []
      }
    })
    .catch(_ => {
      tableData.value = []
    })
}
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '模版类型', prop: 'type', useSlot: true },
  { label: '变量参数', prop: 'parameters', useSlot: true },
  { label: '消息内容', prop: 'message', useSlot: true }
]
// 重置模版
const clickRecover = () => {
  if (!props.rowData?.messageType) {
    return
  }
  const params = { messageType: props.rowData.messageType }
  receiverReceiveTemplateReset(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        tableData.value = data.map((item: any) => {
          // 处理变量参数
          item.params = Object.keys(item.param).map((key: string) => {
            const dic = {
              title: key,
              value: item.param[key]
            }
            return dic
          })
          return item
        })
      } else {
        tableData.value = []
      }
    })
    .catch(_ => {
      tableData.value = []
    })
}
// 预览模版
const dialogPreviewVisible = ref(false)
const dialogTitle = ref('')
const dialogHeader = ref('')
const dialogContent = ref('')
const isNote = ref(false)
const clickPreview = (item: any) => {
  dialogPreviewVisible.value = true
  dialogTitle.value = item.title
  const arr = item.content.split('：')
  const contentArr = arr.slice(1) // 过滤数组第一条
  dialogHeader.value = arr[0]
  dialogContent.value = contentArr.join('：')
  isNote.value = item.channelType === 'SMS'
}

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  const arr: any[] = []
  tableData.value.forEach((item: any) => {
    const obj = {
      channelType: item.channelType,
      content: item.content,
      id: item.id,
      title: item.title,
      version: item.version
    }
    arr.push(obj)
  })
  receiverReceiveTemplateUpdate(arr).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      ElMessage.success('提交成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('提交失败')
    }
  })
}
</script>

<style scoped lang="scss">
.notice {
  background-color: white;
  .notice-message {
    align-items: center;
    margin: 3px 0;
    .required-sign {
      color: red;
    }
    .notice-title,
    .notice-content {
      margin: 0 3px;
    }
  }
  .notice-footer {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
