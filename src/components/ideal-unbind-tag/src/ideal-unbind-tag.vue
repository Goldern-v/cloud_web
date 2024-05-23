<template>
  <div class="unbind-tag-container">
    <ideal-alert-info :alert-props="alertProps" />
    <div
      class="default-input"
      :class="focus && 'select-input'"
      @click="focus = true"
    >
      <el-tag
        v-for="(item, idx) in selectedTags"
        :key="idx"
        closable
        type="info"
        :color="item.color"
        style="color: #fff"
        @close="selectedTags.splice(idx, 1)"
      >
        {{ item.name }}
      </el-tag>
      <el-popover
        trigger="manual"
        placement="bottom-start"
        :visible="popoverVisible"
        width="25%"
      >
        <template #reference>
          <input
            v-model="searchTagInput"
            class="tagInput"
            placeholder="请选择标签或输入标签名称进行搜索"
            @click="handleShowTag"
            @blur="focus = false"
          />
        </template>
        <div>
          <el-tabs v-model="tagsActiveTab">
            <el-tab-pane label="公共标签" name="publicTag">
              <div style="display: flex; flex-wrap: wrap; gap: 5px">
                <span
                  v-for="item in tagsList.publicTags.filter(
                    (n:any) => n.name.indexOf(searchTagInput.trim()) > -1
                  )"
                  :key="item.id"
                  :class="{
                    selected: selectedTagIdsTemp.includes(item.id)
                  }"
                  class="selectTag"
                  :style="{ backgroundColor: item.color }"
                  @click="toggleTagSelect(item.id)"
                >
                  {{ item.name }}
                </span>
              </div>
            </el-tab-pane>

            <el-tab-pane label="私有标签" name="privateTag">
              <div style="display: flex; flex-wrap: wrap; gap: 5px">
                <span
                  v-for="item in tagsList.privateTags.filter(
                    (n:any) => n.name.indexOf(searchTagInput.trim()) > -1
                  )"
                  :key="item.id"
                  :class="{
                    selected: selectedTagIdsTemp.includes(item.id)
                  }"
                  class="selectTag"
                  :style="
                    'border:' +
                    '3px' +
                    ' ' +
                    'solid' +
                    ' ' +
                    item.color +
                    ';color:' +
                    item.color +
                    ';'
                  "
                  @click="toggleTagSelect(item.id)"
                >
                  {{ item.name }}
                </span>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-divider></el-divider>
          <div class="ideal-default-margin-top">
            <el-button type="primary" size="small" @click="handleSelectTag">{{
              t('confirm')
            }}</el-button>
            <el-button size="small" @click="popoverVisible = false">{{
              t('cancel')
            }}</el-button>
          </div>
        </div>
      </el-popover>
    </div>
    <ideal-table-list
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      is-multiple
      :show-pagination="false"
      @handleSelectionChange="selectionChangeHandle"
    >
    </ideal-table-list>
    <!-- @clickSizeChange="sizeChangeHandle"
    @clickCurrentChange="currentChangeHandle" -->
    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum, resourceTypeEnum } from '@/utils/enum'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { ElMessage } from 'element-plus'
import {
  queryResourceLabelList,
  queryBindResourceList,
  resourceLabelUnbind
} from '@/api/java/business-center'

interface TagProps {
  resourceTypeCode?: resourceTypeEnum | string | undefined //资源类型code
}

const props = withDefaults(defineProps<TagProps>(), {
  resourceTypeCode: ''
})

const { t } = useI18n()

const alertProps = {
  alertTitleList: ['请选择一个或多个资源标签进行批量解绑操作'],
  type: 'info'
}

const focus = ref(false)
const popoverVisible = ref(false)
const tagsActiveTab = ref('publicTag')

onMounted(() => {
  queryTags()
})

//查询标签
const tagsList = reactive({
  privateTags: [] as any[],
  publicTags: [] as any[]
})
const queryTags = () => {
  queryResourceLabelList().then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      tagsList.publicTags = data.filter(
        (item: any) => item.labelType === 320001
      )
      tagsList.privateTags = data.filter(
        (item: any) => item.labelType === 320002
      )
    } else {
      tagsList.privateTags = []
      tagsList.publicTags = []
    }
  })
}
//所有标签
const allTags = computed(() => {
  return [...tagsList.publicTags, ...tagsList.privateTags]
})

const searchTagInput = ref('') //搜索的标签
//切换标签选中状态
const selectedTagIdsTemp: any = ref([]) //选中标签的id
const toggleTagSelect = (tagId: string) => {
  if (!selectedTagIdsTemp.value.includes(tagId)) {
    selectedTagIdsTemp.value.push(tagId)
  } else {
    const index = selectedTagIdsTemp.value.findIndex((n: string) => n === tagId)
    selectedTagIdsTemp.value.splice(index, 1)
  }
}
//选择标签
const selectedTags: any = ref([])
const handleSelectTag = (type: any) => {
  selectedTags.value = allTags.value.filter(n =>
    selectedTagIdsTemp.value.includes(n.id)
  )
  popoverVisible.value = false
}

/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: queryBindResourceList,
  deleteUrl: '',
  createdIsNeed: false,
  isPage: false,
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '标签数', prop: 'bindLabelCount' }
]

//根据选择的标签查询关联的资源
watch(
  () => selectedTags.value,
  arr => {
    if (arr.length > 0) {
      const cloudLabelIds = arr
        .map((item: any) => {
          return item.id
        })
        .join(',')
      state.queryForm = {
        cloudLabelIds,
        resourceType: props.resourceTypeCode
      }
      getDataList()
    } else {
      state.dataList = []
    }
  },
  { deep: true }
)
//展示标签
const handleShowTag = () => {
  popoverVisible.value = true
  selectedTagIdsTemp.value = selectedTags.value.map((n: any) => n.id)
  focus.value = true
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

const multipleResource: any = ref([]) //选中的资源
watch(
  () => state.dataListSelections,
  value => {
    if (value) {
      multipleResource.value = value
    }
  }
)
const submitForm = () => {
  if (!state.dataListSelections?.length) {
    return ElMessage.error('请至少选择一个资源')
  } else {
    const cloudLabelIds = selectedTags.value.map((item: any) => {
      return item.id
    })
    const bindResourceUuIds = state.dataListSelections?.map((item: any) => {
      return item.resourceUuid
    })
    const params = {
      cloudLabelIds,
      bindResourceUuIds,
      resourceTypeCode: props.resourceTypeCode
    }
    resourceLabelUnbind(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        ElMessage.success('资源解绑标签成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('资源解绑标签失败')
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.el-alert--info {
  color: var(--el-color-primary);
  background-color: var(--custom-information-bg-color);
}
.default-input {
  border: 1px solid var(--el-border-color-light);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  position: relative;
  padding: 5px 0;
  margin-bottom: 10px;
  border-radius: 2px;
}

.select-input {
  border-color: #006eff;
}
:deep .el-tabs__item {
  font-size: 12px;
}
.selectTag {
  cursor: pointer;
  color: #ffffff;
  font-size: 12px;
  padding: 1px 8px;
  border-radius: 2px;
  height: 24px;
  line-height: 20px;
  box-sizing: border-box;
}
.selectTag.selected {
  position: relative;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.5) 100%
  );
  &::after {
    position: absolute;
    right: 0;
    content: url('@/icons/svg/selected.svg');
  }
}

:deep .el-button--small {
  height: 26px;
  line-height: 26px;
}
.tagInput {
  width: 260px;
  height: 25px;
  border: none;
  padding: 0 10px;
}
:deep .pagination-container {
  padding-bottom: 0 !important;
}
</style>
