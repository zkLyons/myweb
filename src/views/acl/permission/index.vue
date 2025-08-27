<!--权限用户管理页面 -->
<template>
  <div>
    <!-- 支持树类型的数据的显示。 当 row 中包含 children 字段时，被视为树形数据。 
    渲染嵌套数据需要 prop 的 row-key。  -->
    <el-table
      :data="permissionArr"
      row-key="id"
      border
      style="width: 100%; margin-bottom: 20px"
    >
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="addPermission(row)">
            {{ row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            type="primary"
            :disabled="row.level == 1 ? true : false"
            @click="editPermission(row)"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            :disabled="row.level == 1 ? true : false"
            @click="deletePermission(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      :title="permissionParams.id ? '编辑菜单' : '添加菜单'"
    >
      <template #default>
        <el-form>
          <el-form-item label="名称">
            <el-input
              placeholder="请输入名称："
              v-model="permissionParams.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="权限">
            <el-input
              placeholder="请输入权限值："
              v-model="permissionParams.code"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confrirmAddPermission">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  reqAllPermisstion,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from '@/api/acl/menu'
import {
  PermisstionResponseData,
  PermisstionList,
  MenuParams,
  Permisstion,
} from '@/api/acl/menu/type'

//存储菜单数据
let permissionArr = ref<PermisstionList>([])
let dialogVisible = ref<boolean>(false)
let permissionParams = reactive<MenuParams>({
  code: '', //权限数值
  level: 0, //几级菜单
  name: '', //菜单的名字
  pid: 0, //菜单的ID
})

onMounted(() => {
  getHasPermission()
})

// 发送请求，获取菜单数据
const getHasPermission = async () => {
  await reqAllPermisstion()
    .then((res: PermisstionResponseData) => {
      if (res.code === 200) {
        // 成功
        // ElMessage.success('获取权限列表成功')
        permissionArr.value = res.data
      } else {
        // 失败
        ElMessage.error('获取权限列表失败')
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}
// 添加权限按钮
const addPermission = async (row: Permisstion) => {
  Object.assign(permissionParams, {
    id: 0,
    code: '', //权限数值
    level: 0, //几级菜单
    name: '', //菜单的名字
    pid: 0, //菜单的ID
  })
  dialogVisible.value = true
  // 获取level
  permissionParams.level = row.level + 1
  // 获取pid
  permissionParams.pid = row.id
}
const confrirmAddPermission = async () => {
  dialogVisible.value = false
  await reqAddOrUpdateMenu(permissionParams)
    .then((res: PermisstionResponseData) => {
      if (res.code === 200) {
        console.log(res.data)
        // 成功
        ElMessage({
          type: 'success',
          message: permissionParams.id ? '修改权限成功' : '添加权限成功',
        })
        // 重新获取权限列表
        getHasPermission()
      } else {
        // 失败
        ElMessage({
          type: 'success',
          message: permissionParams.id ? '修改权限失败' : '添加权限失败',
        })
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}
const editPermission = (row: Permisstion) => {
  dialogVisible.value = true
  Object.assign(permissionParams, row)
}
const deletePermission = async (row: Permisstion) => {
  await reqRemoveMenu(row.id).then((res: PermisstionResponseData) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '删除成功！',
      })
      getHasPermission()
    } else {
      ElMessage({
        type: 'error',
        message: '删除失败！',
      })
    }
  })
}
</script>

<style scoped lang="scss"></style>
