// 响应数据最基础的数据类型 用于继承
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 响应数据data的类型【reqC1和reqC2的响应体中的data】
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

//相应的分类接口返回数据的类型 分类响应式数据对象包含code、message、ok、data【查看接口文档】
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

// 获取商品对应属性与属性值的ts类型 code、message、data【其中嵌套属性对象】、ok
// 属性值对象的ts类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  // flag标记 控制每一个属性值编辑模式与查看模式切换
  flag?: boolean
}
// 存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]
// 属性对象
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}
// 存储每一个属性对象的数组ts类型
export type AttrList = Attr[]
// 属性接口返回的数据ts类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
