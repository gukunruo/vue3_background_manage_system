<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar" />
      <div class="bottom">
        <h1 class="title">{{ getTime() }}好! {{ userStore.username }}</h1>
        <p class="subtitle">{{ setting.title }}</p>
      </div>
    </div>
  </el-card>
  <div class="bottomImg">
    <!-- 使用之前封装的SvgIcon组件【已经全局引入了】 -->
    <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
    <!-- <SvgIcon name="welcome" width="600px" height="300px"></SvgIcon> -->
  </div>
</template>

<script setup lang="ts">
// 获取时间
import { getTime } from '@/utils/time'
// 获取user.ts小仓库 展示用户名
import useUserStore from '@/store/modules/user.ts'
let userStore = useUserStore()
// 获取平台名称的配置文件
import setting from '@/setting'
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom {
    margin-left: 20px;
    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
    }
    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}
.bottomImg {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
