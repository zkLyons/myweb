<!--权限用户管理页面 -->
<template>
  <div>
    <Category :scence="scence"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scence === 0">
        <el-button
          type="primary"
          :icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <el-table border style="margin: 10px 0" :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="SPU操作">
            <!-- row:即为已有的SPU对象 -->
            <template #default="{ row }">
              <el-button
                type="primary"
                @click="() => addSku(row)"
                size="small"
                icon="Plus"
                title="添加SKU"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.spuName}?`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 10]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @current-change="getHasSpu"
        />
      </div>

      <!-- 添加spu页面 -->
      <SpuForm
        ref="spu"
        v-show="scence === 1"
        @changeScence="changeScence"
      ></SpuForm>
      <!-- 添加sku页面 -->
      <SkuForm
        ref="sku"
        v-show="scence === 2"
        @changeScence2="changeScence2"
      ></SkuForm>
      <el-dialog title="SKU属性" v-model="show">
        <el-table border :data="skuArr">
          <el-table-column label="名字" prop="skuName"></el-table-column>
          <el-table-column label="价格" prop="price"></el-table-column>
          <el-table-column label="重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #default="{ row }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue' // 显式导入 Plus 图标
import { ref, watch, onBeforeUnmount } from 'vue'
// 引入分类仓库
import useCategoryStore from '@/store/modules/category'
// 引入spu 的请求api
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu/index'
// 导入数据类型
import type {
  Records,
  SpuData,
  SkuInfoData,
  SkuData,
} from '@/api/product/spu/types'
// 引入组件
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'
import { ElMessage } from 'element-plus'

// 页面切换
//0:显示已有SPU  1:添加或者修改已有SPU 2:添加SKU的结构
let scence = ref<number>(0)
// 存储已有的SPU数据
let records = ref<Records>([])
let total = ref<number>(0)
let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
// 创建分类仓库对象
let categoryStore = useCategoryStore()
// spuForm的dom对象
let spu = ref<any>({})
//skuForm的dom对象,组件的实例对象最好使用ref来存储
let sku = ref<any>({})
// 存放spu对应的sku数据（点击查看按钮获取数据）
let skuArr = ref<SkuData[]>([])
// dialog的显示与隐藏
let show = ref<boolean>(false)
// 监听三级分类id变化
watch(
  () => categoryStore.c3Id,
  async () => {
    // 确保有三级分类再发请求
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)
// 获取三级分类对应的数据

const getHasSpu = async (pager = 1) => {
  // 获取对应的spu数据
  const result = await reqHasSpu(
    currentPage.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  // 这里拿到的数据是不完整的，关于spu的sku图片imglist，一级对应的属性列表，还需要再发送请求才能拿到。
  records.value = result.data.records
  total.value = result.data.total
  console.log(records.value, '++')
}

// 添加spu对应点击事件
const addSpu = () => {
  // 切换场景值
  scence.value = 1
  // 调用子组件的spu方法
  spu.value.initAddSpu(categoryStore.c3Id)
}
// 监听子组件的自定义事件，子组件点击取消，然后切换场景为0
const changeScence = (obj: any) => {
  //子组件Spuform点击取消变为场景0:展示已有的SPU
  scence.value = obj.flag
  if (obj.params == 'update') {
    //更新留在当前页
    getHasSpu(currentPage.value)
  } else {
    //添加留在第一页
    getHasSpu()
  }
}
// 修改spu按钮点击，进行场景切换
const updateSpu = (row: SpuData) => {
  scence.value = 1
  // 调用子组件实例方法获取完整的已有的spu数据
  spu.value.initHasSpu(row)
}
const addSku = (row: SpuData) => {
  scence.value = 2
  // 获取一级二级三级分类的id，三级id在row里有，以及对应行的spu的一些列数据。
  console.log(row, '==')
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
const changeScence2 = (obj: any) => {
  scence.value = obj.flag
}

// 查看sku
const findSku = async (row: SpuData) => {
  let result = await reqSkuList(row.id as number)
  if (result.code === 200) {
    skuArr.value = result.data
    show.value = true
  }
}
// 删除spu按钮
const deleteSpu = async (row: SpuData) => {
  console.log(row.id)

  let result = await reqRemoveSpu(row.id as number)
  console.log(result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //获取剩余SPU数据
    getHasSpu(
      records.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
// 路由组件销毁之前，清空仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped lang="scss"></style>
