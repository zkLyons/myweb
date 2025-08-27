<!--添加spu的结构 -->
<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称" style="width: 80%">
        <el-input
          style="width: 80%"
          placeholder="请你输入spu名称"
          v-model="spuParams.spuName"
        >
          {{}}
        </el-input>
      </el-form-item>
      <el-form-item label="SPU品牌" style="width: 50%">
        <el-select v-model="spuParams.tmId">
          <!-- <el-option -for="(item, index) in  AllTradeMark" :key="item.id" :label="item.tmName"
                        :value="item.id"></el-option> -->
          <el-option label="1" value="3344"></el-option>
          <el-option label="22" value="5566"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" style="width: 80%">
        <el-input
          type="textarea"
          placeholder="请你输入spu描述"
          v-model="spuParams.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- v-model:file-list="imgList"：使用v-model向子组件el-upload传递数据file-list， -->
        <!-- 使用这个element-plus组件，v-model：file-list所绑定的数据type是固，[{name:string,url:string}] -->
        <!-- 一定需要name和url这两个字段，名字类型都要相同，所以需要对imgList的类型进行转换和约束。 -->
        <!-- action：发请求的地址，上传图片 -->
        <!-- on-preview:点击文件列表中已上传的文件时的钩子,可以用来控制图片的大小缩放 -->
        <el-upload
          v-model:file-list="imgList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :before-upload="handlerUpload"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <!-- 点击图片的放大＋号，观看大图，dialog的显示与隐藏通过dialogVisible来控制 -->
        <el-dialog v-model="dialogVisible">
          <img
            w-full
            :src="dialogImageUrl"
            alt="Preview Image"
            style="width: 90%"
          />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <el-select
          v-model="saleAttrIdAndValueName"
          style="width: 20%; margin-right: 10px"
          :placeholder="
            unSelectSaleAttr.length
              ? `还未选择${unSelectSaleAttr.length}个`
              : '无'
          "
        >
          <el-option
            :value="`${item.id}:${item.name}`"
            v-for="(item, index) in unSelectSaleAttr"
            :key="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="Plus"
          @click="addSaleAttr"
          :disabled="saleAttrIdAndValueName ? false : true"
        >
          添加销售属性
        </el-button>
        <el-table border style="margin: 10px 0px" :data="saleAttr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="销售属性名字"
            width="120px"
            prop="saleAttrName"
          ></el-table-column>
          <el-table-column label="销售属性值">
            <!-- row:即为当前SPU已有的销售属性对象 -->
            <template #default="{ row }">
              <el-tag
                style="margin: 0px 5px"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
                v-for="(item, index) in row.spuSaleAttrValueList"
                :key="row.id"
                class="mx-1"
                closable
              >
                {{ item.saleAttrValueName }}
              </el-tag>
              <el-input
                @blur="toLook(row)"
                v-model="row.saleAttrValue"
                placeholder="请你输入属性值"
                v-if="row.flag == true"
              ></el-input>
              <el-button
                type="primary"
                icon="Plus"
                @click="toEdit(row)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                icon="Delete"
                @click="saleAttr.splice($index, 1)"
              ></el-button>
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
// 引入请求api
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
import type {
  SaleAttrValue,
  SpuData,
  HasSaleAttr,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  Trademark,
  SpuImg,
  SaleAttr,
  saleArr,
} from '@/api/product/spu/types'
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

let $emits = defineEmits(['changeScence'])
// 存储父组件传递过来的spu对象
let spuParams = reactive<SpuData>({
  category3Id: '', //spu所属于的3级分类
  spuName: '', //spu的名字
  tmId: '', //品牌id
  description: '', //spu描述
  spuImageList: [], //spu的品牌图片列表
  spuSaleAttrList: [], //spu的属性列表
})
// 存储所有的spu数据
let AllTradeMark = ref<Trademark[]>([])
// spu品牌的图片
let imgList = ref<SpuImg[]>([])
// 已有的spu销售属性
let saleAttr = ref<SaleAttr[]>([])
// 所有的销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
// 控制图片dialog的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 当图片大图的时候，图片的地址
let dialogImageUrl = ref<string>('')
//将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('')

const cancel = () => {
  $emits('changeScence', { flag: 0, params: 'update' })
}
// 父组件调用子组件spuForm的方法，传递spu数据
const initHasSpu = async (spu: SpuData) => {
  // 存储父组件传递过来的spu对象
  spuParams = spu
  // 获取该spu的所有品牌数据
  let result: AllTradeMark = await reqAllTradeMark()
  // 获取该spu的所有品牌的图片数据
  let result_img: SpuHasImg = await reqSpuImageList(spu.id as number)
  //获取某一个已有的SPU拥有多少个销售属性
  let result_attr: SaleAttrResponseData = await reqSpuHasSaleAttr(
    spu.id as number,
  )
  // 获取全部销售属性
  let allAttr: HasSaleAttrResponseData = await reqAllSaleAttr()
  AllTradeMark.value = result.data
  imgList.value = result_img.data
  saleAttr.value = result_attr.data
  allSaleAttr.value = allAttr.data
}
const handlePictureCardPreview = (file: any) => {
  dialogVisible.value = true
  dialogImageUrl.value = file.url
}
const handlerUpload = (file: any) => {
  // 约束文件类型及大小
  if (
    file.type == 'image/png' ||
    file.type == 'image/jpeg' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 > 10) {
      ElMessage({
        type: 'error',
        message: '图片大小大于10MB',
      })
      return false
    } else {
      ElMessage({
        type: 'success',
        message: '上传成功',
      })
      return true
    }
  } else {
    ElMessage({
      type: 'error',
      message: '请上传png|jpeg|gif类型的文件。',
    })
    return false
  }
}
//计算出当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  //全部销售属性:颜色、版本、尺码
  //已有的销售属性:颜色、版本
  let unSelectArr = allSaleAttr.value.filter((item) => {
    // every()：遍历item1，如果有不满足条件的，立刻停止遍历，返回false，item为尺码的时候，every返回结果为true
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

//添加销售属性的方法
const addSaleAttr = () => {
  /*
    "baseSaleAttrId": number,
    "saleAttrName": string,
    "spuSaleAttrValueList": SpuSaleAttrValueList
    */
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  //准备一个新的销售属性对象:将来带给服务器即可
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  //追加到数组当中
  saleAttr.value.push(newSaleAttr)
  //清空收集的数据
  saleAttrIdAndValueName.value = ''
}
const toEdit = (row: SaleAttr) => {
  // 点击按钮，模式切换为编辑模式input
  row.flag = true
  //先将定义一个属性值变量，后续的属性值收集到此。然后再push到属性数组里面。
  row.saleAttrValue = ''
}

// 当输入框失去焦点的时候，将收集到的属性值push到属性数组里面
// /表单元素失却焦点的事件回调
const toLook = (row: SaleAttr) => {
  //整理收集的属性的ID与属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row
  //整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }

  //非法情况判断
  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空的',
    })
    return
  }
  //判断属性值是否在数组当中存在
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })

  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复',
    })
    return
  }

  //追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  //切换为查看模式
  row.flag = false
}

//保存按钮的回调
const save = async () => {
  //整理参数
  //发请求:添加SPU|更新已有的SPU
  //成功
  //失败
  //1:照片墙的数据
  spuParams.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, //图片的名字
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  //2:整理销售属性的数据
  spuParams.spuSaleAttrList = saleAttr.value
  let result = await reqAddOrUpdateSpu(spuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: spuParams.id ? '更新成功' : '添加成功',
    })
    //通知父组件切换场景为0
    $emits('changeScence', { flag: 0, params: spuParams.id ? 'update' : 'add' })
  } else {
    ElMessage({
      type: 'success',
      message: spuParams.id ? '更新成功' : '添加成功',
    })
  }
}
const initAddSpu = async (c3Id: number | string) => {
  // 清空数据,当点击添加spu进入到spu界面的时候，清空原来的数据。
  Object.assign(spuParams, {
    category3Id: '', //spu所属于的3级分类
    spuName: '', //spu的名字
    tmId: '', //品牌id
    description: '', //spu描述
    spuImageList: [], //spu的品牌图片列表
    spuSaleAttrList: [], //spu的属性列表
  })
  // 存储三级分类id
  spuParams.category3Id = c3Id
  // 获取该spu的所有品牌数据
  let result: AllTradeMark = await reqAllTradeMark()
  // // 获取该spu的所有品牌的图片数据
  // let result_img: SpuHasImg = await reqSpuImageList(spu.id as number)
  // //获取某一个已有的SPU拥有多少个销售属性
  // let result_attr: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  // 获取全部销售属性
  let allAttr: HasSaleAttrResponseData = await reqAllSaleAttr()
  AllTradeMark.value = result.data
  // imgList.value = result_img.data
  // saleAttr.value = result_attr.data
  allSaleAttr.value = allAttr.data
}
// 对外暴露方法
defineExpose({ initHasSpu, initAddSpu })
</script>

<style scoped lang="scss"></style>
