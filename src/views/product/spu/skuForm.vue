<!--添加sku的结构 -->
<template>
  <div>
    <el-form>
      <el-form-item label="sku名称">
        <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuParams.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(克)">
        <el-input
          placeholder="重量(克)"
          type="number"
          v-model="skuParams.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="sku描述">
        <el-input
          placeholder="sku描述"
          type="textarea"
          v-model="skuParams.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form inline="true">
          <el-form-item
            v-for="(item, index) in attrArr"
            :key="item.id"
            :label="item.attrName"
            label-width="150px"
          >
            <el-select
              style="width: 200px; margin-top: 10px"
              v-model="item.attrIdAndValueId"
            >
              <el-option
                :value="`${item.id}:${attrValue.id}`"
                v-for="(attrValue, index) in item.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form>
          <el-form-item
            :label="item.saleAttrName"
            v-for="(item, index) in saleArr"
            :key="item.id"
            label-width="150px"
          >
            <el-select
              style="width: 200px; margin-top: 10px"
              v-model="item.saleIdAndValueId"
            >
              <el-option
                :value="`${item.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in item.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table border :data="imgArr" ref="table">
          <el-table-column
            type="selection"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="图片">
            <template #default="{ row }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <!-- 点击该按钮，设置该新添加的sku的图片 -->
              <el-button type="primary" size="small" @click="handler(row)">
                设置默认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { SpuData, SkuData } from '@/api/product/spu/types'
// 引入接口给
import { reqAttr } from '@/api/product/attr'
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScence2'])
// 存储平台属性
let attrArr = ref<any>([])
// 存储销售属性
let saleArr = ref<any>([])
// 存储照片墙
let imgArr = ref<any>([])
// 收集sku的参数
let skuParams = reactive<SkuData>({
  //父组件传递过来的数据
  category3Id: '', //三级分类的ID
  spuId: '', //已有的SPU的ID
  tmId: '', //SPU品牌的ID
  //v-model收集
  skuName: '', //sku名字
  price: '', //sku价格
  weight: '', //sku重量
  skuDesc: '', //sku的描述
  //平台属性的收集
  skuAttrValueList: [],
  //销售属性
  skuSaleAttrValueList: [],
  //sku图片地址
  skuDefaultImg: '',
})
//获取table组件实例
let table = ref<any>()

const cancel = () => {
  $emit('changeScence2', { flag: 0, params: '' })
}

// 初始化页面函数，接受父组件传来的三级分类信息spudata

const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: SpuData,
) => {
  skuParams.category3Id = spu.category3Id
  // spu的id类型为：id？：number，可能为undefined，但是这里不为undefined
  skuParams.spuId = spu.id!
  skuParams.tmId = spu.tmId
  // 平台属性
  //获取对应分类下已有的属性与属性值接口,例如三级分类手机下的---》手机一级，电池容量，运行内存，CPU型号。。。。
  let result = await reqAttr(c1Id, c2Id, spu.category3Id)
  attrArr.value = result.data
  // 获取销售属性，例如spu：oppo的属性====颜色，内存大小
  let result1 = await reqSpuHasSaleAttr(spu.id as number)
  saleArr.value = result1.data
  // 获取照片墙的数据,oppo旗下各个产品
  let result2 = await reqSpuImageList(spu.id as number)
  imgArr.value = result2.data
}
const handler = (row: any) => {
  //清空用户选择,el-table的方法
  table.value.clearSelection()
  //选中的图片才勾选
  table.value.toggleRowSelection(row, true)
  //收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}

//保存按钮的方法
const save = async () => {
  //整理参数
  //平台属性
  // skuAttrValueList需要收集到的数据格式为[{attrId:number|string,valueId:number|string},...]
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  }, [])
  //销售属性
  // skuAttrValueList需要收集到的数据格式为[{saleAttrId:number|string,saleAttrValueId:number|string},...]
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return prev
    },
    [],
  )
  //添加SKU的请求
  let result: any = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功',
    })
    //通知父组件切换场景为零
    $emit('changeScence2', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败',
    })
  }
}

// 暴露方法
defineExpose({ initSkuData })
</script>

<style scoped lang="scss"></style>
