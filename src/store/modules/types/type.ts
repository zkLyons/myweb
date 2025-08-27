import type { RouteRecordRaw } from 'vue-router'
import type { Categoryobj } from '@/api/product/attr/types'

//定义小仓库数据state类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
}

//定义分类仓库state对象的ts类型
export interface CategoryState {
  c1Id: string | number
  c1Arr: Categoryobj[]
  c2Arr: Categoryobj[]
  c2Id: string | number
  c3Arr: Categoryobj[]
  c3Id: string | number
}
