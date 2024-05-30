import { IHooksHigh } from './interface'
import store from '@/store'
import {
  loginCredentialsList,
  cloudBackupList,
  cloudBackupRepositoryUnit
} from './common'
import {
  queryCloudBackupRepository,
  queryCloudBackupPolicy,
  queryCloudHostGroup,
  queryKeyPair
} from '@/api/java/compute'

export const useHigh = (options: IHooksHigh) => {
  const defaultOptions: IHooksHigh = {
    loginCredentialsList, // 登录凭证
    keyPairList: [] as any[], // 密钥对
    cloudBackupList, // 云备份
    cloudBackupRepositoryUnit, // 云备份存储库单位
    cloudHostGroups: [] as any[], // 云服务器组
    backupRepositoryList: [] as any[], // 云备份存储库
    backupPolicyList: [] as any[], // 备份策略
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

  // storeToRefs防止右上角切换资源池时数据未同步响应
  const { resourcePool } = storeToRefs(store.resourceStore)
  onMounted(() => {
    state.form.regionId = store.resourceStore.regionId
    state.form.resourceId = resourcePool.value.resourcePoolId
    getKeyPair()
    getCloudBackupPolicy()
    getCloudHostGroup()
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
  // 监听云备份选择
  watch(
    () => state.form.cloudBackup,
    value => {
      if (value === '2') {
        getCloudBackupRepository()
      }
    }
  )
  // 云备份存储库
  const getCloudBackupRepository = () => {
    const params = {
      resourceStatus: 'DOWN', // 状态(固定传DOWN调未绑定资源)
      ...commonParams()
    }
    // queryCloudBackupRepository(params).then((res: any) => {
    //   const { code, data } = res
    //   if (code === 200) {
    //     state.backupRepositoryList = data
    //     state.form.cloudBackupRepository = data.length ? data[0].uuid : ''
    //   } else {
    //     state.backupRepositoryList = []
    //   }
    // })
  }
  const clickRefreshRepository = () => {
    state.form.cloudBackupRepository = ''
    getCloudBackupRepository()
  }
  // 云备份策略
  const getCloudBackupPolicy = () => {
    const params = commonParams()
    // queryCloudBackupPolicy(params).then((res: any) => {
    //   const { code, data } = res
    //   if (code === 200) {
    //     state.backupPolicyList = data
    //     state.form.backupPolicy = data.length ? data[0].uuid : ''
    //   } else {
    //     state.backupPolicyList = []
    //   }
    // })
  }
  const clickRefreshPolicy = () => {
    state.form.backupPolicy = ''
    getCloudBackupPolicy()
  }
  watch(
    () => state.form.backupPolicy,
    value => {
      if (value) {
        const result = state.backupPolicyList?.find(
          (row: any) => row.uuid === value
        )
        state.form.backupPolicyInfo = result?.name
      }
    }
  )
  // 云主机组
  const getCloudHostGroup = () => {
    const params = commonParams()
    queryCloudHostGroup(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        state.cloudHostGroups = data
        state.form.cloudHostGroup = data.length ? data[0].id : ''
      } else {
        state.cloudHostGroups = []
      }
    })
  }
  watch(
    () => state.form.cloudHostGroup,
    value => {
      if (value) {
        const result = state.cloudHostGroups?.find(
          (row: any) => row.uuid === value
        )
        state.form.cloudGroupTypeInfo = result?.name
      }
    }
  )
  const clickRefreshCloudGroup = () => {
    state.form.cloudHostGroup = ''
    getCloudHostGroup()
  }
  // 公共传参
  const commonParams = () => {
    return {
      region: store.resourceStore.regionCode, // 区域
      projectId: store.resourceStore.projectId, // 项目id
      resourcePoolId: resourcePool.value.resourcePoolId // 资源池id
    }
  }

  return {
    clickRefreshKeyPair,
    clickRefreshRepository,
    clickRefreshPolicy,
    clickRefreshCloudGroup
  }
}
