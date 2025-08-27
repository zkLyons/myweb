//小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponseData } from '@/api/product/attr/types'
import type { CategoryState } from './types/type'

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      c1Arr: [],
      //存储一级分类的ID
      c1Id: '',
      //存储对应一级分类下二级分类的数据
      c2Arr: [],
      //收集二级分类的ID
      c2Id: '',
      //存储三级分类的数据
      c3Arr: [],
      //存储三级分类的ID
      c3Id: '',
    }
  },
  getters: {},
  actions: {
    async getC1() {
      const result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
      // console.log(this.c1Arr)
    },
    async getC2() {
      const result: CategoryResponseData = await reqC2(this.c1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
      // console.log(this.c2Arr,11)
    },
    async getC3() {
      const result: CategoryResponseData = await reqC3(this.c2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
      // console.log(this.c2Arr, 11)
    },
  },
})

export default useCategoryStore
