<template>
  <div class="login_container">
    <el-row>
      <!-- xs 屏幕宽度小于768px时显示的栅格数量 -->
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登录的表单 -->
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎登录E.T.后台管理系统</h2>
          <el-form-item prop="username">
            <!-- 通过prefix-icon添加前缀图标，由于是动态的，所以需要v-bind -->
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              :show-password="true"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <!-- el-button的属性loading可以给登录按钮添加加载标识 -->
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 引入图标
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
// 使用并获取小仓库
import useUserStore from '@/store/modules/user.ts'
// 引入路由
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
// 引入获取当前时间的函数
import { getTime } from '@/utils/time'
// vue4版本引入的useRouter用于获取路由实例
let $router = useRouter()
let $route = useRoute() // 用于登录时跳转到带有query参数重定向的路由路径下
let userStore = useUserStore()
// 定义变量控制按钮加载效果
let loading = ref(false)
// 收集账号与密码的数据
let loginForm = reactive({
  username: 'admin',
  password: 'atguigu123',
})
// 获取el-form组件实例
let loginForms = ref()
// 登录按钮回调
const login = async () => {
  // 保证全部表单项校验通过再发送请求 el-form表单的validate函数用于对整个表单内容进行验证
  await loginForms.value.validate() // 通过await去等待验证完成后再执行其他提交表单的操作
  // 如果校验不通过promise状态会变成rejected 如果外部有try catch会捕获异常,没有会终止项目,后面代码不再执行

  // 加载效果
  loading.value = true
  /* 点击登录之后需要做的：
        通知pinia仓库发送登录请求：
            请求成功：跳转到首页
            请求失败：弹出登录失败信息 */
  // 这里除了使用try catch还可以使用.then方法
  try {
    // 保证登录成功
    await userStore.userLogin(loginForm)
    // 编程式导航[通过push replace go实现路由跳转]跳转到展示数据的首页
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    // 使用element plus中的ElNotification组件去提示登录成功或失败
    ElNotification({
      type: 'success',
      message: '登录成功',
      title: `Hi,${getTime()}好`,
    })
    // loading.value = false
  } catch (error) {
    // loading.value = false // 集成到finally中
    ElNotification({
      type: 'error',
      // 由于没有定义error的类型,所以使用断言确定其类型
      message: (error as Error).message,
    })
  } finally {
    loading.value = false
  }
}
// 自定义校验规则校验器方法
const validatorUserName = (_rule: any, value: any, callback: any) => {
  // rule:数组的校验规则对象 value:文本内容 callback:校验之后调用函数
  // 如果校验通过调用callback放行,如果没通过则传入callback错误信息同样调用执行
  if (value.length >= 5 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('账号长度为5~10位'))
  }
}
const validatorPassword = (_rule: any, value: any, callback: any) => {
  if (value.length >= 6 && value.length <= 16) {
    callback()
  } else {
    callback(new Error('密码长度为6~16位'))
  }
}
// 定义表单校验需要的配置对象
const rules = {
  username: [
    {
      trigger: 'change',
      validator: validatorUserName,
    },
  ],
  password: [
    {
      trigger: 'change',
      validator: validatorPassword,
    },
  ],
}
</script>

<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover; // 背景尺寸覆盖父盒子

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh; // 需要开启定位才能使用
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: aliceblue;
      font-size: 40px;
    }

    h2 {
      color: aliceblue;
      font-size: 20px;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
