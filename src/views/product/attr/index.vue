<!--权限用户管理页面 -->
<template>
  <div>
    <Category :scence="scence" />
    <div>
      <el-card style="margin: 10px 0px" v-show="scence == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
          v-has="`btn.Attr.add`"
        >
          添加属性
        </el-button>
        <el-table stripe border :data="attrArr" style="margin: 10px 0">
          <el-table-column
            label="序号"
            align="center"
            width="120px"
            type="index"
          />
          <el-table-column
            label="属性名称"
            align="center"
            width="120px"
            prop="attrName"
          />
          <el-table-column label="属性值名称" align="center">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template #="{ row, $index }">
              <!-- 修改已有属性的按钮 -->
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
                v-has="`btn.Attr.update`"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.attrName}?`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    v-has="`btn.Attr.delete`"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div v-show="scence == 1" style="margin: 10px 0px">
      <el-card>
        <el-form>
          <el-form-item label="属性名称：" style="width: 300px">
            <el-input
              placeholder="请输入属性的名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          :disabled="attrParams.attrName ? false : true"
          :icon="Plus"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-table
          border
          style="margin: 10px 0"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="属性值" align="center">
            <template #="{ row, $index }">
              <!-- row代表表格的一行数据 -->
              <el-input
                :ref="(el:any) => handler(el, $index)"
                v-if="row.flag"
                v-model="row.valueName"
                @blur="() => toLook(row, $index)"
              ></el-input>
              <div v-else @click="() => toEdit(row, $index)">
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180px">
            <template #="{ $index }">
              <el-button
                type="warning"
                :icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import { ref, watch, reactive, nextTick, onBeforeUnmount } from 'vue'
import {
  reqAttr,
  reqAddOrUpdateAttr,
  reqRemoveAttr,
} from '@/api/product/attr/index'
import type {
  AttrResponseData,
  Attr,
  AttrValue,
} from '@/api/product/attr/types'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()
let attrArr = ref<Attr[]>([])
let scence = ref<number>(0) //根据场景值进行页面切换
//收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '', //新增的属性的名字
  attrValueList: [
    //新增的属性值数组
  ],
  categoryId: '', //三级分类的ID
  categoryLevel: 3, //代表的是三级分类
})
// 收集输入框的dom元素数组
let inputArr = ref<any>([])

watch(
  () => categoryStore.c3Id,
  () => {
    // 当一级二级发生变化的时候，三级也会发生变化，清空上一次的数据，清空表格
    attrArr.value = []
    // 当有三级分类的时候才会去发请求
    if (!categoryStore.c3Id) return
    getAttr()
  },
)
//获取已有的属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  //获取分类下的已有的属性与属性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

const addAttr = () => {
  // 每次点击时，先清空一下数据
  // 等效的逐个赋值写法（不推荐）
  // attrParams.attrName = "";
  // attrParams.attrValueList = [];
  // attrParams.categoryId = categoryStore.c3Id;
  // attrParams.categoryLevel = 3;
  Object.assign(attrParams, {
    attrName: '', // 清空属性名称
    attrValueList: [], // 清空属性值列表
    categoryId: categoryStore.c3Id, // 更新为当前三级分类ID
    categoryLevel: 3, // 固定为三级分类
  })
  scence.value = 1
  // 收集三级分类的属性id
  attrParams.categoryId = categoryStore.c3Id
}
const updateAttr = (row: Attr) => {
  scence.value = 1
  // 将已有的属性对象赋值给attrParams对象
  // JSON.parse(JSON.stringify(row)：解决 Object.assign()浅拷贝的问题。
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
const cancel = () => {
  scence.value = 0
}

//删除某一个已有的属性方法回调
const deleteAttr = async (attrId: number) => {
  //发相应的删除已有的属性的请求
  let result: any = await reqRemoveAttr(attrId)
  //删除成功
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //获取一次已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 添加属性值
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true,
  })
  //获取最后el-input组件聚焦
  nextTick(() => {
    // 点击添加属性值后，鼠标直接聚焦到属性值名称的输入框
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
// 保存按钮
const save = async () => {
  // 发送请求
  // 添加属性值非空检查
  if (!attrParams.attrValueList.length) {
    ElMessage({
      type: 'error',
      message: '未添加任何属性值！',
    })
    return
  }
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    // 添加成功
    // 切换场景
    scence.value = 0
    // 提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    // 重新获取全部数据
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
  console.log(result)
}
const toLook = (row: AttrValue, $index: number) => {
  // 非空检查
  if (row.valueName.trim() === '') {
    // 清空添加的{}对象
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '值不能为空！',
    })
    return
  }
  // 值重复性检查
  let arr = attrParams.attrValueList.filter((item: AttrValue) => {
    return item.valueName === row.valueName
  })
  if (arr.length > 1) {
    ElMessage({
      type: 'error',
      message: '值不能重复！',
    })
    // 清空添加的{}对象
    attrParams.attrValueList.splice($index, 1)
    return
  }
  row.flag = false
}
// 点击切换为编辑模式

const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  // 切换为编辑模式后自动聚焦输入框
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
const handler = (e: HTMLInputElement | null, $index: number) => {
  // 将inputdom元素存储到数组中
  console.log(e, 11)
  inputArr.value[$index] = e
}

//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库的数据
  categoryStore.$reset()
})
</script>

<style scoped lang="scss"></style>
