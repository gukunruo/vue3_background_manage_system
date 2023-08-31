<template>
  <!-- table组件的row-key属性可以开启树结构类型的数据展示 -->
  <el-table border :data="menuArr" row-key="id">
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <!-- row：即为已有的菜单对象|按钮的对象的数据 -->
      <template v-slot="{ row }">
        <!-- 最里面第四层不能进行添加，只能在外三层添加 -->
        <el-button
          type="primary"
          size="small"
          :disabled="row.level == 4 ? true : false"
          @click="addMenu(row)"
        >
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <!-- 第一层不能进行编辑和删除，所以禁用 -->
        <el-button
          type="primary"
          size="small"
          :disabled="row.level == 1 ? true : false"
          @click="updateMenu(row)"
        >
          编辑
        </el-button>
        <el-popconfirm
          :title="`你确定要删除${row.name}?`"
          width="260px"
          @confirm="removeMenu(row.id)"
        >
          <template #reference>
            <!-- <el-button
              type="primary"
              size="small"
              :disabled="row.level == 1 ? true : false"
            > -->
            <el-button type="primary" size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框组件 用于添加菜单或功能 -->
  <el-dialog
    v-model="dialogVisible"
    :title="menuData.id ? '更新菜单' : '添加菜单'"
    @closed="handleClose"
  >
    <!-- 表单组件 -->
    <el-form>
      <el-form-item label="名称">
        <el-input
          placeholder="请你输入菜单名称"
          v-model="menuData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input
          placeholder="请你输入权限数值"
          v-model="menuData.code"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
// 引入接口
import { reqAllMenu, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu'
// 引入ts类型
import type {
  MenuList,
  MenuParams,
  MenuResponseData,
  Menu,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'
// 存储菜单的数据
let menuArr = ref<MenuList>()
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 存储菜单项携带的参数
let menuData = reactive<MenuParams>({
  id: '', //ID
  code: '', //权限数值
  level: 0, //几级菜单
  name: '', //菜单的名字
  pid: 0, //菜单的ID
})
// 组件挂载完毕
onMounted(() => {
  getHasMenu()
})
// 获取已有菜单项
const getHasMenu = async () => {
  let result: MenuResponseData = await reqAllMenu()
  if (result.code == 200) {
    menuArr.value = result.data
  }
}

// 添加菜单按钮回调
const addMenu = (row: Menu) => {
  //对话框显示出来
  dialogVisible.value = true
  // 收集数据level、pid到menuData上
  menuData.level = row.level + 1
  menuData.pid = row.id as number
}
// 编辑已有的菜单
const updateMenu = (row: Menu) => {
  //对话框显示出来
  dialogVisible.value = true
  // 将数据存到menuData中
  Object.assign(menuData, row)
}
// 对话框确定按钮的回调
const save = async () => {
  // 新增子菜单|更新某一个已有的菜单的数据
  let result: any = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    // 对话框隐藏
    dialogVisible.value = false
    // 提示信息
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功',
    })
    // 再次获取全部最新的菜单的数据
    getHasMenu()
  } else {
    ElMessage({
      type: 'success',
      message: menuData.id ? '没有权限更新失败' : '添加失败',
    })
  }
}

// 关闭对话框时回调函数 清空数据
const handleClose = () => {
  Object.assign(menuData, {
    id: 0, //ID
    code: '', //权限数值
    level: 0, //几级菜单
    name: '', //菜单的名字
    pid: 0, //菜单的ID
  })
}

// 删除按钮回调
const removeMenu = async (id: number) => {
  let result = await reqRemoveMenu(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasMenu()
  } else {
    ElMessage({ type: 'error', message: '没有权限 删除失败' })
  }
}
</script>

<style scoped lang="scss"></style>
