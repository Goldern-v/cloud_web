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
      speedUnit,
      aliPortType,
      portStatus
    } = form
    const params: { [key: string]: any } = {
      portType: 'CLOUD',
      cloudPortType: 'ALI_CLOUD',
      name,
      nodeId,
      uuid,
      equipmentId,
      speed: speed + speedUnit,
      instanceId,
      area,
      accessPoint,
      aliPortType,
      portStatus
    }
    return params
  }
  const createZgaPortParams = () => {
    const form = cloudFormRef.value[0].form
    const {
      name,
      nodeId,
      uuid,
      equipmentId,
      address,
      speed,
      instanceId,
      area,
      accessPoint,
      speedUnit,
      aliPortType,
      portStatus
    } = form
    const params: { [key: string]: any } = {
      portType: 'CLOUD',
      cloudPortType: 'ZGA',
      name,
      nodeId,
      address,
      uuid,
      equipmentId,
      speed: speed + speedUnit,
      instanceId,
      area,
      accessPoint,
      aliPortType,
      portStatus
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
      speedUnit,
      address,
      logicalDevice,
      portStatus
    } = form
    const params: { [key: string]: any } = {
      portType: 'CLOUD',
      cloudPortType: 'AWS',
      name,
      uuid,
      nodeId,
      equipmentId,
      speed: speed + speedUnit,
      connectionId,
      area,
      address,
      logicalDevice,
      portStatus
    }
    return params
  }

  //创建Azure端口参数
  const createAzurePortParams = () => {
    const port1: any = filterEmptyValues(cloudFormRef.value[0].form)
    const port2: any = filterEmptyValues(cloudFormRef.value[1].form)
    port1.speed = port1.speed + port1.speedUnit
    port2.speed = port2.speed + port2.speedUnit
    const params: { [key: string]: any } = {
      portType: 'CLOUD',
      cloudPortType: 'AZURE',
      port1,
      port2
    }
    return params
  }

  //创建google端口参数
  const createGooglePortParams = () => {
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
      logicalDevice,
      circuitId,
      demarcId,
      speedUnit,
      zone,
      location,
      portStatus
    } = form
    const params: { [key: string]: any } = {
      portType: 'CLOUD',
      cloudPortType: 'GOOGLE_CLOUD',
      name,
      uuid,
      nodeId,
      equipmentId,
      connectionId,
      area,
      speed: speed + speedUnit,
      address,
      logicalDevice,
      circuitId,
      demarcId,
      zone,
      location,
      portStatus
    }
    return params
  }

  //更新Azure端口参数
  const updateAzurePortParams = () => {
    const params: any = filterEmptyValues(cloudFormRef.value[0].form)
    params.speed = params.speed + params.speedUnit
    return params
  }

  return {
    cloudFormRef,
    createAliPortParams,
    createZgaPortParams,
    createAwsPortParams,
    createAzurePortParams,
    updateAzurePortParams,
    createGooglePortParams
  }
}
