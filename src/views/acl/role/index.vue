<!--权限用户管理页面 -->
<template>
  <div>
    <!-- {{ rolePermissionArr }} -->
    <el-card>
      <el-form inline="true" class="form-top">
        <el-form-item label="角色名称" style="width: 30%">
          <el-input v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px">
      <el-button type="primary" icon="Plus" @click="addRole">
        添加角色
      </el-button>
      <el-table border style="margin: 10px 0" :data="roleArr">
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="id" align="center" prop="id"></el-table-column>
        <el-table-column
          label="职位名称"
          align="center"
          prop="roleName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="UserFilled"
              @click="setPermission(row)"
            >
              分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="editRole(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定删除${row.name}吗？`"
              @confirm="deleteRole(row)"
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
        layout=" sizes, prev, pager, next, jumper,->,total"
        :total="total"
        @change="handler"
      />
    </el-card>
    <!-- 添加职位、编辑职位对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="roleParams.id ? '编辑职位信息' : '添加职位'"
      width="500"
    >
      <template #default>
        <el-form :model="roleParams" :rules="rules" ref="formRef">
          <el-form-item label="职位名称" prop="roleName">
            <el-input
              placeholder="请输入职位名称："
              v-model="roleParams.roleName"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addRoleConfirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加右侧抽屉：用于权限分配 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>职位权限分配</h4>
      </template>
      <template #default>
        <el-tree
          style="max-width: 600px"
          :data="permissionArr"
          show-checkbox
          node-key="id"
          :default-checked-keys="rolePermissionArr"
          :props="defaultProps"
          default-expand-all
          ref="tree"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermisstion,
  reqRemoveRole,
} from '@/api/acl/role'
import { RoleData, MunuData, MenuList, Records } from '@/api/acl/role/type'

let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let keyword = ref<string>('')
let roleArr = ref<Records>([])
let total = ref<number>(0)
let dialogVisible = ref<boolean>(false)
// 收集添加角色和编辑角色的表单数据
let roleParams = reactive<RoleData>({
  id: 0,
  roleName: '',
})
// 收集当前职位的id信息
let roleId = ref<number>(0)
// 获取表单对象
let formRef = ref<any>()
// 控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 接受全部权限信息
let permissionArr = ref<MenuList>([])
// 为当前职位分配的权限数组
let rolePermissionArr = ref<number[]>([])
// 树形菜单实例对象
let tree = ref<any>()

const validatorRoleName = (rules: any, value: any, callback: any) => {
  if (value.trim().length < 2) {
    callback(new Error('角色名称至少两个字符'))
  }
  callback()
}

// 表单校验规则
const rules = reactive<any>({
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
})

// 分页器
const handler = (value: any) => {
  getHasRole(value)
}
const search = () => {
  getHasRole()
}
const reset = () => {
  keyword.value = ''
  currentPage.value = 1
  getHasRole()
}
// 添加角色按钮事件
const addRole = () => {
  dialogVisible.value = true
  // 清空遗留的数据
  Object.assign(roleParams, { roleName: '', id: 0 })
  // 清空表单验证提醒
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
// 添加角色按钮save事件。
const addRoleConfirm = async () => {
  // 获取表单对象
  await formRef.value.validate()
  let result = await reqAddOrUpdateRole(roleParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: roleParams.id ? '修改成功！' : '添加成功！',
    })
    getHasRole(roleParams.id ? currentPage.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: roleParams.id ? '修改失败！' : '添加失败！',
    })
  }
  dialogVisible.value = false
}
const editRole = (row: RoleData) => {
  // 清空表单验证提醒
  nextTick(() => {
    formRef.value.clearValidate()
  })
  dialogVisible.value = true
  roleParams.id = row.id
}

const getHasRole = async (pager: number = 1) => {
  currentPage.value = pager
  let result = await reqAllRoleList(
    currentPage.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    roleArr.value = result.data.records
    total.value = result.data.total
  }
}
onMounted(() => {
  getHasRole()
})
// 分配权限对应的按钮事件
const setPermission = async (row: RoleData) => {
  drawer.value = true
  roleId.value = row.id
  // 发送请求，获取权限菜单列表
  let result = await reqAllMenuList(row.id)
  if (result.code === 200) {
    console.log(result.data, '233')
    permissionArr.value = result.data
    rolePermissionArr.value = []
    getRolePermission(permissionArr.value)
  }
}
// 递归获取当前职位的权限信息。
const getRolePermission = (allData: MenuList) => {
  allData.forEach((item: any) => {
    // 如果当前没有子菜单，且已被勾选，就加入到权限数组中
    if (item.select) {
      // 最深以及菜单可能有children，但是为空，可能没有children，所以分情况讨论。
      if (item.children) {
        if (item.children.length === 0) {
          rolePermissionArr.value.push(item.id)
        }
      } else {
        rolePermissionArr.value.push(item.id)
      }
    }
    if (item.children && item.children.length > 0) {
      getRolePermission(item.children)
    }
  })
}

// 树形菜单参数,截取自element-plus官网
const defaultProps = {
  children: 'children',
  label: 'name',
}
// 权限分配，点击确认按钮
const confirmClick = async () => {
  drawer.value = false
  // 节点构成为：选中+半选中，勾选需要提交两者。
  //选中节点的ID
  let arr = tree.value.getCheckedKeys()
  //半选的ID
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)

  //获取当前职位的id
  console.log(rolePermissionArr.value)
  let result = await reqSetPermisstion(roleId.value, permissionId)

  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '权限分配成功！',
    })
    //页面刷新
    // window.location.reload();
  } else {
    ElMessage({
      type: 'error',
      message: '权限分配失败！',
    })
  }
}
// 删除职位
const deleteRole = async (row: MunuData) => {
  let result = await reqRemoveRole(row.id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功！',
    })
    getHasRole(
      roleArr.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败！',
    })
  }
}
</script>

<style scoped lang="scss">
.form-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 5px;
}
</style>
