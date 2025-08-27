<!--权限用户管理页面 -->
<template>
  <div>
    <el-card>
      <!-- v-has是自定义指令，每当mounted一次，都会执行一次v-has自定义指令 -->
      <!-- 另外一种简单粗暴的方法是，v-if='useStore.buttons.includes=('btn.Trademark.add')' -->
      <el-button
        type="primary"
        :icon="Plus"
        @click="addTrademark"
        v-has="`btn.Trademark.add`"
      >
        添加品牌
      </el-button>
      <!-- 表格 -->
      <el-table
        stripe
        style="width: 100%; margin: 10px 0"
        border
        :data="trademarkArr"
      >
        <el-table-column
          label="序号"
          width="60px"
          align="center"
          type="index"
        />
        <el-table-column
          label="品牌名称"
          width="180"
          align="center"
          prop="tmName"
        />
        <el-table-column label="品牌LOGO" align="center">
          <template v-slot="{ row }">
            <img :src="row.logoUrl" style="width: 80px; height: 80px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作" align="center">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              :icon="Edit"
              @click="() => updataTrademark(row)"
              v-has="`btn.Trademark.update`"
            ></el-button>
            <el-popconfirm
              :title="`确定删除${row.tmName} 吗？`"
              icon="Delete"
              width="250px"
              @confirm="() => deleteTrademark(row.id)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  :icon="Delete"
                  v-has="`btn.Trademark.remove`"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!--  -->
      <div class="demo-pagination-block">
        <!-- pagination:
                            v-model:current-page="currentPage": 当前页数
                            v-model:page-size="pageSize"：每页显示条目个数
                            :page-sizes="[100, 200, 300, 400]"：每页显示个数选择器的选项设置
                            :background="background":是否为分页按钮添加背景色
                            layout="total, sizes, prev, pager, next, jumper":分页组件布局-》总共数据条数，多少数据每条，上一页，页码，下一页，跳转到多少页

                -->
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 10]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @change="getHasTrademark"
        />
      </div>
    </el-card>

    <!-- 弹出对话框 -->

    <el-dialog
      v-model="dialogFormVisible"
      :title="formParms.id ? '修改品牌' : '添加品牌'"
      width="500"
    >
      <!--:model='formParms':表单校验功能需要，校验的数据再formParmas里面  -->
      <!-- :rules="rules" 定义校验规则 -->
      <!--  ref="ruleFormRef" 获取表单对象 -->
      <el-form :model="formParms" :rules="rules" ref="ruleFormRef">
        <el-form-item label="品牌名称：" style="width: 80%" prop="tmName">
          <el-input
            placeholder="请输入品牌名称"
            v-model="formParms.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传LOGO:" prop="logoUrl">
          <!-- upload组件属性:action图片上传路径书写/api,代理服务器不发送这次post请求  -->
          <!-- before-upload:图片上传成功之前，进行的操作，可以在此限制图片类型和大小。 -->
          <!-- show-file-list:图片上传成功后，展示列表。 -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="formParms.logoUrl"
              :src="formParms.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<!-- /admin/cms/banner/save -->

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, UploadProps } from 'element-plus'
// 引入获取品牌数据接口
import {
  resHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark/index'
// 导入图标
import { Edit, Delete } from '@element-plus/icons-vue'
// 导入数据类型
import type { ResponseData, Trademark } from '@/api/product/trademark/types'

let currentPage = ref(1) //当前页数
let pageSize = ref<number>(5) //每页显示的条目个数
let total = ref<number>(0) //数据总条数
let trademarkArr = ref<Trademark[]>([]) //存储获取到pageSize条品牌数据
let dialogFormVisible = ref<boolean>(false) //控制对话框的显示与隐藏
let formParms = reactive<Trademark>({
  tmName: '', //品牌名称
  logoUrl: '', //品牌LOGO
})
let ruleFormRef = ref() //获取表单对象

// 获取品牌数据的方法
const getHasTrademark = async (pager = 1) => {
  //当前页码
  currentPage.value = pager
  let result: ResponseData = await resHasTrademark(
    currentPage.value,
    pageSize.value,
  )
  if (result.code === 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
    // console.log(trademarkArr.value, 4455)
  }
}
// 品牌name校验规则
const validatorTmName = (rule: any, value: any, callback: any) => {
  console.log(4445555)
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称至少2个字符！'))
  }
}
// 品牌logoUrl校验规则
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('请上传品牌LOGO!'))
  }
}

// 表单校验
//表单校验规则对象
const rules = {
  tmName: [
    //required:这个字段务必校验,表单项前面出来五角星
    //trigger:代表触发校验规则时机[blur、change]
    // validator:自定义校验规则
    { required: true, trigger: 'blur', validator: validatorTmName },
  ],
  // 对于图片的校验，因为是上传文件，所以使用trigger的change或blur都不会触发
  // 需要使用表单的vaildate方法来手动触发校验(vaildate可以在提交时校验所有表单项，也可以单独家某一个字段)
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}

//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  //钩子是在图片上传成功之前触发,上传文件之前可以约束文件类型与大小
  //要求:上传文件格式png|jpg|gif 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必PNG|JPG|GIF',
    })
    return false
  }
}
// 上传文件成功的回调函数
//图片上传成功钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response: any,
  uploadFile: any,
) => {
  //response:即为当前这次上传图片post请求服务器返回的数据
  //收集上传图片的地址,添加一个新的品牌的时候带给服务器
  // console.log(response, 1111)
  formParms.logoUrl = response.data
  //图片上传成功,清除掉对应图片校验结果
  ruleFormRef.value.clearValidate('logoUrl')
}
const addTrademark = () => {
  // 清空表单之前的数据。
  dialogFormVisible.value = true

  formParms.id = 0
  formParms.tmName = ''
  formParms.logoUrl = ''
  // 清空表单校验结果，否则重新打开还是会有上次的校验结果
  // 初始点击添加按钮，ruleFormRef是undifined的
  ruleFormRef.value?.clearValidate('tmName')
  ruleFormRef.value?.clearValidate('logoUrl')
}
const confirm = async () => {
  // 点击确认按钮，提交表单数据。
  // 表单校验，统一校验。
  await ruleFormRef.value.validate()
  //提交数据
  let result: any = await reqAddOrUpdateTrademark(formParms)
  console.log(result, 1112)
  //1.关闭对话框
  dialogFormVisible.value = false

  //2.弹出提示信息
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: formParms.id ? '修改成功！' : '添加成功！',
    })
  } else {
    ElMessage({
      type: 'error',
      message: formParms.id ? '修改失败！' : '添加失败！',
    })
  }
  //3.重新发送请求，获取最新的品牌信息
  getHasTrademark()
}
// 修改品牌信息
const updataTrademark = (row: Trademark) => {
  // 清空表单校验结果，否则重新打开还是会有上次的校验结果
  // 初始点击添加按钮，ruleFormRef是undifined的
  ruleFormRef.value?.clearValidate('tmName')
  ruleFormRef.value?.clearValidate('logoUrl')

  dialogFormVisible.value = true
  // console.log(row, 134)
  // 更新数据
  formParms.tmName = row.tmName
  formParms.logoUrl = row.logoUrl
  // 加入id
  formParms.id = row.id
}
// 删除品牌信息
const deleteTrademark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  // 删除成功，弹出提示信息
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功！',
    })
    //重新获取数据
    getHasTrademark(
      trademarkArr.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败！',
    })
  }
}

// 挂载时默认获取第一页的数据
onMounted(() => {
  getHasTrademark()
})
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
