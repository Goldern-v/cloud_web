import { filterEmptyValues } from '../common'
export const getCloudPortParams = () => {
  const cloudFormRef = ref()
  //创建阿里云端口参数
  const createAliPortParams = () => {
    const form = cloudFormRef.value[0].form
    const {
      name,
      nodeId,
      uuid,
      equipmentId,
      speed,
      instanceId,
      area,
      accessPoint,
      aliPortType
    } = form
    const params: { [key: string]: any } = {
      portType: 'CLOUD',
      cloudPortType: 'aliyun',
      name,
      nodeId,
      uuid,
      equipmentId,
      speed,
      instanceId,
      area,
      accessPoint,
      aliPortType
    }
    return params
  }

  //创建亚马逊端口参数
  const createAwsPortParams = () => {
    const form = cloudFormRef.value[0].form
    const {
      name,
      uuid,
      nodeId,
      equipmentId,
      speed,
      connectionId,
      area,
      address,
      logicalDevice
    } = form
    const params: { [key: string]: any } = {
      portType: 'CLOUD',
      cloudPortType: 'aws',
      name,
      uuid,
      nodeId,
      equipmentId,
      speed,
      connectionId,
      area,
      address,
      logicalDevice
    }
    return params
  }

  //创建Azure端口参数
  const createAzurePortParams = () => {
    const port1 = filterEmptyValues(cloudFormRef.value[0].form)
    const port2 = filterEmptyValues(cloudFormRef.value[1].form)
    const params: { [key: string]: any } = {
      portType: 'CLOUD',
      cloudPortType: 'azure',
      port1,
      port2
    }
    return params
  }

  //更新Azure端口参数
  const updateAzurePortParams = () => {
    const params = filterEmptyValues(cloudFormRef.value[0].form)
    return params
  }

  return {
    cloudFormRef,
    createAliPortParams,
    createAwsPortParams,
    createAzurePortParams,
    updateAzurePortParams
  }
}
