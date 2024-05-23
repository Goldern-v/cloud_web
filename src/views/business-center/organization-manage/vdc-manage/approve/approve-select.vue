<template>
  <div class="approveMultipleSelect">
    <el-popover
      trigger="manual"
      :visible="popoverVisible"
      placement="bottom-start"
      :width="popoverWidth"
    >
      <template #reference>
        <div id="approve-input" class="multiple-search-select el-select">
          <div class="el-input el-input--suffix">
            <el-input readonly :placeholder="inputTip" style="width: 360px">
              <template #prefix>
                <div class="el-select__tags">
                  <div class="flex-row">
                    <div
                      v-for="(item, index) in selectApproveList"
                      :key="index + '-approve'"
                      class="item"
                    >
                      <span>{{ item.configName }}</span>
                      <i @click="selectItem(index)"
                        ><svg-icon icon="close-icon"></svg-icon
                      ></i>
                    </div>
                  </div>
                </div>
              </template>
              <template #suffix>
                <span
                  @mouseover="handleHoverIcon(true)"
                  @mouseleave="handleHoverIcon(false)"
                  ><span class="el-input__suffix-inner">
                    <i v-show="!showEmptyIcon"
                      ><svg-icon icon="down-arrow"></svg-icon
                    ></i>

                    <i
                      v-show="selectApproveList.length != 0 && showEmptyIcon"
                      @click="empty"
                      ><svg-icon icon="circle-close"></svg-icon
                    ></i> </span
                ></span>
              </template>
            </el-input>
          </div>
        </div>
      </template>
      <div id="approve-list" class="flex-row">
        <el-scrollbar>
          <el-radio-group
            v-model="form.type"
            class="flex-column"
            style="align-items: flex-start"
          >
            <el-radio label="no-approval">服务申请无需审批流程</el-radio>
            <el-radio label="approval">
              <div class="first-order flex-row">
                服务申请需审批<svg-icon icon="right-arrow"></svg-icon>
              </div>
            </el-radio>
          </el-radio-group>
        </el-scrollbar>

        <el-scrollbar v-if="showApprove">
          <el-checkbox v-model="checked" label="all" @change="checkAll">
            全选
          </el-checkbox>
          <el-divider style="margin: 0px"></el-divider>
          <el-checkbox-group v-model="form.approve" class="flex-column">
            <el-checkbox
              v-for="(item, index) of approveList"
              :key="index + 'vendor'"
              :label="item.id"
              >{{ item.configName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-scrollbar>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { bpmConfigListApi } from '@/api/java/bpm/config'
import { ElDivider } from 'element-plus'
interface tagProps {
  configApprove?: any //已经配置的审批项
}
const props = withDefaults(defineProps<tagProps>(), {
  configApprove: () => []
})

watch(
  () => props.configApprove,
  arr => {
    form.type = arr.length ? 'approval' : 'no-approval'
    form.approve = arr?.map((item: any) => item.configId)
  }
)
const form = reactive({
  type: '',
  approve: [],
  billing: false
})

document.addEventListener('click', function (event) {
  const target: any = event.target
  const dropdown = document.getElementById('approve-input')
  const popover = document.getElementById('approve-list')
  if (!dropdown) {
    return
  }
  if (dropdown?.contains(target) || popover?.contains(target)) {
    popoverVisible.value = true
  } else {
    popoverVisible.value = false
  }
  document.getElementById('approve-input') &&
    document.getElementById('approve-input')?.blur()
})

onMounted(() => {
  getApproveList()
})
/**
 * 获取需审批的服务申请
 */
const approveList: any = ref([])
const getApproveList = () => {
  let params = {
    pageNum: 1,
    pageSize: 9999
  }
  bpmConfigListApi(params).then((res: any) => {
    if (res.code === 200) {
      approveList.value = res.data.data
    }
  })
}

const selectApproveList: any = ref([])
const emit = defineEmits(['selectApprove'])
watch(
  () => [form.approve, approveList?.value],
  ([arr1, arr2]) => {
    if (form.type === 'approval' && arr2.length) {
      inputTip.value = ''
      selectApproveList.value = arr2.filter((item: any) =>
        arr1.some((ele: any) => ele === item.id)
      )
    }
    emit('selectApprove', form.approve, selectApproveList.value)
  },
  { deep: true, immediate: true }
)

watch(
  () => selectApproveList.value,
  arr => {},
  { immediate: true, deep: true }
)
/**
 * 弹出框
 */
const popoverVisible = ref(false) //弹出框是否展示
const showApprove = ref(false) //二级需审批的服务是否展示
const popoverWidth = ref('180px') //弹出框宽度
const checked = ref(false)

//全选
const checkAll = (val: string) => {
  if (val) {
    form.approve = approveList.value.map((item: any) => item.id)
  } else {
    form.approve = []
  }
}
//hover显示清空图标
const handleHoverIcon = (sign: any) => {
  showEmptyIcon.value = sign ? selectApproveList.value.length != 0 : sign
}

const inputTip = ref('请选择')
const showEmptyIcon = ref(false) //清空选择图标的展示隐藏状态

//全部清空
const empty = () => {
  form.approve.splice(0, form.approve.length)
  selectApproveList.value = []
  checked.value = false
  form.type = ''
  popoverVisible.value = false
}

watch(
  () => form.type,
  val => {
    showApprove.value = val === 'approval'
    popoverWidth.value = val === 'approval' ? '360px' : '180px'
    if (form.type == 'no-approval') {
      inputTip.value = ''
      form.approve = []
      selectApproveList.value = [{ configName: '服务申请无需审批流程' }]
    }
  },
  { immediate: true }
)

//取消已选择的审批项
const selectItem = (index: number) => {
  form.approve.splice(index, 1)
  if (selectApproveList.value.length == 0) {
    inputTip.value = '请选择'
    form.type = ''
  }
}
</script>

<style lang="scss" scoped>
.multiple-search-select {
  width: 100%;
  .el-select__tags {
    flex-wrap: nowrap;
    color: $gray7-light;
    align-items: baseline;
    // 隐藏两个之后的所有Tag，并在第三个Tag之前展示...
    .item {
      &:nth-child(1),
      &:nth-child(2) {
        background: $gray2-light;
        margin-right: 5px;
        height: 20px;
        line-height: 20px;
      }
      &:nth-child(n + 3) {
        width: 0;
        padding: 0;
        height: 0;
        margin: 0;
        color: rgba(0, 0, 0, 0);
        border-color: unset;
        background: none;
        i {
          display: none;
        }
      }
      &:nth-child(3) {
        position: relative;
        &:before {
          content: '...';
          position: absolute;
          left: 5px;
          top: 0px;
          width: 26px;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          background-color: #f4f4f5;
          color: #909399;
          box-sizing: border-box;
          border: 1px solid #e9e9eb;
          border-radius: 4px;
        }
      }
      span {
        margin-left: 5px;
      }
    }
  }
  .el-divider--horizontal {
    margin: 0px;
  }
  .el-input__suffix {
    cursor: pointer;
  }
}
// 隐藏两个之后的所有Tag，并在第三个Tag之前展示...
</style>
