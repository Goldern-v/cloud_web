<template>
  <div class="set-platform">
    <ideal-table-list
      ref="tableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      :is-multiple="true"
      max-height="240"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #type>
        <el-table-column label="云平台类型">
          <template #default="props">
            <el-image
              :src="props.row?.url"
              :crossorigin="null"
              style="width: 32px; height: 32px"
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm()">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm()">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { cloudPlatformConfigSet, cloudPlatformConfig } from '@/api/java/operate-center'

const { t } = useI18n()

const tableRef = ref()
onMounted(() => {
  getList()
})
const getList = () => {
  cloudPlatformConfig().then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      const arr: any[] = []
      data.forEach((item: any) => {
        item.cloudPlatformTypes.forEach((child: any) => {
          const dic = Object.assign({}, child)
          dic.category = item.cloudCategory
          dic.categoryName = item.name
          arr.push(dic)
        })
      })
      state.dataList = arr
      nextTick(() => {
        state.dataList?.forEach((item: any) => {
          tableRef.value.IdealTableList.toggleRowSelection(item, item.enable)
        })
      })
    } else {
      state.dataList = []
    }
  }).catch(_ => {
    state.dataList = []
  })
}
// 列表
const state: IHooksOptions = reactive({})
const { selectionChangeHandle } = useCrud(state)

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '云平台类别', prop: 'categoryName' },
  { label: '云平台类型', prop: 'type', useSlot: true }
]
/* 
方法 
*/
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

//添加计费项规格
const submitForm = () => {
  const list: any[] = []
  state.dataListSelections?.forEach((item: any) => {
    const dic = {
      cloudCategory: item.category,
      cloudType: item.cloudType
    }
    list.push(dic)
  })
  cloudPlatformConfigSet({ list }).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('设置成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('设置失败')
    }
  })
}
</script>

<style scoped lang="scss">
.set-platform {
  background-color: white;
}
</style>
