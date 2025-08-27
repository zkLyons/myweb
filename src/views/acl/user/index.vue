<!--权限用户管理页面 -->
<template>
  <div>
    <el-card>
      <el-form inline="true" class="top">
        <el-form-item label="用户" style="width: 30%">
          <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" :disabled="!keyword" @click="SearchHandler">
            搜索
          </el-button>
          <el-button type="success" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px">
      <el-button type="primary" @click="addUser">添加</el-button>
      <el-button
        type="warning"
        @click="deleteSelectUser"
        :disabled="userIdList.length ? false : true"
      >
        批量删除
      </el-button>
      <el-table
        border
        style="margin: 10px 0"
        :data="userArr"
        @selection-change="SelectUser"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          type="index"
          label="#"
          align="center"
        ></el-table-column>
        <el-table-column label="id" align="center" prop="id"></el-table-column>
        <el-table-column
          label="用户名字"
          align="center"
          prop="name"
        ></el-table-column>
        <el-table-column
          label="用户名称"
          align="center"
          prop="username"
        ></el-table-column>
        <el-table-column
          label="用户角色"
          align="center"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
        ></el-table-column>
        <el-table-column label="操作" width="300px">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="UserFilled"
              @click="setRole(row)"
            >
              分配职位
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="UpdateUser(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定删除${row.name}吗？`"
              @confirm="deleteUser(row)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @change="hanlder01"
      />
    </el-card>
    <el-drawer v-model="drawer" title="I am the title">
      <template #header>
        <span>{{ userParams.id ? '修改用户信息' : '添加用户信息' }}</span>
      </template>
      <template #default>
        <el-form
          :model="userParams"
          :rules="rules"
          ref="formRef"
          style="margin-top: 20px"
        >
          <el-form-item label="用户姓名" prop="username">
            <el-input
              placeholder="请输入用户姓名"
              v-model="userParams.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input
              placeholder="请输入用户昵称"
              v-model="userParams.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input
              placeholder="请输入用户密码"
              v-model="userParams.password"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button type="primary" icon="UserFilled" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" icon="Edit" @click="save">确认</el-button>
      </template>
    </el-drawer>
    <!-- 抽屉结构：控制角色分配 -->
    <el-drawer v-model="drawer2">
      <template #header>
        <h4>用户角色分配</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-model="checkedRole"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="(rolea, index) in role"
                :key="index"
                :label="rolea"
                :value="rolea"
              >
                {{ rolea.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqSelectUser,
  reqRemoveUser,
  reqAddOrUpdateUser,
  reqUserInfo,
  reqAllRole,
  reqSetUserRole,
} from '@/api/acl/user'
import {
  UserResponseData,
  Records,
  User,
  AllRole,
  SetRoleData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import useLayOutSettingStore from '@/store/modules/setting'

let settingStore = useLayOutSettingStore()

let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let userArr = ref<Records>([])
let drawer = ref<boolean>(false)
let userParams = reactive<User>({
  name: '',
  username: '',
  password: '',
})
// 表单对象
let formRef = ref<any>()
// 控制角色分配抽屉
let drawer2 = ref<boolean>(false)
// 所有职位
let role = ref<AllRole>([])
// 控制全选
let checkAll = ref<boolean>(false)
// 控制不确定状态，1.全选 2.全部选 3.选了一部分 不确定状态属于第三种
//全选框的图标：1.对勾 2.空白 3.横线
const isIndeterminate = ref(false)
// 复选框选中了那些值,初始表示用户现有职位
const checkedRole = ref<AllRole>([])
// 存储批量选择的用户的id
let userIdList = ref<number[]>([])
// 搜索框关键字
let keyword = ref<string>('')
onMounted(() => {
  getHasUser()
})

// 分页器
const hanlder01 = () => {
  getHasUser(currentPage.value)
}
const addUser = () => {
  // 清除上一次的信息
  Object.assign(userParams, {
    id: 0,
    name: '',
    username: '',
    password: '',
  })
  drawer.value = true
  // 清除表单校验的信息
  // 当第一次点击表单的时候，抽屉还没有渲染，所以，没有formRef元素，需要使用nextTick等页面渲染完后在使用formRef
  nextTick(() => {
    // 清除所有表单的验证信息
    formRef.value.clearValidate()
  })
}
const UpdateUser = (row: User) => {
  drawer.value = true
  Object.assign(userParams, row)
  // 当第一次点击表单的时候，抽屉还没有渲染，所以，没有formRef元素，需要使用nextTick等页面渲染完后在使用formRef
  // 同样的，当第一次点击修改后，如果表单校验没有通过，点击取消，再次点击修改，就会发现检验信息并没有消除，需要使用clearValidate
  nextTick(() => {
    // 清除整个表单的检验状态
    formRef.value.clearValidate()
  })
}
const save = async () => {
  // 验证表单校验是否通过
  await formRef.value.validate()
  //发送添加请求
  let result = await reqAddOrUpdateUser(userParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: userParams.id ? '修改成功' : '添加成功',
    })
    // 如果用户修改到了自己的信息，那么应该跳转到登录页重新登录
    // 所以一旦修改了信息，就立刻刷新页面，重新走路由守卫
    window.location.reload()
    drawer.value = false
    getHasUser(currentPage.value)
  } else {
    ElMessage({
      type: 'error',
      message: userParams.id ? '修改失败' : '添加失败',
    })
  }
}
// 对用户姓名进行校验
const validatorUserName = (rule: any, value: any, callBack: any) => {
  console.log(rule)
  console.log(userArr)
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户姓名至少五位'))
  }
}
//对昵称进行校验
const validatorName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
//对密码进行校验
const validatorPassword = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
const rules = reactive<any>({
  //用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUserName }],
  //用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  // //用户的密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
})
const cancel = () => {
  drawer.value = false
}
const getHasUser = async (pager = 1) => {
  currentPage.value = pager
  let result: UserResponseData = await reqUserInfo(
    currentPage.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code === 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
// 角色分配点击事件
const setRole = async (row: User) => {
  // 发送请求获取全部职位信息和用户已有的职位信息
  let result = await reqAllRole(row.id as number)
  console.log(result)
  console.log(result.data, '111')
  role.value = result.data.allRolesList
  checkedRole.value = result.data.assignRoles
  drawer2.value = true
  Object.assign(userParams, row)
}
// 全选框点击事件，点击控制全选和全不选
const handleCheckAllChange = (val: any) => {
  // val:boolean类型，表示全选与否
  // checkALl同样可以表示复选框的全选与否，但是这里不能使用用户点击全选框时，事件触发时，全选框的状态可能还没有及时更新到 checkAll 中
  checkedRole.value = val ? role.value : []
  // 将不确定状态取消
  isIndeterminate.value = false
}
// 职位复选框点击事件
const handleCheckedCitiesChange = (val: any) => {
  // val:代表当前已勾选的职位数组
  const checkedCount = val.length
  checkAll.value = checkedCount === role.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < role.value.length
}
// 用户分配取消按钮事件
const cancelClick = () => {
  drawer2.value = false
}
// 用户分配确认按钮事件
const confirmClick = async () => {
  // 收集需要提交的用户职位信息
  let job_info: SetRoleData = {
    // 职位id列表
    roleIdList: checkedRole.value.map((item) => {
      return item.id as number
    }),
    // // 用户id
    userId: userParams.id as number,
  }
  let result = await reqSetUserRole(job_info)
  console.log(result)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '分配成功！',
    })
    drawer2.value = false
    getHasUser(currentPage.value)
  } else {
    ElMessage({
      type: 'error',
      message: '分配失败！',
    })
  }
}
// 删除单个用户
const deleteUser = async (row: User) => {
  let result = await reqRemoveUser(row.id as number)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功！',
    })
    getHasUser(
      userArr.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败！',
    })
  }
}
// 获取勾选的用户id列表
const SelectUser = async (userList: Records) => {
  // 将选中的用户信息注入到userList里
  // 发送请求只需要id即可
  userIdList.value = userList.map((item) => {
    return item.id as number
  })
}
// 批量删除用户
const deleteSelectUser = async () => {
  let result = await reqSelectUser(userIdList.value)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功！',
    })
    getHasUser(
      userArr.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败！',
    })
  }
}
// 搜索事件
const SearchHandler = () => {
  getHasUser()
}
const reset = () => {
  // 仓库中的数据一发生改变，就会触发依赖的页面重新渲染
  settingStore.refsh = !settingStore.refsh
}
</script>

<style scoped lang="scss">
.top {
  display: flex;
  justify-content: space-between;
}
</style>
