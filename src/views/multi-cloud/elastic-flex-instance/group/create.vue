<template>
  <div class="create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="区域">
          <div>
            <div>{{ form.regionName }}</div>
            <div class="ideal-tip-text">
              不同区域的云服务产品之间内网互不相通；请就近选择靠近您业务的区域，可减少网络时延，提高访问速度。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="可用区">
          <el-select
            v-model="form.availableArea"
            multiple
            placeholder="请选择"
            class="input-box"
          >
            <el-option
              v-for="item in selectData.availableAreas"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="指在同一区域下，电力、网络隔离的物理区域，可用区之间内网互通，不同可用区之间物理隔离。如果您需要提高应用的高可用性，建议您将云服务器创建在不同的可用区内。如果您需要较低的网络时延，建议您将云服务器创建在相同的可用区内。"
            placement="right"
          >
            <svg-icon icon="question-icon" class="ideal-svg-margin-left" />
          </el-tooltip>
        </el-form-item>

        <el-form-item label="多可用区扩展策略">
          <el-radio-group v-model="form.expandPolicy">
            <el-radio label="1">均衡分布</el-radio>
            <el-radio label="2">选择优先</el-radio>
          </el-radio-group>

          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="均衡分布: 弹性云服务器扩容时优先保证选择的可用区列表中各可用区下弹性云服务器数量均衡，当无法在目标可用区下完成弹性云服务器扩容时，按照选择优先原则选择其他可用区。选择优先: 弹性云服务器扩容时目标可用区的选择按照选择的可用区列表的顺序进行优先级排序。"
            placement="right"
          >
            <svg-icon icon="question-icon" class="ideal-svg-margin-left" />
          </el-tooltip>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="名称">
          <el-input v-model="form.name" class="input-box"/>
        </el-form-item>

        <el-form-item label="最大实例数(台)">
          <el-input v-model="form.maxNumber" class="input-box"/>
        </el-form-item>

        <el-form-item label="期望实例数(台)">
          <el-input v-model="form.expectNumber" class="input-box"/>
        </el-form-item>

        <el-form-item label="最小实例数(台)">
          <el-input v-model="form.minNumber" class="input-box"/>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <div class="ideal-tip-text">
          选择伸缩配置作为您创建的伸缩组内伸缩实例的模板；选择子网后将向伸缩组中的每个实例分配IP地址。
        </div>
        <el-form-item label="伸缩配置" class="ideal-default-margin-top">
          <el-input class="input-box" @click="clickFlexConfig">
            <template #suffix>
              <svg-icon icon="add" @click="clickFlexConfig"/>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="虚拟私有云">
          <el-select
            v-model="form.vpc"
            placeholder="请选择"
            class="input-box ideal-default-margin-right"
            style="width: 20%"
          >
            <el-option
              v-for="(item, index) of selectData.vpcList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <svg-icon icon="refresh-icon" class="ideal-svg-margin-right" />

          <el-button link type="primary" class="ideal-default-margin-right"
            >新建虚拟私有云</el-button
          >
          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="均衡分布: 弹性云服务器扩容时优先保证选择的可用区列表中各可用区下弹性云服务器数量均衡，当无法在目标可用区下完成弹性云服务器扩容时，按照选择优先原则选择其他可用区。选择优先: 弹性云服务器扩容时目标可用区的选择按照选择的可用区列表的顺序进行优先级排序。"
            placement="right"
          >
            <svg-icon icon="question-icon" class="ideal-svg-margin-left" />
          </el-tooltip>
        </el-form-item>

        <el-form-item label="子网">
          <subnet-group :data-array="selectData.subnetList" />
        </el-form-item>

        <el-form-item label="负载均衡">
          <div style="width: 100%;">
            <div class="flex-row">
              <el-radio-group v-model="form.lbsType">
                <el-radio-button label="noUse">不使用</el-radio-button>
                <el-radio-button label="used">使用弹性负载均衡</el-radio-button>
              </el-radio-group>

              <svg-icon v-if="selectCase.useLbs" icon="refresh-icon" class="ideal-svg-margin-right ideal-svg-margin-left"/>
              <el-button v-if="selectCase.useLbs" link type="primary">新建弹性负载均衡</el-button>
            </div>

            <lbs-group v-if="selectCase.useLbs"/>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="实例移除策略">
          <el-select
            v-model="form.removePolicy"
            placeholder="请选择"
            class="input-box"
          >
            <el-option
              v-for="(item, index) of selectData.removePolicies"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="弹性公网IP">
          <div>
            <el-radio-group v-model="form.eip">
              <el-radio-button label="release">释放</el-radio-button>
              <el-radio-button label="noRelease">不释放</el-radio-button>
            </el-radio-group>

            <div class="ideal-tip-text">
              若选择“释放”，在伸缩组进行缩的活动时，则会将云服务器上的弹性公网IP释放，否则仅做解绑定操作，保留弹性公网IP资源。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="数据盘">
          <div>
            <el-radio-group v-model="form.dataDisk">
              <el-radio-button label="delete">删除</el-radio-button>
              <el-radio-button label="noDelete">不删除</el-radio-button>
            </el-radio-group>

            <div class="ideal-tip-text">
              删除不删除若选择“删除”，在伸缩组进行缩的活动时，则会将云服务器上的数据盘删除，否则仅做解绑定操作，保留数据盘资源。
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="健康检查方式">
          <div style="width: 100%;">
            <div class="flex-row">
              <el-select
                v-model="form.healthMode"
                placeholder="请选择"
                class="input-box"
              >
                <el-option
                  v-for="(item, index) of selectData.healthModes"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>

              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                content="健康检查会将异常的虚拟机从伸缩组中移除，并重新创建新的虚拟机。云服务器健康检查方式是对虚拟机的运行状态进行检查，如关机、删除都是虚拟机异常状态。ELB健康检查方式是根据ELB对虚拟机的健康检查结果进行的检查。"
                placement="right"
              >
                <svg-icon icon="question-icon" class="ideal-svg-margin-left" />
              </el-tooltip>
            </div>

            <div class="ideal-tip-text">受保护的实例状态异常时，会被健康检查移除，并重新创建新的实例。</div>
            <div v-if="selectCase.isLbsCheck" class="ideal-tip-text">实例所在安全组规则需要配置放行100.125.0.0/16，并配置负载均衡用于健康检查的协议和端口，否则会导致健康检查失败。</div>
          </div>
        </el-form-item>

        <el-form-item label="健康检查间隔">
          <el-select
            v-model="form.healthInterval"
            placeholder="请选择"
            class="input-box"
          >
            <el-option
              v-for="(item, index) of selectData.healthIntervals"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="伸缩组执行健康检查的周期。"
            placement="right"
          >
            <svg-icon icon="question-icon" class="ideal-svg-margin-left" />
          </el-tooltip>
        </el-form-item>

        <el-form-item label="健康状况检查宽限期(秒)">
          <el-input v-model="form.healthLimit" class="input-box"/>

          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="通常，伸缩活动中自动添加的实例需要足够的预热时间才能通过负载均衡健康检查。当实例加入伸缩组并且进入已启用状态后，健康状况检查宽限期才会启动，伸缩组会等健康状况检查宽限期结束后才检查实例的运行状况。"
            placement="right"
          >
            <svg-icon icon="question-icon" class="ideal-svg-margin-left" />
          </el-tooltip>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="标签">
          <tag />
        </el-form-item>

        <el-form-item label="委托">
          <el-select
            v-model="form.vpc"
            placeholder="请选择"
            class="input-box ideal-default-margin-right"
            style="width: 20%"
          >
            <el-option
              v-for="(item, index) of selectData.vpcList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <svg-icon icon="refresh-icon" class="ideal-svg-margin-right" />

          <el-button link type="primary">新建委托</el-button>

          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="委托是管理员通过授信的方式创建的与其他账号之间的一种委托关系。委托关系建立后，被委托方企业管理员就可以通过切换委托的方式替委托方企业管理云资源，实现安全高效的代维工作。"
            placement="right"
          >
            <svg-icon icon="question-icon" class="ideal-svg-margin-left" />
          </el-tooltip>
        </el-form-item>
      </el-card>
    </el-form>

    <footer-info/>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import subnetGroup from './components/subnet-group.vue'
import lbsGroup from './components/lbs-group.vue'
import tag from './components/tag.vue'
import footerInfo from './components/footer-info.vue'
import dialogBox from './dialog-box.vue'
import type { FormRules, FormInstance } from 'element-plus'
import store from '@/store'
import { useCreate } from './create'

const formRef = ref<FormInstance>()
const form = reactive({
  regionName: '',
  availableArea: [] as any[], // 可用区
  expandPolicy: '', // 	多可用区扩展策略
  name: '', // 名称
  maxNumber: '', // 最大实例数(台)
  expectNumber: '', // 期望实例数(台)
  minNumber: '', // 最小实例数(台)
  vpc: '', // 虚拟私有云
  subnet: [] as any[], // 子网
  lbsType: 'noUse', // 负载均衡
  removePolicy: '', // 实例移除策略
  eip: '', // 弹性公网IP
  dataDisk: '', // 数据盘
  healthMode: 'lbs', // 健康检查方式
  healthInterval: '', // 健康检查间隔
  healthLimit: '', // 健康状况检查宽限期(秒)
})
const rules = reactive<FormRules>({
  // vpc: [{ required: true, message: '请选择虚拟私有云', trigger: 'blur' }],
})
const { 
  selectData,
  selectCase,
  showDialog,
  dialogType,
  clickFlexConfig,
  clickCloseEvent,
  clickRefreshEvent
} = useCreate(form)

onBeforeMount(() => {
  if (store.resourceStore) {
    store.resourceStore.$subscribe(async(mutations: any, state: any) => {
      form.regionName = state?.regionInfo?.name
    })
  }
})
const { resourcePoolInfo, regionInfo } = storeToRefs(store.resourceStore)
onMounted(() => {
  // 右上角资源池区域是否选择
  if (regionInfo.value && resourcePoolInfo.value) {
    form.regionName = regionInfo.value.name
  }
})

</script>

<style scoped lang="scss">
.create {
  margin: $idealMargin $idealMargin 80px;
  .input-box {
    width: 20%;
  }
  :deep(.el-form) {
    padding: 0;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
