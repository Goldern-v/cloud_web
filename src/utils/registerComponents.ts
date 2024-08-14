import type { App } from 'vue'
/**
 *
 * @app 实例app
 * @components 需要全局注册的组件名
 */
export async function registerGlobalComponents(app: App) {
  const components = [
    'fast-cron',
    'fast-radio-group',
    'fast-select',
    'fast-table-column',
    'fast-user',
    'ideal-alert-info',
    'ideal-associate-tag',
    'ideal-button-events',
    'ideal-cycle-select',
    'ideal-detail-info',
    'ideal-horizontal-steps',
    'ideal-input-select',
    'ideal-ip-input',
    'ideal-json-preview',
    'ideal-price-footer',
    'ideal-region-project',
    'ideal-region-select',
    'ideal-replace-open',
    'ideal-resource-pool',
    'ideal-search',
    'ideal-select-search',
    'ideal-set-table-header',
    'ideal-status-icon',
    'ideal-table-list',
    'ideal-table-operate',
    'ideal-tag-multiple-select',
    'ideal-tag-show',
    'ideal-text-copy',
    'ideal-unbind-tag',
    'svg-icon'
  ]

  for (const component of components) {
    const url = `../components/${component}/index`
    const { default: componentModule } = await import(url)
    if (componentModule.install) {
      componentModule.install(app)
    } else {
      console.warn(`No install method found for ${component}`)
    }
  }
}
