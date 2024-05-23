import { basicList, networkList, highList } from './common'
import { useResourcePool } from '@/utils/common/resource'

export const useConfirm = () => {
  const basicInfo = ref<any[]>([])
  const networkInfo = ref<any[]>([])
  const highInfo = ref<any[]>([])

  const { isPublic, isPrivateVmware, isPrivateHuawei } = useResourcePool()

  onMounted(() => {
    getConfig()
  })
  const getConfig = () => {
    if (isPublic.value || isPrivateHuawei.value) {
      basicInfo.value = basicList
      networkInfo.value = networkList
      highInfo.value = highList()
    } else if (isPrivateVmware.value) {
      basicInfo.value = basicList
      networkInfo.value = [
        { label: '虚拟私有云', value: 'vpcInfo' },
        { label: '子网', value: 'subnetInfo' }
      ]
      highInfo.value = [{ label: '云服务器名称', value: 'cloudHostName' }]
    }
  }

  return {
    basicInfo,
    networkInfo,
    highInfo
  }
}
