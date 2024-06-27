<template>
  <div class="route-create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="路由表" prop="name">
        <div>
          {{ detailInfo.name }}({{
            detailInfo.defaultRoute ? '默认路由表' : '自定义路由表'
          }})
        </div>
      </el-form-item>

      <el-form-item>
        <ideal-table-list
          :table-data="form.routeData"
          :table-headers="tableHeaders"
          :show-pagination="false"
        >
          <template #destinationType>
            <el-table-column label="目的地址类型">
              <template #default="props">
                <el-select
                  v-model="props.row.destinationType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in destinationTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
          </template>

          <template #destination>
            <el-table-column label="目的地址">
              <template #default="props">
                <el-tooltip
                  :visible="props.row.verifyDestination.mark"
                  trigger="click"
                  placement="right"
                >
                  <template #content>
                    <svg-icon
                      icon="close"
                      class="ideal-svg-margin-right"
                      color="var(--el-color-danger)"
                    ></svg-icon>
                    <span>{{ props.row.verifyDestination.text }}</span>
                  </template>
                  <el-input
                    v-model="props.row.destination"
                    @blur="checkDestination(props.row)"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
          </template>

          <template #nextHopType>
            <el-table-column label="下一跳类型">
              <template #default="props">
                <el-tooltip
                  :visible="props.row.verifyNextType.mark"
                  trigger="click"
                  placement="right"
                >
                  <template #content>
                    <svg-icon
                      icon="close"
                      class="ideal-svg-margin-right"
                      color="var(--el-color-danger)"
                    ></svg-icon>
                    <span>{{ props.row.verifyNextType.text }}</span>
                  </template>
                  <el-select
                    v-model="props.row.nextHopType"
                    placeholder="请选择"
                    @change="nextTypeChange(props.row)"
                  >
                    <el-option
                      v-for="item in nextTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>

          <template #nextHop>
            <el-table-column label="下一跳">
              <template #default="props">
                <el-tooltip
                  :visible="props.row.verifyNext.mark"
                  trigger="click"
                  placement="right"
                >
                  <template #content>
                    <svg-icon
                      icon="close"
                      class="ideal-svg-margin-right"
                      color="var(--el-color-danger)"
                    ></svg-icon>
                    <span>{{ props.row.verifyNext.text }}</span>
                  </template>
                  <el-cascader
                    v-if="isTencent && props.row.nextHopType === 'ECS'"
                    v-model="props.row.nextHop"
                    :options="props.row.privateIpList"
                    :props="cascaderProps"
                    :show-all-levels="false"
                    placeholder="请选择"
                  />
                  <el-select
                    v-else
                    v-model="props.row.nextHop"
                    placeholder="请选择"
                    @change="nextChange(props.row)"
                  >
                    <el-option
                      v-for="item in props.row.nextList"
                      :key="item.value"
                      :label="item.name"
                      :value="item.uuid"
                    />
                  </el-select>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>

          <template #description>
            <el-table-column label="描述">
              <template #default="props">
                <div class="flex-row route-create-description">
                  <el-input v-model="props.row.description" />
                  <svg-icon
                    v-if="!isEditMode"
                    icon="delete-icon"
                    class="ideal-svg-margin-left"
                    @click="clickDeleteRoute(props.$index)"
                  ></svg-icon>
                </div>
              </template>
            </el-table-column>
          </template>
        </ideal-table-list>

        <div
          v-if="!isEditMode"
          class="flex-row route-create__add-route"
          @click="clickAddRoute"
        >
          <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
          继续添加
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { nextTypeList, destinationTypeList, getNextHop } from './constant'
import { queryCloudHostList } from '@/api/java/compute'
import {
  routesAddToRouteTable,
  editRouteInRouteTable
} from '@/api/java/network'

interface RouteProps {
  defaultRouterList?: any[] //默认路由
  rowData?: any // 行数据
  detailInfo?: any //详情信息
}
const props = withDefaults(defineProps<RouteProps>(), {
  defaultRouterList: () => [],
  rowData: () => ({}),
  detailInfo: () => ({})
})

watch(
  () => props.detailInfo,
  val => {
    console.log(val, 'detailInfo')
  }
)

const { t } = useI18n()

const form = reactive({
  name: '',
  routeData: [
    {
      destinationType: 'ipAddress',
      destination: '',
      nextHop: '',
      verifyDestination: {
        mark: false,
        text: ''
      }, //目的地址校验
      verifyNextType: {
        mark: false,
        text: ''
      }, //下一跳类型校验
      verifyNext: {
        mark: false,
        text: ''
      }, //下一跳校验
      nextList: [],
      privateIpList: []
    }
  ] as any
})

const isEditMode = computed(() => Object.keys(props.rowData).length > 0) //是否编辑页面

const route = useRoute()
const cloudType = route.query.cloudType as string
const cloudCategory = route.query.cloudCategory as string
//是否腾讯云
const isTencent = computed(
  () =>
    RegExp(/TENCENT_CLOUD/).test(cloudType) &&
    RegExp(/PUBLIC/).test(cloudCategory)
)

onMounted(() => {
  if (isEditMode.value) {
    getEditData()
  }
})

const getEditData = async () => {
  const res: any = await queryCloudHostList({
    vpcId: props.detailInfo?.vpc?.uuid
  })
  const { code, data } = res
  if (code === 200) {
    if (isTencent.value) {
      data.forEach((ele: any) => {
        ele.nicList.forEach((item: any) => {
          item.name = item.fixedIp
        })
      })
      form.routeData[0].privateIpList = data
    } else {
      form.routeData[0].nextList = data
    }
    form.routeData[0].nextHopType = props.rowData.nextHopType
    form.routeData[0].destination = props.rowData.destination
    form.routeData[0].nextHop = props.rowData.nextHop
    form.routeData[0].nextHopName = props.rowData.nextHopName
    form.routeData[0].description = props.rowData.description
  }
}

watch(
  () => props.defaultRouterList,
  val => {
    console.log(val, '默认路由1')
  },
  { deep: true, immediate: true }
)
//校验
const rules = reactive<FormRules>({})
const checkDestination = (val: any) => {
  let text: string = ''
  if (!val.destination) {
    text = '输入不能为空'
  }
  val.verifyDestination.mark = text ? true : false
  val.verifyDestination.text = text
}
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '目的地址类型', prop: 'destinationType', useSlot: true },
  { label: '目的地址', prop: 'destination', useSlot: true },
  { label: '下一跳类型', prop: 'nextHopType', useSlot: true },
  { label: '下一跳', prop: 'nextHop', useSlot: true },
  { label: '描述', prop: 'description', useSlot: true }
]

const nextTypeChange = (row: any) => {
  row.nextHop = ''
  row.nextList = []
  row.privateIpList = []
  queryNextHop(row)
}
const cascaderProps = {
  value: 'name',
  label: 'name',
  children: 'nicList'
}

const detail: any = ref({})
//查询下一跳
const queryNextHop = (row: any) => {
  if (row.nextHopType === 'ECS') {
    queryCloudHostList({ vpcId: props.detailInfo?.vpc?.uuid }).then(
      (res: any) => {
        const { code, data } = res
        if (code === 200) {
          if (isTencent.value) {
            data.forEach((ele: any) => {
              ele.nicList.forEach((item: any) => {
                item.name = item.fixedIp
              })
            })
            row.privateIpList = data
          } else {
            row.nextList = data
          }
        } else {
          row.privateIpList = []
          row.nextList = []
        }
      }
    )
  }
  detail.value = row
  if (isEditMode.value) {
  }
}
const nextChange = (val: any) => {
  const nextInfo = val.nextList.find((item: any) => item.uuid === val.nextHop)
  if (nextInfo) {
    val.nextHopName = nextInfo.name
  }
}
// 添加路由
const clickAddRoute = () => {
  form.routeData.push({
    destinationType: '',
    destination: '',
    nextHopType: '',
    nextHop: '' || [],
    nextHopName: '',
    description: '',
    verifyDestination: {
      mark: false,
      text: ''
    }, //目的地址校验
    verifyNextType: {
      mark: false,
      text: ''
    }, //下一跳类型校验
    verifyNext: {
      mark: false,
      text: ''
    } //下一跳校验
  })
}
// 删除路由
const clickDeleteRoute = (index: number) => {
  form.routeData.splice(index, 1)
}
/**
 * 保存、取消
 */
// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const formRef = ref<FormInstance>()
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}

const commonParams = {
  resourcePoolId: props.detailInfo.resourcePoolId,
  regionId: props.detailInfo.regionId,
  projectId: props.detailInfo.projectId
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (valid) {
      let params: any = {
        name: props.detailInfo.name,
        id: props.detailInfo.id,
        ...commonParams
      }
      if (!isEditMode.value) {
        const routeList = form.routeData.map((item: any) => {
          let obj: { [key: string]: any } = {
            destination: item.destination,
            nextHopType: item.nextHopType,
            description: item.description
          }
          //腾讯云下一跳类型需传云主机的内网ip，其他云传云主机的uuid
          if (isTencent.value) {
            obj.nextHop = getNextHop(item).nextHop
            obj.nextHopName = getNextHop(item).nextHopName
          } else {
            obj.nextHop = item.nextHop
            obj.nextHopName = item.nextHopName
          }
          return obj
        })
        params.routeList = routeList
        showLoading('添加路由中...')
        routesAddToRouteTable(params)
          .then((res: any) => {
            const { data, code } = res
            if (code === 200) {
              ElMessage.success('添加路由成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('添加路由失败')
            }
            hideLoading()
          })
          .catch(err => {
            hideLoading()
          })
      } else {
        const route: { [key: string]: any } = {
          id: props.rowData.id,
          destination: form.routeData[0].destination,
          nextHopType: form.routeData[0].nextHopType,
          description: form.routeData[0].description
        }
        if (isTencent.value) {
          route.nextHop = getNextHop(form.routeData[0]).nextHop
          route.nextHopName = getNextHop(form.routeData[0]).nextHopName
        } else {
          route.nextHop = form.routeData[0].nextHop
          route.nextHopName = form.routeData[0].nextHopName
        }
        params.route = route
        showLoading('修改路由中...')
        editRouteInRouteTable(params)
          .then((res: any) => {
            const { data, code } = res
            if (code === 200) {
              ElMessage.success('修改路由成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('修改路由失败')
            }
            hideLoading()
          })
          .catch(err => {
            hideLoading()
          })
      }
    }
  })
}
</script>

<style scoped lang="scss">
.route-create {
  .route-create__add-route {
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 10px;
    cursor: pointer;
  }
  .route-create-description {
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
