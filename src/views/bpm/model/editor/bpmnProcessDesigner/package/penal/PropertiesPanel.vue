<template>
  <div class="process-panel__container" :style="{ width: `${width}px` }">
    <el-collapse v-model="activeTab">
      <el-collapse-item name="base">
        <!-- class="panel-tab__title" -->
        <template #title>
          <svg-icon class="mr-1px" icon="convention" />
          常规</template
        >
        <ElementBaseInfo
          :id-edit-disabled="idEditDisabled"
          :business-object="elementBusinessObject"
          :type="elementType"
          :model="model"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="elementType === 'Process'"
        key="message"
        name="condition"
      >
        <template #title>
          <svg-icon class="mr-1px" icon="message-model" />消息与信号</template
        >
        <signal-and-massage />
      </el-collapse-item>
      <el-collapse-item
        v-if="conditionFormVisible"
        key="condition"
        name="condition"
      >
        <template #title>
          <svg-icon class="mr-1px" icon="convention" />流转条件</template
        >
        <flow-condition
          :business-object="elementBusinessObject"
          :type="elementType"
        />
      </el-collapse-item>
      <el-collapse-item v-if="formVisible" key="form" name="condition">
        <template #title>
          <svg-icon class="mr-1px" icon="convention" />表单</template
        >
        <!-- <element-form :id="elementId" :type="elementType" /> -->
        友情提示：使用
        <router-link :to="{ path: '/bpm/manager/form' }"
          ><el-link type="danger">流程表单</el-link>
        </router-link>
        替代，提供更好的表单设计功能
      </el-collapse-item>
      <el-collapse-item
        v-if="elementType.indexOf('Task') !== -1"
        key="task"
        name="task"
      >
        <template #title
          ><svg-icon class="mr-1px" icon="task-model" />任务</template
        >
        <element-task :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item
        v-if="elementType.indexOf('Task') !== -1"
        key="multiInstance"
        name="multiInstance"
      >
        <template #title
          ><svg-icon class="mr-1px" icon="multi-instance" />多实例</template
        >
        <element-multi-instance
          :business-object="elementBusinessObject"
          :type="elementType"
        />
      </el-collapse-item>
      <el-collapse-item key="listeners" name="listeners">
        <template #title>
          <svg-icon class="mr-1px" icon="monitor-model" />执行监听器</template
        >
        <element-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item
        v-if="elementType === 'UserTask'"
        key="taskListeners"
        name="taskListeners"
      >
        <template #title
          ><svg-icon class="mr-1px" icon="monitor-model" />任务监听器</template
        >
        <user-task-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item key="extensions" name="extensions">
        <template #title
          ><svg-icon class="mr-1px" icon="extend" />扩展属性</template
        >
        <element-properties :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item key="other" name="other">
        <template #title><svg-icon class="mr-1px" icon="other" />其他</template>
        <element-other-config :id="elementId" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import ElementBaseInfo from './base/ElementBaseInfo.vue'
import ElementOtherConfig from './other/ElementOtherConfig.vue'
import ElementTask from './task/ElementTask.vue'
import ElementMultiInstance from './multi-instance/ElementMultiInstance.vue'
import FlowCondition from './flow-condition/FlowCondition.vue'
import SignalAndMassage from './signal-message/SignalAndMessage.vue'
import ElementListeners from './listeners/ElementListeners.vue'
import ElementProperties from './properties/ElementProperties.vue'
// import ElementForm from './form/ElementForm.vue'
import UserTaskListeners from './listeners/UserTaskListeners.vue'
import SvgIcon from '@/components/svg-icon/src/svg-icon.vue'

/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年3月31日18:57:51
 */
const props = defineProps({
  bpmnModeler: {
    type: Object,
    default: () => {}
  },
  prefix: {
    type: String,
    default: 'camunda'
  },
  width: {
    type: Number,
    default: 480
  },
  idEditDisabled: {
    type: Boolean,
    default: false
  },
  model: {
    type: Object,
    default: () => {}
  } // 流程模型的数据
})

const activeTab = ref('base')
const elementId = ref('')
const elementType = ref('')
const elementBusinessObject = ref<any>({}) // 元素 businessObject 镜像，提供给需要做判断的组件使用
const conditionFormVisible = ref(false) // 流转条件设置
const formVisible = ref(false) // 表单配置
const bpmnElement = ref()

provide('prefix', props.prefix)
provide('width', props.width)
const bpmnInstances = () => (window as any)?.bpmnInstances

// 监听 props.bpmnModeler 然后 initModels
const unwatchBpmn = watch(
  () => props.bpmnModeler,
  () => {
    // 避免加载时 流程图 并未加载完成
    if (!props.bpmnModeler) {
      console.log('缺少props.bpmnModeler')
      return
    }

    console.log('props.bpmnModeler 有值了！！！')
    const w = window as any
    w.bpmnInstances = {
      modeler: props.bpmnModeler,
      modeling: props.bpmnModeler.get('modeling'),
      moddle: props.bpmnModeler.get('moddle'),
      eventBus: props.bpmnModeler.get('eventBus'),
      bpmnFactory: props.bpmnModeler.get('bpmnFactory'),
      elementFactory: props.bpmnModeler.get('elementFactory'),
      elementRegistry: props.bpmnModeler.get('elementRegistry'),
      replace: props.bpmnModeler.get('replace'),
      selection: props.bpmnModeler.get('selection')
    }

    console.log(bpmnInstances(), 'window.bpmnInstances')
    getActiveElement()
    unwatchBpmn()
  },
  {
    immediate: true
  }
)
type newSelectionObject = {
  [key: string]: any
}
const getActiveElement = () => {
  // 初始第一个选中元素 bpmn:Process
  initFormOnChanged(null)
  props.bpmnModeler.on('import.done', (e: any) => {
    console.log(e, 'eeeee')
    initFormOnChanged(null)
  })
  // 监听选择事件，修改当前激活的元素以及表单
  props.bpmnModeler.on(
    'selection.changed',
    ({ newSelection }: newSelectionObject) => {
      initFormOnChanged(newSelection[0] || null)
    }
  )
  props.bpmnModeler.on('element.changed', ({ element }: newSelectionObject) => {
    // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
    if (element && element.id === elementId.value) {
      initFormOnChanged(element)
    }
  })
}
// 初始化数据
const initFormOnChanged = (element: any) => {
  let activatedElement = element
  if (!activatedElement) {
    activatedElement =
      bpmnInstances().elementRegistry.find(
        (el: any) => el.type === 'bpmn:Process'
      ) ??
      bpmnInstances().elementRegistry.find(
        (el: any) => el.type === 'bpmn:Collaboration'
      )
  }
  if (!activatedElement) {
    return
  }
  console.log(`
              ----------
      select element changed:
                id:  ${activatedElement.id}
              type:  ${activatedElement.businessObject.$type}
              ----------
              `)
  console.log('businessObject: ', activatedElement.businessObject)
  bpmnInstances().bpmnElement = activatedElement
  bpmnElement.value = activatedElement
  elementId.value = activatedElement.id
  elementType.value = activatedElement.type.split(':')[1] || ''
  elementBusinessObject.value = JSON.parse(
    JSON.stringify(activatedElement.businessObject)
  )
  conditionFormVisible.value = !!(
    elementType.value === 'SequenceFlow' &&
    activatedElement.source &&
    activatedElement.source.type.indexOf('StartEvent') === -1
  )
  formVisible.value =
    elementType.value === 'UserTask' || elementType.value === 'StartEvent'
}

onBeforeUnmount(() => {
  const w = window as any
  w.bpmnInstances = null
  console.log(props.model, 'model111')

  console.log(props, 'props1')
  console.log(props.bpmnModeler, 'props.bpmnModeler1')
})

watch(
  () => elementId.value,
  () => {
    activeTab.value = 'base'
  }
)
</script>

<style lang="scss" scoped>
.mr-1px {
  margin: 0 1px;
  font-size: 18px;
}
</style>
