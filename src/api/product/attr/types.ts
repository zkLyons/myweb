// 分类相关的数据的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//  分类ts类型
// 一级分类数据：id，name
// 二级分类数据：id，name，category1Id
// 三级分类数据：id，name，category2Id
export interface Categoryobj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

// 响应的分类接口返回数据的类型
export interface CategoryResponseData extends ResponseData {
  data: Categoryobj[]
}

//属性与属性值的ts类型

//属性值对象的ts类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}
//存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]
//属性对象
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}

//存储每一个属性对象的数组ts类型
export type AttrList = Attr[]
//属性接口返回的数据ts类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
