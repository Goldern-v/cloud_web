import { IHooksHigh } from './interface'
import store from '@/store'
import { loginCredentialsList } from './common'
import { queryKeyPair } from '@/api/java/compute'

export const useHigh = (options: IHooksHigh) => {
  const defaultOptions: IHooksHigh = {
    loginCredentialsList, // 登录凭证
    keyPairList: [] as any[], // 密钥对
    form: {}
  }
  const mergeDefaultOptions = (options: any, props: any): IHooksHigh => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key]
      }
    }
    return props
  }
  // 覆盖默认值
  const state = mergeDefaultOptions(defaultOptions, options)

  // 监听pinia
  if (store.resourceStore) {
    store.resourceStore.$subscribe((mutations: any, state: any) => {
      resetForm()
      if (state?.resourcePoolInfo && state?.regionInfo) {
        getKeyPair()
      }
    })
  }
  // 资源池区域切换时重置表单
  const resetForm = () => {
    state.form.resourceId = ''
    state.form.regionId = ''
    state.form.cloudHostName = ''
    state.form.loginCredentials = '1'
    state.form.loginCredentialsName = ''
    state.form.keyPair = ''
    state.form.securityCode = ''
    state.form.againSecurityCode = ''
  }

  // storeToRefs防止右上角切换资源池时数据未同步响应
  const { regionInfo, resourcePoolInfo, projectId } = storeToRefs(
    store.resourceStore
  )
  onMounted(() => {
    if (regionInfo.value && resourcePoolInfo.value && projectId.value) {
      state.form.regionId = regionInfo.value.code
      state.form.resourceId = resourcePoolInfo.value.id
      getKeyPair()
    }
  })
  // 监听登录凭证
  watch(
    () => state.form.loginCredentials,
    value => {
      if (value) {
        const result = loginCredentialsList.find(
          (item: any) => item.value === value
        )
        state.form.loginCredentialsName = result?.label as string
        // 重置密码和密钥对选项
        state.form.securityCode = ''
        state.form.againSecurityCode = ''
        state.form.keyPair = ''
      }
    }
  )
  // 密钥对
  const getKeyPair = () => {
    const params = commonParams()
    queryKeyPair(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        state.keyPairList = data
      } else {
        state.keyPairList = []
      }
    })
  }
  const clickRefreshKeyPair = () => {
    state.form.keyPair = ''
    getKeyPair()
  }

  // 公共传参
  const commonParams = () => {
    return {
      region: regionInfo.value.code, // 区域
      projectId: store.resourceStore.projectId, // 项目id
      resourcePoolId: resourcePoolInfo.value.id // 资源池id
    }
  }

  return {
    clickRefreshKeyPair
  }
}
