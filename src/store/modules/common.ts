import { defineStore } from 'pinia'
import { any } from 'vue-types'
import { SessionStorage } from '@/utils/storage'

export const commonStore = defineStore('commonStore', {
  state: () => ({
    buyTime: 0, // 选择购买时长
    price: 0, // 询价价格
    type: '', // 资源类型(例: ECS)
    cloudCategory: '',
    cloudType: '',
    resourcePool: '',
    tempObject: any, // 临时对象
    tempArray: [] as any[], // 临时数组
    selectArray: [] as any[] // 临时选择数组
  }),
  actions: {
    setBuyTime(value: number) {
      this.buyTime = value
    },
    setPrice(value: number) {
      this.price = value
    },
    setType(value: string) {
      this.type = value
    },
    setCloudCategory(value: string) {
      this.cloudCategory = value
    },
    setCloudType(value: string) {
      this.cloudType = value
    },
    setResourcePool(value: string) {
      this.resourcePool = value
    },
    setTempObject(value: any) {
      this.tempObject = value
    },
    setTempArray(value: any[]) {
      this.tempArray = value
    },
    setSelectArray(value: any[]) {
      this.selectArray = value
    },
    setSideBar(value: string) {
      SessionStorage.setItem('sidePath', value)
    },
    removeSideBar(value: string) {
      SessionStorage.removeItem('sidePath')
    }
  }
})
