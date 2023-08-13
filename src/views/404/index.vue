<template>
  <div class="box">
    <div class="container">
      <img src="../../assets/images/error_images/404.png" alt="" />
      <div class="tip">
        <h2>您访问的页面不存在！</h2>
        <h4>管理员说你不能进入此页面</h4>
        <h6>请检查您的url是否正确，点击下面按钮回到首页</h6>
        <button class="btn" @click="goHome">返回到首页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
let $router = useRouter()
const goHome = () => {
  $router.push('/home')
}
</script>

<style scoped lang="scss">
.box {
  width: 100vw;
  height: 100vh;
  position: relative;
  .container {
    position: absolute;
    top: 10%;
    margin-left: 50%;
    transform: translate(-50%);
    img {
      width: 800px;
      height: 400px;
    }
    .tip {
      position: absolute;
      top: 15%;
      left: 60%;
      h2 {
        font-size: 32px;
        font-weight: bolder;
        color: dodgerblue;
        margin: 20px 0;
      }
      h4 {
        font-size: 20px;
        font-weight: bold;
        color: black;
        margin: 20px 0;
      }
      h6 {
        font-size: 14px;
        color: gray;
        margin: 20px 0;
      }
      .btn {
        width: 110px;
        height: 38px;
        background-color: dodgerblue;
        color: white;
        border: 0;
        border-radius: 20px;
      }
    }
  }
}
</style>
