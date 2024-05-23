export enum FormatsEnums {
  YMD = 'Y-m-d',
  YMDHIS = 'Y-m-d H:i:s',
  _YMD = 'Y年m月d日',
  _YMDHIS = 'Y年m月d日 H时i分'
}

export const dateFormat = function (
  timestamp: any,
  formats: FormatsEnums
): string {
  // formats格式包括
  // 1. Y-m-d
  // 2. Y-m-d H:i:s
  // 3. Y年m月d日
  // 4. Y年m月d日 H时i分
  formats = formats || 'Y-m-d'

  const zero = function (value: any): string | any {
    if (value < 10) {
      return '0' + value
    }
    return value
  }

  const myDate = timestamp ? new Date(timestamp) : new Date()

  const year = myDate.getFullYear()
  const month = zero(myDate.getMonth() + 1)
  const day = zero(myDate.getDate())

  const hour = zero(myDate.getHours())
  const minite = zero(myDate.getMinutes())
  const second = zero(myDate.getSeconds())

  return formats.replace(/Y|m|d|H|i|s/gi, function (matches: string): any {
    return {
      Y: year,
      m: month,
      d: day,
      H: hour,
      i: minite,
      s: second
    }[matches]
  })
}

export const formatDuring = (millisecond: any): string => {
  let days = millisecond / (1000 * 60 * 60 * 24)
  let hours = (millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  let minutes = (millisecond % (1000 * 60 * 60)) / (1000 * 60)
  let seconds = (millisecond % (1000 * 60)) / 1000
  if (Math.floor(days) === 0) {
    if (Math.floor(hours) === 0) {
      if (Math.floor(minutes) === 0) {
        return Math.floor(seconds) + ' 秒 '
      } else {
        return Math.floor(minutes) + ' 分钟 ' + Math.floor(seconds) + ' 秒 '
      }
    } else {
      return (
        Math.floor(hours) +
        ' 小时 ' +
        Math.floor(minutes) +
        ' 分钟 ' +
        Math.floor(seconds) +
        ' 秒 '
      )
    }
  } else {
    return (
      Math.floor(days) +
      ' 天 ' +
      Math.floor(hours) +
      ' 小时 ' +
      Math.floor(minutes) +
      ' 分钟 ' +
      Math.floor(seconds) +
      ' 秒 '
    )
  }
}

//将日期根据传入的条件进行格式化
export const timeFormatByCondition = (timestamp: any, type: string) => {
  let time
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(timestamp.getMonth() + 1).padStart(2, '0')
  const day = String(timestamp.getDate()).padStart(2, '0')
  const hour = String(timestamp.getHours()).padStart(2, '0')
  const minutes = String(timestamp.getMinutes()).padStart(2, '0')
  const seconds = String(timestamp.getSeconds()).padStart(2, '0')

  const string = type.toUpperCase()
  if (string === 'YYYY') {
    time = year
  } else if (string === 'YYYY-MM') {
    time = year + '-' + month
  } else if (string === 'YYYY-MM-DD') {
    time = year + '-' + month + '-' + day
  } else if (string === 'YYYY-MM-DD HH') {
    time = year + '-' + month + '-' + day + ' ' + hour
  } else if (string === 'YYYY-MM-DD HH:MM') {
    time = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes
  } else if (string === 'YYYY-MM-DD HH:MM:SS') {
    time =
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hour +
      ':' +
      minutes +
      ':' +
      seconds
  } else {
    time = 'NaN'
  }
  return time
}
