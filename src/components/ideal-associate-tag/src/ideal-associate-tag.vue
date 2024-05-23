<template>
  <div class="associate">
    <div class="flex-row associate__tip">
      <svg-icon
        icon="info-warning"
        color="#F3AD3C"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <span
        >如需标签批量绑定资源，请前往资源标签管理页面，点击<span
          class="associate__tip-enter"
          @click="clickTagList"
          >立即进入</span
        ></span
      >
    </div>

    <div class="flex-row associate-tag">
      <div class="flex-column associate-tag-left">
        <div class="flex-row associate-tag-left-header">
          <div>现有标签</div>
          <div class="flex-row" style="align-items: center">
            <el-input
              v-model="searchValue"
              class="ideal-default-margin-right"
              clearable
              @change="changeSearch"
            />
            <el-button>查询</el-button>
          </div>
        </div>

        <div class="associate-tag__exist">
          <el-row
            v-for="(item, index) in existTags"
            :key="index + 'exist'"
            class="flex-row associate-tag__exist-item"
          >
            <el-col :span="3"><el-checkbox v-model="item.selected" /></el-col>
            <el-col :span="6"
              ><div>{{ item.labelName }}</div></el-col
            >
            <el-col :span="3">
              <div
                v-if="item.labelType === 320001"
                class="associate-tag__item-bg"
                :style="{ backgroundColor: item.color }"
              ></div>
              <div
                v-else
                class="associate-tag__item-bg"
                :style="
                  'border:' + '3px' + ' ' + 'solid' + ' ' + item.color + ';'
                "
              ></div>
            </el-col>
            <el-col :span="6"
              ><div>{{ item.remark }}</div></el-col
            >
            <el-col :span="6">
              <div>{{ item.labelTypeDes }}</div></el-col
            >
          </el-row>
        </div>
      </div>

      <div class="flex-column associate-tag__button">
        <div>
          <el-button @click="clickPutIn">
            <svg-icon icon="right-arrow"></svg-icon>
          </el-button>
        </div>
        <div class="ideal-default-margin-top">
          <el-button @click="clickTakeOut">
            <svg-icon icon="left-arrow"></svg-icon>
          </el-button>
        </div>
      </div>

      <div class="associate-tag-right">
        <div class="associate-tag-right-header">已选标签</div>

        <div class="associate-tag__selected">
          <el-row
            v-for="(item, index) in selectedTags"
            :key="index + 'exist'"
            class="flex-row associate-tag__selected-item"
          >
            <el-col :span="3"><el-checkbox v-model="item.selected" /></el-col>
            <el-col :span="6"
              ><div>{{ item.labelName }}</div></el-col
            >
            <el-col :span="3">
              <div
                v-if="item.labelType === 320001"
                class="associate-tag__item-bg"
                :style="{ backgroundColor: item.color }"
              ></div>
              <div
                v-else
                class="associate-tag__item-bg"
                :style="
                  'border:' + '3px' + ' ' + 'solid' + ' ' + item.color + ';'
                "
              ></div>
            </el-col>
            <el-col :span="6"
              ><div>{{ item.remark }}</div></el-col
            >
            <el-col :span="6">
              <div>{{ item.labelTypeDes }}</div></el-col
            >
          </el-row>
        </div>
      </div>
    </div>

    <div class="flex-row footer-button ideal-default-margin-top">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum, resourceTypeEnum } from '@/utils/enum'
import { ElMessage } from 'element-plus'
import {
  queryResourceLabelList,
  resourceLabelBind
} from '@/api/java/business-center'
import { router } from '@/router'

const { t } = useI18n()

interface TagProps {
  rowData?: any
  resourceTypeCode?: resourceTypeEnum | string | undefined //资源类型code
}

const props = withDefaults(defineProps<TagProps>(), {
  rowData: () => ({}),
  resourceTypeCode: ''
})
// 现有标签查询
const searchValue = ref('')
const changeSearch = (value: string) => {
  existTags.value = saveTags.value
  if (value) {
    const filterArr = existTags.value.filter(
      (item: any) =>
        item.labelName === value || item.env === value || item.type === value
    )
    existTags.value = filterArr
  }
}
// 现有标签
const existTags = ref<any[]>([])
// 搜索现有标签时,搜索结束后重新对现有标签赋值
const saveTags = ref<any[]>([])
onMounted(() => {
  queryTags()
})

//查询现有标签
const queryTags = () => {
  queryResourceLabelList().then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      existTags.value = data
      saveTags.value = existTags.value
    } else {
      existTags.value = []
      saveTags.value = []
    }
  })
}

const clickPutIn = () => {
  // 已选
  const selected = existTags.value.filter((item: any) => item.selected)
  // 未选
  const unselected = existTags.value.filter((item: any) => !item.selected)
  existTags.value = unselected

  selected.forEach((item: any) => {
    selectedTags.value.push(item)
  })
}
// 已选标签
const selectedTags: any = ref([])
const clickTakeOut = () => {
  const selected = selectedTags.value.filter((item: any) => item.selected)
  const unselected = selectedTags.value.filter((item: any) => !item.selected)
  selectedTags.value = unselected
  selected.forEach((item: any) => {
    existTags.value.push(item)
  })
}
// 跳转标签
const clickTagList = () => {
  router.push({
    path: '/business-center/tag-manage/resource-tag/index'
  })
}
// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const cancelForm = () => {
  emit(EventEnum.cancel)
}
const submitForm = () => {
  const selected = selectedTags.value.filter((item: any) => item.selected)
  if (selected.length === 0) {
    return ElMessage.error('请至少选择一个标签')
  } else {
    const cloudLabelIds = selected.map((item: any) => {
      return item.id
    })
    const params = {
      cloudLabelIds,
      resourceBundleId: props.rowData.resourcePoolId || props.rowData.pool?.id,
      resourceTypeCode: props.resourceTypeCode,
      region: props.rowData.regionId,
      bindResourceUuIds: [props.rowData.uuid]
    }
    resourceLabelBind(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        ElMessage.success('资源绑定标签成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('资源绑定标签失败')
      }
    })
  }
}
</script>

<style scoped lang="scss">
.associate {
  width: 100%;
  .associate__tip {
    background-color: #fefbed;
    padding: 20px;
    align-items: center;
    .associate__tip-enter {
      color: var(--el-color-primary);
      cursor: pointer;
    }
  }
  .associate-tag {
    width: 100%;
    .associate-tag-left,
    .associate-tag-right {
      width: 45%;
      .associate-tag-left-header {
        margin: 10px 0;
        justify-content: space-between;
        align-items: center;
      }
      .associate-tag-right-header {
        margin: 10px 0;
        height: 34px;
        line-height: 34px;
      }
    }
    .associate-tag__exist,
    .associate-tag__selected {
      border: 1px solid #e7e7e7;
      border-radius: $circleRadiusSize;
      height: 300px;
      width: 100%;
      padding: 0;
      margin: 0;
      list-style: none;
      overflow: auto;
      .associate-tag__exist-item,
      .associate-tag__selected-item {
        align-items: center;
        padding: 5px;
        .associate-tag__item-bg {
          width: 20px;
          height: 20px;
          box-sizing: border-box;
        }
      }
    }
    .associate-tag__button {
      align-items: center;
      justify-content: center;
      width: 10%;
    }
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
