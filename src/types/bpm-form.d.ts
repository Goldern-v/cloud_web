type IndexType = string | number | symbol

export type PlainObject<K extends IndexType = string, V = unknown> = Record<
  K,
  V
>

export interface FormVO {
  id: number
  name: string
  conf: string
  fields: string[]
  status: number
  remark: string
  createTime: string
}

export interface FormSearch {
  id?: string
  name?: string
  page?: number
  pageSize?: number
}

export interface FormList extends PlainObject {
  conf: string
  createTime: string
  fields: string[]
  id: number
  name: string
  remark: string
  status: number
}
