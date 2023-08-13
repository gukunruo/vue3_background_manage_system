// 服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU数据对象的ts类型:需要修改
export interface SpuData {
  category3Id: string | number // 分类id
  id?: number | null // SPU数据id
  spuName: string
  tmId: number | string // SPU品牌对应id
  description: string
  spuImageList: null | SpuImg[] // spu图片列表
  spuSaleAttrList: null | SaleAttr[] // spu品牌对应的销售属性列表
}
// Records数组：存放SPU数据数组类型
export type Records = SpuData[]
//定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 所有品牌数据的TS类型 用于SPU品牌下拉框品牌展示
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}
// 品牌接口返回的数据ts类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

// 单个商品图片的ts类型
export interface SpuImg {
  id?: number
  imgName?: string
  imgUrl?: string
  createTime?: string
  updateTime?: string
  spuId?: number
  // 通过map将imgName和imgUrl改为下面的格式去给SPU照片墙去展示
  name?: string
  url?: string
}
// 已有的SPU的照片墙返回的的数据ts类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 已有的销售属性值对象ts类型
export interface SaleAttrValue {
  id?: number // 新增销售属性值没有id
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}
// 存储已有的销售属性值数组类型 销售属性值数组
export type SpuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象ts类型 销售属性中包含着多个销售属性值
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  // flag是销售属性的标记,用来控制展示编辑模式还是查看模式
  flag?: boolean
  // 转换为编辑模式的时候添加一个字段收集属性值
  saleAttrValue?: string
}
// SPU已有的销售属性接口返回数据ts类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[] // data数组中每一个对象都是一个销售属性
}

// 已有的全部SPU的返回数据ts类型
export interface HasSaleAttr {
  id: number
  name: string
}
// 全部SPU属性接口返回数据的ts类型
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

// sku平台属性
export interface Attr {
  attrId: number | string //平台属性的ID
  valueId: number | string //属性值的ID
}
// sku销售属性
export interface saleArr {
  saleAttrId: number | string //属性ID
  saleAttrValueId: number | string //属性值的ID
}
// sku
export interface SkuData {
  category3Id: string | number //三级分类的ID
  spuId: string | number //已有的SPU的ID
  tmId: string | number //SPU品牌的ID
  skuName: string //sku名字
  price: string | number //sku价格
  weight: string | number //sku重量
  skuDesc: string //sku的描述
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleArr[]
  skuDefaultImg: string //sku图片地址
}

//获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
