<template>
  <div class="ideal-large-margin create">
    <div class="create-box">
      <div class="flex-row ideal-header-container">
        <el-divider direction="vertical" />
        <div>资源标签</div>
      </div>

      <div
        v-for="item of resourceTagData"
        :key="item.tagColor"
        class="flex-row create-color-box"
      >
        <tag-input-background
          v-model="colorSelect"
          :color-item="item"
          @getDate="getDate"
          @deleteDate="deleteDate"
          @deleteAllDate="deleteAllDate"
        ></tag-input-background>
      </div>
    </div>

    <div class="flex-row create-button">
      <el-button type="primary" @click="clickSave">{{ t('save') }}</el-button>
      <el-button @click="clickCancel">{{ t('back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import tagInputBackground from './tagInputBackground.vue'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { createResourceLabel } from '@/api/java/business-center'

const { t } = useI18n()

const colorSelect = ref('')
const resourceTagData: any = [
  {
    resource: [],
    tagColor: '#EC5A59',
    remark: [],
    sequence: 0
  },
  {
    resource: [],
    tagColor: '#57BFD4',
    remark: [],
    sequence: 1
  },
  {
    resource: [],
    tagColor: '#E56B90',
    remark: [],
    sequence: 2
  },
  {
    resource: [],
    tagColor: '#F09150',
    remark: [],
    sequence: 3
  },
  {
    resource: [],
    tagColor: '#899CF8',
    remark: [],
    sequence: 4
  },
  {
    resource: [],
    tagColor: '#E8C241',
    remark: [],
    sequence: 5
  },
  {
    resource: [],
    tagColor: '#69A7F8',
    remark: '',
    sequence: 6
  },
  {
    resource: [],
    tagColor: '#D2A376',
    remark: [],
    sequence: 7
  }
]
const tagOptions: any = ref([])

const getDate = (data: any, color: string, sequence: number) => {
  console.log(data, color, sequence)
  if (data.length === 0) {
    for (const item in resourceTagData) {
      if (resourceTagData[item].sequence === sequence) {
        resourceTagData[item].resource = []
      }
    }
  } else {
    const newData = [...new Set(data)]
    for (const j in resourceTagData) {
      if (resourceTagData[j].sequence === sequence) {
        for (const i in newData) {
          resourceTagData[j].resource.push(newData[i])
        }
        resourceTagData[j].resource = [...new Set(resourceTagData[j].resource)]
        resourceTagData[j].tagColor = color
      }
    }
  }
}
const deleteDate = (data: any, color: string, sequence: number) => {
  for (const j in resourceTagData) {
    if (resourceTagData[j].sequence === sequence) {
      for (const i in resourceTagData[j].resource) {
        resourceTagData[j].resource = resourceTagData[j].resource.filter(
          (v: any) => v[i] === data
        )
      }
    }
  }
}
const deleteAllDate = (data: any, color: string, sequence: number) => {
  for (const item in resourceTagData) {
    if (resourceTagData[item].sequence === sequence) {
      resourceTagData[item].resource = []
    }
  }
}

/**
 * 确定/取消
 */
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const router = useRouter()
const route = useRoute()
const clickCancel = () => {
  router.back()
}
const clickSave = () => {
  let params = []
  let paramsData = {}
  for (let i in resourceTagData) {
    let tagData: any = resourceTagData[i]
    if (tagData.resource.length !== 0 && tagData.resource.length < 2) {
      paramsData = {
        color: resourceTagData[i].tagColor,
        name: resourceTagData[i].resource[0],
        labelType: route.query.labelType,
        remark: '--'
      }
      params.push(paramsData)
    } else if (tagData.resource.length >= 2) {
      for (let j in tagData.resource) {
        paramsData = {
          color: resourceTagData[i].tagColor,
          name: resourceTagData[i].resource[j],
          labelType: route.query.labelType,
          remark: '--'
        }
        params.push(paramsData)
      }
    }
  }
  showLoading('创建中...')
  createResourceLabel(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        ElMessage.success('创建成功')
        router.push({
          path: '/business-center/tag-manage/resource-tag/index',
          query: {
            labelType: route.query.labelType
          }
        })
      } else {
        ElMessage.error('创建失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.create {
  box-sizing: border-box;
  .create-box {
    padding: 20px;
    background-color: white;
    // 修改分割线颜色
    :deep(.el-divider--vertical) {
      border-left: 2px var(--el-color-primary) solid;
    }
    .create-color-box {
      margin: 10px 0;
      align-items: center;
      .create-color-large {
        width: 36px;
        height: 36px;
        background-color: $gray1-light;
        border: 1px solid #a6a6a6;
        border-radius: $circleRadiusSize;
        .create-color-small {
          margin: 4px;
          width: 28px;
          height: 28px;
          border-radius: $circleRadiusSize;
        }
      }
    }
  }
  .create-button {
    padding: 20px;
    margin-top: 10px;
    background-color: white;
    align-items: center;
  }
}
</style>
