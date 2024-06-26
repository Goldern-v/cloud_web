<template>
  <div>
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      is-radio
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @clickTableCellRow="clickTableCellRow"
    >
      <template #name>
        <el-table-column label="联系组名称" prop="name"></el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import type { IdealTableColumnHeaders } from '@/types'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import {
  alarmContactGroupList,
  contactPersonBindContactGroup
} from '@/api/java/maintenance-center'

// 属性值
interface DialogProps {
  multiContactPerson?: any[] //  选中的联系人
}
const props = withDefaults(defineProps<DialogProps>(), {
  multiContactPerson: () => []
})

const { t } = useI18n()

/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: alarmContactGroupList,
  deleteUrl: '',
  queryForm: {}
})
const { sizeChangeHandle, currentChangeHandle } = useCrud(state)

const router = useRouter()

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '联系组名称', prop: 'name', useSlot: true }
]

state.dataList = [
  {
    name: 'cloud-host-test',
    resourceType: '云主机',
    id: 'suwh-jsxqjs12',
    alarmSeverity: '提醒告警',
    alarmType: '预测告警'
  }
]

const selectContactGroup: any = ref([])
const clickTableCellRow = (row: any) => {
  selectContactGroup.value.push({
    name: row.name,
    id: row.id
  })
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
  const contacts: any = []
  props.multiContactPerson.forEach((ele: any) => {
    contacts.push({
      id: ele.id,
      name: ele.name
    })
  })
  const params = {
    contacts,
    groups: selectContactGroup.value
  }
  if (!selectContactGroup.value.length) {
    return ElMessage.warning('请选择联系组')
  } else {
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
.alarm-rule {
  background-color: #fff;
  padding: $idealPadding;
  .flex-row-center {
    align-items: center;
    justify-content: center;
  }
  .expandTable {
    padding: 0 $idealPadding;
  }
  ul {
    flex-wrap: wrap;
    li {
      width: 50%;
      list-style-type: none;
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
