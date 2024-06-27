import store from '@/store'

/**
 * 角色类别
 * 0:平台类别
 * 1:VDC类别
 * 2:项目类别
 * 3:供应商
 */
export const isSupplierManager = computed(() =>
  store.userStore.user.roleTypeList?.includes('3')
) //供应商管理员角色
