<template>
  <!-- 顶部搜索框 -->
  <el-card style="height: 80px">
    <!-- 表单组件 -->
    <el-form inline class="form">
      <el-form-item label="用户名：">
        <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!keyword" @click="search">
          搜索
        </el-button>
        <el-button type="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 用户管理主体table -->
  <el-card style="margin: 10px 0px">
    <el-button type="primary" @click="addUser" v-has="`btn.User.add`">
      添加用户
    </el-button>
    <el-button
      type="danger"
      :disabled="selectIdArr.length ? false : true"
      @click="deleteMoreUser"
    >
      批量删除
    </el-button>
    <!-- table展示用户信息 -->
    <!-- el-table的selection-change自定义事件 当选择项发生变化时会触发该事件 -->
    <el-table
      border
      style="margin: 10px 0px"
      :data="userArr"
      @selection-change="selectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="50px"
      ></el-table-column>
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <!-- 从id开始展示userArr数据 -->
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <!-- show-overflow-tooltip可以在文本太多时显示一部分，鼠标移入可以查看具体信息 -->
      <el-table-column
        align="center"
        label="用户姓名"
        prop="username"
      ></el-table-column>
      <el-table-column
        label="用户昵称"
        align="center"
        prop="name"
      ></el-table-column>
      <el-table-column
        align="center"
        label="用户角色"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        align="center"
        label="更新时间"
        prop="updateTime"
      ></el-table-column>
      <!-- 操作 -->
      <el-table-column align="center" label="操作" width="300px">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setRole(row)"
          >
            分配角色
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
          <!-- 删除按钮使用气泡确认框 -->
          <el-popconfirm
            width="260px"
            :title="`你确定要删除${row.username}?`"
            @confirm="deleteUser(row.id)"
          >
            <!-- #reference具名插槽 用于展示触发气泡确认框的html结构 -->
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
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasUser"
      @size-change="handler"
    />
  </el-card>
  <!-- 抽屉结构1：完成添加新的用户账号|更新已有的账号信息 -->
  <!-- 
      v-model / model-value控制显示与隐藏 对于打开方向默认为rtl
      close	Drawer 关闭的回调 这里使用close和closed效果一致
      closed	Drawer 关闭动画结束时的回调 -->
  <el-drawer v-model="drawer1" @closed="handleClose">
    <!-- 通过id来控制是添加还是修改 -->
    <!-- 头部标题：将来文字内容应该动态的 -->
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <!-- 身体部分 -->
    <template #default>
      <!-- model用于表单验证时告诉表单数据收集到哪 rules表单验证规则 -->
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <!-- form表单中的prop是为了设置为需要验证的特殊键值，搭配rules完成表单检验的【不同于table中的prop】 -->
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请您输入用户姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请您输入用户昵称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <!-- 通过id来控制是添加[需要密码]还是修改[不用密码] -->
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="请您输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <!-- 底部 -->
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-drawer>
  <!-- 抽屉结构2：用户某一个已有的账号进行职位分配 -->
  <el-drawer v-model="drawer2">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <!-- 主体部分 -->
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <!-- 禁用输入框 只是为了显示用户名username -->
          <el-input disabled v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <!-- 多选框-全选 -->
          <!-- indeterminate 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果 -->
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <!-- 显示职位的的多选框-复选 -->
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedRolesChange"
          >
            <!-- label是el-checkbox-group需要收集的数据，最后收集到userRole上 -->
            <el-checkbox
              v-for="(role, index) in allRole"
              :key="index"
              :label="role"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <!-- 底部取消确认按钮 -->
    <template #footer>
      <el-button @click="drawer2 = false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
// 引入setting小仓库 用于点击重置按钮刷新
import useLayOutSettingStore from '@/store/modules/setting'
import { ref, onMounted, reactive, nextTick } from 'vue'
// 引入api接口
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user'
// 引入ts类型
import type {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
// 分页器数据
// 默认页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(5)
// 用户总个数
let total = ref<number>(0)

// 存储全部用户信息数组
let userArr = ref<Records>([])
// 获取用户信息时需要传入第三个参数，用于搜索关键词对应的用户[收集用户输入进来的关键字]
let keyword = ref<string>('')
// 抽屉容器
// 定义响应式数据控制抽屉的显示与隐藏
let drawer1 = ref<boolean>(false) // 控制添加或更新用户账号信息 抽屉1
let drawer2 = ref<boolean>(false) // 控制分配角色抽屉 抽屉2

// 获取抽屉1表单组件实例
let formRef = ref<any>()

// 抽屉2变量
// 存储全部职位的数据 抽屉2
let allRole = ref<AllRole>([])
// 当前用户已有的职位 抽屉2
let userRole = ref<AllRole>([])
// 收集顶部复选框全选数据 抽屉2
const checkAll = ref<boolean>(false)
// 控制顶部全选复选框不确定的样式【未全部选中时的选择样式】 抽屉2
const isIndeterminate = ref<boolean>(true)

// 批量删除时 存储勾选的用户数组对象
let selectIdArr = ref<User[]>([])

//获取模板setting仓库
let settingStore = useLayOutSettingStore()

// 收集用户信息的响应式数据
let userParams = reactive<User>({
  id: '',
  // 这里没有定义id 是按照新增来设计的，但是作为请求的数据，之后会往里添加id
  username: '',
  name: '',
  password: '',
})

// 分页器方法
//组件挂载完毕
onMounted(() => {
  getHasUser()
})
// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  // 收集当前页码
  pageNo.value = pager
  // 发起请求获取全部已有用户信息 reqUserInfo有三个参数，只给前两个参数不能正确发送请求
  let result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value, // 搜索关键词
  )
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
const handler = () => {
  getHasUser()
}

// 添加用户按钮的回调 弹出抽屉
const addUser = () => {
  // 抽屉1显示出来
  drawer1.value = true
  // 点击添加用户按钮之前清空之前抽屉1的数据
  /* Object.assign(userParams, {
    id: '',
    username: '',
    name: '',
    password: '',
  }) */
  // 清除上一次的表单校验错误的提示信息
  // 使用nextTick[因为页面挂载的时候第一次点击添加用户时form还没有产生]获取更新后的dom
  /* nextTick(() => {
    // clearValidate专门用来清除校验错误信息
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  }) */
  // 除了使用上面的方法，还可以使用“?”
  // formRef.value?.clearValidate('username')
}
// 更新已有的用户按钮的回调 row:即为已有用户的账号信息
const updateUser = (row: User) => {
  // 抽屉1显示出来
  drawer1.value = true
  // 将已有的信息更新到userParams上
  Object.assign(userParams, row)
  // 将清除上一次的错误的提示信息操作放到close[d]自定义事件方法中
}
// 抽屉1取消按钮的回调
const cancel = () => {
  // 关闭抽屉1
  drawer1.value = false
}
// 抽屉1保存按钮的回调
const save = async () => {
  // 点击保存按钮的时候,务必需要保证表单全部复合条件再去发请求
  // validate对整个表单的内容进行验证。 接收一个回调函数，或返回 Promise
  await formRef.value.validate() // 如果promise为reject 则不执行后面内容
  // 保存按钮:添加新的用户|更新已有的用户账号信息
  let result: any = await reqAddOrUpdateUser(userParams)
  // 关闭抽屉
  drawer1.value = false
  // 如果更新成功
  if (result.code == 200) {
    //提示消息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    // 获取最新的全部账号的信息
    getHasUser(userParams.id ? pageNo.value : 1)
    // 浏览器自动刷新一次[也会重新获取数据，同时能够在修改自己账号信息时同样进行刷新获取数据]
    // window.location.reload() // 体验太差
    // 如果修改自己登录账号的信息，可以进行提示，如果都强制刷新体验很差
    // 可以用user小仓库存的当前用户名和修改row的用户名进行比对，针对不同情况执行不同操作
  } else {
    //提示消息
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}

// 抽屉1关闭前的回调 close
const handleClose = () => {
  // console.log('close')
  // clearValidate专门用来清除校验错误信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
  // 关闭之前清空表单数据
  Object.assign(userParams, {
    id: '',
    username: '',
    name: '',
    password: '',
  })
  // 关闭抽屉1
  drawer1.value = false
}

// 定义校验器函数
// 校验用户名字回调函数
const validateUsername = (_rule: any, value: any, callback: any) => {
  // rule:数组的校验规则对象 value:文本内容 callback:校验之后调用函数
  // 如果校验通过调用callback放行,如果没通过则传入callback错误信息同样调用执行
  // 用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callback() // 放行
  } else {
    callback(new Error('用户昵称至少五位'))
  }
}
//校验用户名字回调函数
const validatename = (_rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
// 校验密码
const validatePassword = (_rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
// 自定义表单校验规则【一定要放在校验器后面，否则会报错】
const rules = {
  // 用户名字 validator校验器 trigger可选blur和change
  // 此处不要用change，因为我们清空操作是在点击添加时清空的，这样会导致一打开抽屉1就会提示
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  // 用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatename }],
  // 用户的密码
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
}

// 抽屉2相关的方法
// 分配用户角色按钮回调
const setRole = async (row: User) => {
  // 存储已有的用户信息 拿到信息用于权限添加
  Object.assign(userParams, row)
  // 获取全部的职位的数据 与 当前用户已有的职位的数据
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code == 200) {
    // 存储全部职位
    allRole.value = result.data.allRolesList
    // 存储当前已有职位
    userRole.value = result.data.assignRoles
    // 判断是否显示未全选的样式
    if (
      allRole.value.length !== userRole.value.length &&
      userRole.value.length > 0
    ) {
      isIndeterminate.value = true
    } else {
      isIndeterminate.value = false
    }
    //抽屉显示出来
    drawer2.value = true
  } else {
    ElMessage({
      type: 'error',
      message: '获取不到数据，请检查您的网络或稍后再试',
    })
  }
}
// 全选复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  // 全选功能
  userRole.value = val ? allRole.value : []
  // 关闭未全选的样式
  isIndeterminate.value = false
}
// 下面复选框change事件 string[]为勾选的项目name的数组
// 选择完则顶部全选 全未选则顶部未选 未全选则显示未全选样式isIndeterminate
const handleCheckedRolesChange = (val: string[]) => {
  // 收集复选框选择的数量
  const checkedCount = val.length
  // 勾选上的项目个数与全部的职位个数相等，顶部的复选框勾选上
  checkAll.value = checkedCount === allRole.value.length
  // 未全选中时样式 通过是否全选和全未选 或 未全选 决定
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}

// 确定按钮的回调(分配角色职位)
const confirm = async () => {
  // 收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    // 遍历已有用户角色数组，拿出每一个对象中的id作为值返回出来 形成一个id的数组
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  // 发请求分配角色
  let result = await reqSetUserRole(data)
  if (result.code == 200) {
    // 提示信息
    ElMessage({ type: 'success', message: '分配职务成功' })
    // 关闭抽屉2
    drawer2.value = false
    // 重新获取更新完毕后的用户信息，更新完毕留在当前页
    getHasUser(pageNo.value)
  }
}

// 删除某个用户
const deleteUser = async (userId: number) => {
  let result = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    // 重新获取
    getHasUser(userArr.value.length > 0 ? pageNo.value : pageNo.value - 1)
  }
}

// table自定义事件 复选框勾选时触发 会自动注入勾选的用户数据数组对象
const selectionChange = (val: any) => {
  // 用变量selectIdArr接收传来的勾选的用户数据数组对象
  selectIdArr.value = val
}
// 删除多选的用户
const deleteMoreUser = async () => {
  // 收集数据
  let idList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  let result: any = await reqSelectUser(idList)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    // 重新获取
    getHasUser(userArr.value.length > 0 ? pageNo.value : pageNo.value - 1)
  }
}

// 搜索按钮的回调
const search = () => {
  // 根据关键字获取相应的用户数据
  getHasUser()
  //清空关键字
  keyword.value = ''
}
// 重置按钮回调
const reset = () => {
  // 刷新
  settingStore.refresh = !settingStore.refresh // 仓库中的refresh为false
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  // align-items: center;
}
</style>
