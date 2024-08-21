import { FiltrateEnum } from '@/utils/enum'
// 列表表头
export interface IdealTableColumnHeaders {
  label: string // 列标题(必传)
  prop: string // 列属性(必传)
  useSlot?: boolean // 是否使用插槽
  width?: string // 列宽
  align?: string // 对齐方式
  setTextType?: boolean // 当前列是否设置el-text 类型
  textTypeProp?: string // 行数据 el-text类型 (多条数据可能el-text类型不一样)
  disabled?: boolean // 自定义表头时 多选框是否禁用
  check?: boolean // 自定义表头时 多选框是否选择
  defaultVal?: string //没值时展示默认值
}

// 点击事件按钮属性
export interface IdealButtonEventProp {
  type?: string // 按钮类型
  title?: string // 按钮标题
  prop: string // 按钮标题英文
  icon?: any // 按钮图标
  iconColor?: string // 图标颜色
  text?: boolean // 按钮是否文字类型
  disabled?: boolean // 按钮是否禁用
  disabledText?: string // 禁用说明
  authority?: string //按钮权限
}

// 列表操作按钮属性
export interface IdealTableColumnOperate {
  title?: string // 文本
  type?: string // 按钮类型
  prop: string // 文本英文
  disabled?: boolean // 是否禁用
  disabledText?: string // 禁用描述
  children?: IdealTableColumnOperate[]
  authority?: string
}

// 文本属性
export interface IdealTextProp {
  label: string
  prop: string
  value?: string
}

// 监控指标
export interface IdealMonitorIndicator {
  name?: string //图表名称
  itemName?: string //图表id
  description?: string //监控项描述
  statisticsValue?: string[] //监控值
  statisticsData?: string[] //监控数据
}

// 周期选择组件属性
export interface IdealCycleSelect {
  label?: string
  value?: string
  isSelect?: boolean
}

export interface IdealSteps {
  icon?: string // 图标
  title?: string // 标题
  tip?: string // 提示
  color?: string // 标题字体颜色
  lineColor?: string // 步骤项引导线颜色
}
export interface IdealSearchResult extends IdealTextProp {
  value?: string // 搜索值(IdealTextProp的label是中文显示,prop是接口传参)
}
// 搜索组件
export interface IdealSearch extends IdealTextProp {
  type?: FiltrateEnum | string // 筛选条件类型
  array?: any[] // 筛选条件数组
  arrayProp?: string // 筛选条件数组对象类型根据后端返回无法确定,此字段用于列表显示字段
  arrayKey?: string // 确定选择唯一性(例: uuid)
  props?: any //树形结构配置项
}
// 事件流(资源审核通过后开通进度)
export interface IdealEventFlow {
  eventFlowId?: string // 事件流ID
  type?: string // 任务执行类型
  progress: number // 任务进度
}
