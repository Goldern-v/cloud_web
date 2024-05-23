//过滤对象中的空值
export const filterEmptyValues = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) => value !== null && value !== undefined && value !== ''
    )
  )
}

export const typeList = [
  { label: '专用端口', value: 'SPECIALIZED' },
  { label: 'NNI端口', value: 'NNI' },
  { label: '云端口', value: 'CLOUD' }
]

export const speedList = ['10GE', '1GE']

export const cloudTypeList = [
  { label: '阿里云', value: 'aliyun' },
  { label: 'AWS', value: 'aws' },
  { label: 'Azure', value: 'Azure' }
]

//清空form表单
export const clearForm = (form: any, arr: any) => {
  Object.keys(form).forEach((key: string) => {
    if (!arr.includes(key)) {
      form[key] = ''
    }
  })
}

export const statusFormat: { [key: string]: any } = {
  WAIT: '待审批',
  PASS: '已通过',
  REJECT: '已驳回',
  OFFSHELVES: '已下架'
}

export const statusType: { [key: string]: any } = {
  WAIT: 'warning',
  PASS: 'success',
  REJECT: 'danger',
  OFFSHELVES: 'info'
}
