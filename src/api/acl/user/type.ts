// 账号信息的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 代表一个账号信息的ts类型
export interface User {
  id?: number | string
  createTime?: string
  updateTime?: string
  username?: string //
  password?: string
  name?: string
  phone?: null
  roleName?: string // 职位信息
}
// 数组包含全部的用户信息
export type Records = User[]
// 获取全部用户信息接口返回的数据ts类型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
    // 我们按照api文档去写，没用的数据不用编写
  }
}

// 代表一个职位的ts类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark: null
}
// 全部职位的列表
export type AllRole = RoleData[]
// 获取全部职位的接口返回的数据ts类型
export interface AllRoleResponseData extends ResponseData {
  data: {
    assignRoles: AllRole // 当前用户已有职位
    allRolesList: AllRole // 全部职位
  }
}

// 给用户分配职位接口携带参数的ts类型
export interface SetRoleData {
  roleIdList: number[] // 角色id的数组
  userId: number
}
