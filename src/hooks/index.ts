import { IHooksOptions } from '@/hooks/interface'
import service from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus/es'

export const useCrud = (options: IHooksOptions) => {
  const defaultOptions: IHooksOptions = {
    createdIsNeed: true,
    dataListUrl: '',
    isPage: true,
    deleteUrl: '',
    primaryKey: '',
    exportUrl: '',
    queryForm: {},
    dataList: [],
    order: '',
    asc: false,
    page: 1,
    limit: 10,
    total: 0,
    pageSizes: [1, 10, 20, 50, 100, 200],
    dataListLoading: false,
    dataListSelections: []
  }

  const mergeDefaultOptions = (options: any, props: any): IHooksOptions => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key]
      }
    }
    return props
  }

  // 覆盖默认值
  const state = mergeDefaultOptions(defaultOptions, options)

  onMounted(() => {
    if (state.createdIsNeed) {
      query()
    }
  })

  const query = () => {
    if (!state.dataListUrl) {
      return
    }

    state.dataListLoading = true

    service
      .get(state.dataListUrl, {
        params: {
          order: state.order,
          asc: state.asc,
          pageNum: state.isPage ? state.page : null,
          pageSize: state.isPage ? state.limit : null,
          ...state.queryForm
        }
      })
      .then((res: any) => {
        state.dataListLoading = false
        const { code } = res
        if (code === 200) {
          state.dataList = state.isPage
            ? res.data.list || res.data.data || []
            : res.data
          state.total = state.isPage ? res.data.total : 0
        } else {
          state.dataList = []
          state.total = 0
        }
      })
      .catch(_ => {
        state.dataListLoading = false
        state.dataList = []
        state.total = 0
      })
  }
  const getDataList = () => {
    state.page = 1
    query()
  }
  const sizeChangeHandle = (val: number) => {
    state.dataList = []
    state.page = 1
    state.limit = val
    query()
  }

  const currentChangeHandle = (val: number) => {
    state.dataList = []
    state.page = val
    query()
  }

  // 多选
  const selectionChangeHandle = (selections: any[]) => {
    if (state.primaryKey) {
      state.dataListSelections = selections.map(
        (item: any) => state.primaryKey && item[state.primaryKey]
      )
    } else {
      state.dataListSelections = selections
    }
  }

  // 排序
  const sortChangeHandle = (data: any) => {
    const { prop, order } = data

    if (prop && order) {
      state.order = prop
      state.asc = order === 'ascending'
    } else {
      state.order = ''
    }

    query()
  }
  // prefix:前缀 suffix:后缀,根据需要设置
  const deleteHandle = (
    key: number | string,
    prefix = '/',
    deleteText = '确定进行删除操作?',
    deleteTitle = '提示',
    suffix = '',
    successTip = '删除成功'
  ) => {
    if (!state.deleteUrl) {
      return
    }

    ElMessageBox.confirm(deleteText, deleteTitle, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        service
          .delete(state.deleteUrl + prefix + key + suffix)
          .then((res: any) => {
            const { code } = res
            if (code === 200) {
              ElMessage.success(successTip)
              query()
            } else {
              ElMessage.error(res.msg || '删除失败')
            }
          })
          .catch(_ => {
            ElMessage.error('删除失败')
          })
      })
      .catch(() => {})
  }

  const deleteBatchHandle = (key?: number | string) => {
    let data: any[] = []
    if (key) {
      data = [key]
    } else {
      data = state.dataListSelections ? state.dataListSelections : []

      if (data.length === 0) {
        ElMessage.warning('请选择删除记录')
        return
      }
    }

    ElMessageBox.confirm('确定进行删除操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        if (state.deleteUrl) {
          service.delete(state.deleteUrl, { data }).then(() => {
            ElMessage.success('删除成功')

            query()
          })
        }
      })
      .catch(() => {})
  }

  const downloadHandle = async (
    url: string,
    filename?: string,
    method: string = 'GET'
  ): Promise<any> => {
    try {
      const res = await service({
        responseType: 'blob',
        url: url,
        method: method
      })
      // 创建a标签
      const down = document.createElement('a')

      // 文件名没传，则使用时间戳
      if (filename) {
        down.download = filename
      } else {
        const downName = res.headers['content-disposition'].split('=')[1]
        down.download = decodeURI(downName)
      }

      // 隐藏a标签
      down.style.display = 'none'

      // 创建下载url
      down.href = URL.createObjectURL(
        new Blob([res.data], {
          type: res.data.type
        })
      )

      // 模拟点击下载
      document.body.appendChild(down)
      down.click()

      // 释放URL
      URL.revokeObjectURL(down.href)
      // 下载完成移除
      document.body.removeChild(down)
    } catch (err: any) {
      ElMessage.error(err.message)
    }
  }

  return {
    getDataList,
    query,
    sizeChangeHandle,
    currentChangeHandle,
    selectionChangeHandle,
    sortChangeHandle,
    deleteHandle,
    deleteBatchHandle,
    downloadHandle
  }
}
