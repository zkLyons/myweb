<!--权限用户管理页面 -->
<template>
  <el-card>
    <el-table border style="margin-bottom: 10px" :data="skuArr">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        align="center"
        width="250px"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        align="center"
        width="250px"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="图片" align="center" width="180px">
        <template #="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="重量"
        align="center"
        width="180px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格"
        align="center"
        width="180px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="300px" fixed="right">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button
            type="success"
            size="small"
            icon="Edit"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            size="small"
            icon="InfoFilled"
            @click="checkInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            size="small"
            icon="Delete"
            @click="removeSku(row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @current-change="handler01"
      @size-change="handler02"
    />
  </el-card>
  <!-- 抽屉 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h1 style="text-align: center">sku详情</h1>
    </template>
    <template #default>
      <div>
        <el-row style="margin: 10px 0">
          <el-col :span="6">名称:</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <hr />
        <el-row style="margin: 10px 0">
          <el-col :span="6">描述:</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <hr />
        <el-row style="margin: 10px 0">
          <el-col :span="6">价格:</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <hr />
        <el-row style="margin: 10px 0">
          <el-col :span="6">平台属性:</el-col>
          <el-tag
            v-for="(item, index) in skuInfo.skuAttrValueList"
            :key="item.id"
            style="margin-right: 10px"
          >
            {{ item.attrName }}
          </el-tag>
        </el-row>
        <hr />
        <el-row style="margin: 10px 0">
          <el-col :span="6">销售属性:</el-col>
          <el-tag
            type="success"
            v-for="(item, index) in skuInfo.skuSaleAttrValueList"
            :key="item.id"
            style="margin-right: 10px"
          >
            {{ item.saleAttrName }}
          </el-tag>
        </el-row>
        <hr />
        <el-row style="margin: 10px 0">
          <el-col :span="6">商品图片:</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item"
              >
                <img :src="item" alt="" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </div>
    </template>
    <template #footer></template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
// 引入请求
import {
  reqSkuList,
  reqSaleSku,
  reqCancelSale,
  reqSkuInfo,
  reqRemoveSku,
} from '@/api/product/sku'
// 引入类型
import { SkuData, SkuResponseData } from '@/api/product/sku/type'
// 引入图标
import { ElMessage } from 'element-plus'

let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
// 控制抽屉的开关
let drawer = ref<boolean>(false)
// 存储请求到的sku信息
let skuInfo = reactive<any>({})

// current-page 改变时触发
const handler01 = (num: number) => {
  // 会自动将当前页num注入
  // getHasSku(num)
  // 这样也可以，因为使用了双向数据绑定
  getHasSku(currentPage.value)
}
//page-size 改变时触发
const handler02 = (num: number) => {
  // num表示当前一页展示多少数据，等同于pageSize，设置pageSize后，直接刷新到第一页即可，pageSize也是双向绑定的
  getHasSku()
}
const updateSale = async (row: SkuData) => {
  //如果当前商品的isSale==1,说明当前商品是上架的额状态->更新为下架
  //否则else情况与上面情况相反
  if (row.isSale === 1) {
    let result01 = await reqCancelSale(row.id)
    if (result01.code === 200) {
      ElMessage({
        type: 'success',
        message: '下架成功',
      })

      getHasSku(currentPage.value)
    }
  } else {
    let result02 = await reqSaleSku(row.id)
    if (result02.code === 200) {
      ElMessage({
        type: 'success',
        message: '上架成功',
      })
      getHasSku(currentPage.value)
    }
  }
}
const edit = () => {
  ElMessage({ type: 'success', message: '有待开发，敬请期待。。。' })
}
const getHasSku = async (pager = 1) => {
  // getHasSku接受的默认参数为1
  currentPage.value = pager
  let result: SkuResponseData = await reqSkuList(
    currentPage.value,
    pageSize.value,
  )
  console.log(result)
  if (result.code === 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
const checkInfo = async (row: SkuData) => {
  drawer.value = true
  let result = await reqSkuInfo(row.id)
  if (result.code === 200) {
    skuInfo = result.data
    console.log(skuInfo)
  }
}

//删除某一个已有的商品
const removeSku = async (id: number) => {
  //删除某一个已有商品的情况
  let result: any = await reqRemoveSku(id)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '删除成功' })
    //获取已有全部商品
    getHasSku(
      skuArr.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    //删除失败
    ElMessage({ type: 'error', message: '删除失败' })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
