<template>
  <el-card class="ideal-large-margin" shadow="never">
    <!-- 流程设计器，负责绘制流程等 -->
    <MyProcessDesigner
      v-if="xmlString !== undefined"
      key="designer"
      v-bind="controlForm"
      ref="processDesigner"
      v-model="xmlString"
      :value="xmlString"
      keyboard
      :additional-model="controlForm.additionalModel"
      @init-finished="initModeler"
      @save="save"
    />
    <!-- 流程属性器，负责编辑每个流程节点的属性 -->
    <MyProcessPenal
      key="penal"
      :bpmn-modeler="modeler as any"
      :prefix="controlForm.prefix"
      class="process-panel"
      :model="model"
    />
  </el-card>
</template>

<script lang="ts" setup>
import MyProcessDesigner from './bpmnProcessDesigner/package/designer/ProcessDesigner.vue'
import MyProcessPenal from './bpmnProcessDesigner/package/penal/PropertiesPanel.vue'
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from './bpmnProcessDesigner/package/designer/plugins/content-pad'
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from './bpmnProcessDesigner/package/designer/plugins/palette'
import { ElMessage } from 'element-plus/es'
import { updateModel, getModel, createModel } from '@/api/java/bpm/model'
import { ModelVO } from '@/types/bpm-model'

// defineOptions({ name: 'BpmModelEditor' })

const router = useRouter() // 路由
const { query } = useRoute() // 路由的查询

const model = ref<ModelVO>() // 流程模型的信息

const xmlString = ref(undefined) // BPMN XML
const modeler = ref(null) // BPMN Modeler
const controlForm = ref({
  simulation: true,
  labelEditing: false,
  labelVisible: false,
  prefix: 'flowable',
  headerButtonSize: 'mini',
  additionalModel: [CustomContentPadProvider, CustomPaletteProvider]
})

/** 初始化 modeler */
const initModeler = (item: any) => {
  console.log(item, 'item')
  setTimeout(() => {
    modeler.value = item
  }, 10)
}

// /** 添加/修改模型 */
const save = async (bpmnXml: string) => {
  const data = {
    ...model.value,
    bpmnXml: bpmnXml // bpmnXml 只是初始化流程图，后续修改无法通过它获得
  } as unknown as ModelVO
  // 提交
  if (data.id) {
    await updateModel(data)
    ElMessage.success('修改成功')
  } else {
    await createModel(data)
    ElMessage.success('新增成功')
  }
  // 跳转回去
  close()
}

/** 关闭按钮 */
const close = () => {
  router.push({ path: '/bpm-manage/model/list' })
}

/** 初始化 */
onMounted(async () => {
  console.log(controlForm, 'controlForm')

  const modelId = query.modelId as unknown as string
  if (!modelId) {
    ElMessage.error('缺少模型 modelId 编号')
    return
  }
  // 查询模型
  const { data } = await getModel(modelId)
  xmlString.value = data.bpmnXml || null
  model.value = {
    ...data,
    bpmnXml: undefined // 清空 bpmnXml 属性
  }
})
</script>
<style lang="scss">
.process-panel__container {
  position: absolute;
  top: 90px;
  right: 60px;
}
.layout-container .layout-scrollbar {
  width: 100% !important;
}
</style>
