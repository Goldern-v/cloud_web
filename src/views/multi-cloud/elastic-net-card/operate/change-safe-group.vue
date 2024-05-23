<template>
  <div class="change-safe-group">
    <el-form :model="form" :rules="rules" label-position="left">
      <el-form-item label="辅助弹性网卡" prop="fixedIp">
        <span style="font-weight: bold; color: #000">{{ form.fixedIp }}</span>
      </el-form-item>

      <el-form-item label="安全组" prop="securityGroup">
        <div class="flex-column" style="width: 90%">
          <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />
          <ideal-table-list
            ref="safeGroupListRef"
            :loading="state.dataListLoading"
            :table-data="state.dataList"
            :table-headers="tableHeaders"
            :show-pagination="false"
            is-multiple
            max-height="300"
            @handleSelectionChange="selectionChangeHandle"
          >
            <template #name>
              <el-table-column label="名称">
                <template #default="props">
                  <div class="ideal-theme-text">{{ props.row.name }}</div>
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
        </div>
      </el-form-item>

      <el-form-item>
        <template #label>
          <div>
            您已选择<span v-if="isSelected">（{{ selectedNumber }}）</span>
          </div>
        </template>

        <div
          v-for="(item, index) of state.dataListSelections"
          :key="index"
          class="flex-row assist-netcard-tags"
        >
          <div class="flex-row assist-netcard-tags-item">
            <div>{{ item.name }}</div>
            <svg-icon
              icon="close-icon"
              class="item-close-icon"
              @click="clickDeleteItem(item)"
            ></svg-icon>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum, FiltrateEnum } from '@/utils/enum'
import {
  safeGroupListByInstanceUrl,
  editAssistNic,
  safeGroupBindGroups
} from '@/api/java/network'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus/es'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealTextProp
} from '@/types'

interface NicProps {
  rowData?: any // 行数据
  nicType: string
}
const props = withDefaults(defineProps<NicProps>(), {
  rowData: () => ({}),
  nicType: ''
})

const { t } = useI18n()

onMounted(() => {
  form.fixedIp = props.rowData.fixedIp
})
const form = reactive({
  fixedIp: ''
})
const rules = reactive<FormRules>({})

/**
 * 列表
 */
//搜索
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'UUID', prop: 'uuid', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      state.queryForm[item.prop] = temp[1]
    })
  }
  getDataList()
}

const commonParams = {
  resourcePoolId: props.rowData.resourcePoolId,
  regionId: props.rowData.regionId,
  projectId: props.rowData.projectId
}
const state: IHooksOptions = reactive({
  dataListUrl: safeGroupListByInstanceUrl,
  deleteUrl: '',
  isPage: false,
  queryForm: {
    ...commonParams,
    instanceUuid: props.rowData.uuid
  }
})
watch(
  () => state.dataList,
  arr => {
    arr?.forEach(ele => {
      safeGroupListRef.value.IdealTableList.toggleRowSelection(
        ele,
        ele.bindFlag === '1'
      )
    })
  }
)
const { getDataList, selectionChangeHandle } = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '访问规则', prop: 'ruleDetailString' }
]

// 是否选择了安全组
const isSelected = ref(false)
// 选择的安全组数量
const selectedNumber = ref(0)
watch(
  () => state.dataListSelections,
  value => {
    isSelected.value = false
    selectedNumber.value = 0
    if (value?.length) {
      isSelected.value = true
      selectedNumber.value = value.length
    }
  }
)

// 获取列表dom
const safeGroupListRef = ref()
// 删除选择的安全组
const clickDeleteItem = (row: any) => {
  state.dataList?.forEach((item: any) => {
    if (item.name === row.name) {
      safeGroupListRef.value.IdealTableList.toggleRowSelection(item, false)
    }
  })
}
/**
 * 确定、取消
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
  if (!isSelected.value) {
    return ElMessage.warning('请至少选择一个安全组')
  }
  const arr = state.dataListSelections?.map((item: any) => {
    return item.uuid
  })
  let params: any = {}
  //网卡类型  (MAIN_CARD  主网卡,EXTEND_CARD  扩展网卡,BACKUP_CARD 辅助网卡)
  if (props.nicType === 'MAIN_CARD') {
    params = {
      ...commonParams,
      vdcId: props.rowData.vdcId,
      securityGroupList: arr,
      instanceuuid: props.rowData.bindInstanceUuid
    }
    showLoading('更换安全组中...')
    safeGroupBindGroups(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          ElMessage.success('更换安全组成功')
          emit(EventEnum.success)
        } else {
          ElMessage.success('更换安全组失败')
        }
        hideLoading()
      })
      .catch(() => {
        hideLoading()
      })
  } else {
    params = {
      ...commonParams,
      uuid: props.rowData.uuid,
      securityGroups: arr
    }
    showLoading('更换安全组中...')
    editAssistNic(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          ElMessage.success('更换安全组成功')
          emit(EventEnum.success)
        } else {
          ElMessage.success('更换安全组失败')
        }
        hideLoading()
      })
      .catch(() => {
        hideLoading()
      })
  }
}
</script>

<style scoped lang="scss">
.change-safe-group {
  .assist-netcard-tags {
    white-space: nowrap;
    margin: 3px 5px;
    .assist-netcard-tags-item {
      background-color: $gray1-light;
      padding: 2px 10px;
      border-radius: $circleRadiusSize;
      .item-close-icon {
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }
}
</style>
