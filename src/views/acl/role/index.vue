<template>
  <!-- 搜索框 -->
  <el-card style="height: 80px">
    <el-form inline class="form">
      <el-form-item label="角色名称">
        <el-input
          placeholder="请您输入搜索职位关键字"
          v-model="keyword"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!keyword" @click="search">
          搜索
        </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 主体表格部分 -->
  <el-card style="margin: 10px 0px">
    <el-button type="primary" icon="plus" @click="dialogVisible = true">
      添加角色
    </el-button>
    <!-- 表格 -->
    <el-table border style="margin: 10px 0px" :data="allRole">
      <el-table-column
        align="center"
        type="index"
        label="#"
        width="80px"
      ></el-table-column>
      <el-table-column
        align="center"
        label="id"
        prop="id"
        width="100px"
      ></el-table-column>
      <el-table-column
        align="center"
        label="角色名称"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="更新时间"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <!-- 操作 -->
      <el-table-column align="center" label="操作" width="280px">
        <!-- row:已有的职位对象 -->
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setPermission(row)"
          >
            分配权限
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
          >
            编辑
          </el-button>
          <!-- 气泡确认框 -->
          <el-popconfirm
            :title="`你确定要删除${row.roleName}?`"
            width="260px"
            @confirm="removeRole(row.id)"
          >
            <!-- #reference具名插槽 触发气泡确认框的html结构 -->
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 30, 40]"
      background
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasRole"
      @size-change="sizeChange"
    />
  </el-card>
  <!-- 添加角色与更新角色 对话框 -->
  <!-- v-model绑定的变量可以控制对话框显示与隐藏 -->
  <el-dialog
    v-model="dialogVisible"
    :title="RoleParams.id ? '更新角色(职位)' : '添加角色(职位)'"
    @closed="dialogClose"
  >
    <!-- 
      因为需要做表单验证 所以使用el-form
      model属性表单数据对象 收集表单验证的每一项 搭配rules做表单验证
      rules表单规则 form-item prop属性指定验证的值 -->
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          placeholder="请你输入角色(职位)名称"
          v-model="RoleParams.roleName"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 对话框中可以定义头部、主体和底部 -->
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
  <!-- 抽屉组件：分配职位的菜单权限与按钮的权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <!-- 主体部分 -->
    <template #default>
      <!-- 树形控件 data 展示数据 props 配置，使用文档中对应自定义配置即可
        show-checkbox节点是否可被选择
        node-key 每个树节点用来作为唯一标识的属性【这里是对象id作为标识符】
        default-expand-all 是否默认展开所有节点
        default-expanded-keys	默认展开的节点的 key 的数组
        default-checked-keys 默认勾选的节点的 key 的数组 -->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <el-button @click="drawer = false">取消</el-button>
      <el-button type="primary" @click="handlerSave">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
// 接口
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
  reqRemoveRole,
} from '@/api/acl/role'
// 类型
import type {
  MenuResponseData,
  Records,
  RoleData,
  MenuList,
} from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'
// 引入settingStore小仓库，用于点击重置按钮刷新组件
import useLayoutSettingStore from '@/store/modules/setting'
let settingStore = useLayoutSettingStore()
// 搜索框关键词
let keyword = ref<string>('')
// 分页器变量
// 当前页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(10)
//职位总个数
let total = ref<number>(0)

//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)

// 存储全部已有的角色职位
let allRole = ref<Records>([])
// 定义变量 存储角色数据
let RoleParams = reactive<RoleData>({
  id: '',
  roleName: '',
})
// 拿到对话框dialog form表单 用于表单验证 点击确认按钮保证验证通过再放行
let form = ref<any>()
//获取tree组件实例
let tree = ref<any>()
// 存储勾选的节点的ID(四级的)数组
let selectArr = ref<number[]>([])
// 存储tree需要展示的用户权限数据
let menuArr = ref<MenuList>([])

// 首先仍然是获取所有已有角色
onMounted(() => {
  // 获取职位请求
  getHasRole()
})
const getHasRole = async (pager = 1) => {
  // 修改当前页码 如果没有pageNo 则使用传入的参数pager
  pageNo.value = pager
  let result = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    // 将得到的角色数据 和 总数赋给相应变量
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
// 分页器下拉菜单回调
const sizeChange = () => {
  getHasRole()
}
// 搜索按钮回调
const search = () => {
  // 用拿到的keyword再次获取职位请求
  getHasRole()
  keyword.value = ''
}
// 重置按钮
const reset = () => {
  // main组件中通过v-if控制组件销毁重新挂载 完成数据的刷新重置
  settingStore.refresh = !settingStore.refresh
}
// 添加角色职位按钮回调
/* const addRole = () => {
  // 显示对话框
  dialogVisible.value = true
} */

// 编辑角色
const updateRole = (row: RoleData) => {
  // 显示对话框
  dialogVisible.value = true
  // 存储已有的职位----带有ID的
  Object.assign(RoleParams, row)
}

// 自定义校验规则的回调
const validateRoleName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('角色(职位)名称至少两位'))
  }
}
// 对话框中表单验证
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validateRoleName }],
}

// 对话框确认按钮回调
const save = async () => {
  // 只有在通过校验规则才能点击确认按钮发起请求
  await form.value.validate()
  // 发起请求 添加职位|更新职位[有id]
  let result: any = await reqAddOrUpdateRole(RoleParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功',
    })
    //对话框显示
    dialogVisible.value = false
    // 再次获取全部的已有的职位
    getHasRole(RoleParams.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: RoleParams.id ? '更新失败' : '添加失败',
    })
  }
}
// 对话框自定义事件closed回调【Dialog 关闭动画结束时的回调】
const dialogClose = () => {
  // 关闭清空对话框中的内容
  Object.assign(RoleParams, {
    id: '',
    roleName: '',
  })
  // 清空校验错误提示
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

// 分配权限
const setPermission = async (row: RoleData) => {
  // 显示抽屉
  drawer.value = true
  // 收集当前要分类权限的职位的数据[因为每次关闭对话框的时候已经将角色职位信息清空了]
  Object.assign(RoleParams, row)
  // 拿到所有权限数据 展示在tree组件中
  let result: MenuResponseData = await reqAllMenuList(RoleParams.id as number)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectIdArr(menuArr.value, [])
  }
}

// props配置 定义树形组件测试数据【直接拷贝文档即可】
const defaultProps = {
  // children	指定子树为节点对象的某个属性值
  children: 'children',
  // label	指定节点标签为节点对象的某个属性值
  label: 'name',
}

// 过滤出id的数组
const filterSelectIdArr = (data: any, initArr: any) => {
  // forEach遍历原数组 没有返回值 不修改原始数组
  data.forEach((item: any) => {
    // 只过滤四级id即可 子组件拿到权限勾选 父组件默认勾选或未全选
    // item.level == 4是组件中不同按钮的权限 level最深为4层
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    // 如果有children且子组件不为空则进行递归
    if (item.children && item.children.length > 0) {
      // 递归拿到最深层子组件权限
      filterSelectIdArr(item.children, initArr)
    }
  })
  return initArr
}

// 点击抽屉组件确认按钮发起请求
const handlerSave = async () => {
  // 收集整理数据
  // 角色职位id
  const roleId = RoleParams.id as number
  // 选中节点的id getCheckedKeys方法	节点被选中 返回当前选中节点 key 的数组
  let checkedIdArr = tree.value.getCheckedKeys()
  // 半选中id getHalfCheckedKeys 返回当前半选中节点 key 的数组
  let halfIdArr = tree.value.getHalfCheckedKeys()
  // concat() 方法用于连接两个或多个数组。
  // concat() 方法不会更改现有数组，而是返回一个新数组，其中包含已连接数组的值。
  let permissionId = checkedIdArr.concat(halfIdArr)
  // 下发权限 将数据 提交到服务器 参数1：角色id 参数2：权限id
  let result: any = await reqSetPermission(roleId, permissionId)
  if (result.code == 200) {
    //抽屉关闭
    drawer.value = false
    //提示信息
    ElMessage({ type: 'success', message: '分配权限成功' })
    // getHasRole(RoleParams.id ? pageNo.value : 1)
    //页面刷新[如果修改自己账号权限 能够及时更新展示界面]
    window.location.reload()
  }
}

// 删除角色
const removeRole = async (id: number) => {
  let result = await reqRemoveRole(id)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '删除成功' })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
