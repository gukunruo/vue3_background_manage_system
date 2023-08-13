// 定义小仓库数据的state类型
import type { RouteRecordRaw } from 'vue-router' // RouteRecordRaw就是路由对象的ts类型
// 引入分类对象
import type { CategoryObj } from '@/api/product/attr/type'

// 定义用户相关小仓库user的state类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
}

// 定义分类小仓库category的state类型
export interface CategoryState {
  c1Arr: CategoryObj[]
  c1Id: string | number
  c2Arr: CategoryObj[]
  c2Id: string | number
  c3Arr: CategoryObj[]
  c3Id: string | number
}
