// 品牌管理模块
import request from '@/utils/request'
import type { ResponseData, Trademark } from './types'

enum API {
  //获取已有品牌接口,需要带上页码和每页的条数参数
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  //添加品牌
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  //修改已有品牌
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  //删除已有品牌
  DELETE_URL = '/admin/product/baseTrademark/remove/',
}

//获取已有品牌接口
export const resHasTrademark = (pageNo: number, pageSize: number) =>
  request.get<any, ResponseData>(API.TRADEMARK_URL + `${pageNo}/${pageSize}`)
// 添加和修改品牌接口
export const reqAddOrUpdateTrademark = (data: Trademark) => {
  // 如果携带id，说明是修改品牌信息，否则是添加品牌信息。
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    //新增品牌
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}
//删除某一个已有品牌的数据
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
