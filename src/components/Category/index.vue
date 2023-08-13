<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <!-- 通过v-model将el-option收集到的c1.id回传给categoryStore.c1Id小仓库中 -->
        <el-select
          :disabled="scene ? true : false"
          v-model="categoryStore.c1Id"
          @change="handler1"
        >
          <!-- label:即为展示数据 value:即为select下拉菜单收集的数据 [用于收集id] -->
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene ? true : false"
          v-model="categoryStore.c2Id"
          @change="handler2"
        >
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene ? true : false"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<!-- 将这个组件全局注册，然后所有路由组件都可以使用这个组件 -->
<script setup lang="ts">
//引入组件挂载完毕方法
import { onMounted, defineProps } from 'vue'
// 引入category小仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()
// 分类全局组件Category挂载完毕,通知仓库发请求获取一级分类的数据
onMounted(() => {
  getC1()
})
//通知仓库获取一级分类的方法
const getC1 = () => {
  //通知分类仓库发请求获取一级分类的数据
  categoryStore.getC1()
}
//此方法即为一级分类下拉菜单的change事件(选中值改变时会触发,保证一级分类有了ID)
const handler1 = () => {
  //需要将二级、三级分类的数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  //通知仓库获取二级分类的数据
  categoryStore.getC2()
}
//此方法即为二级分类下拉菜单的change事件(选中值改变时会触发,保证二级分类有了ID)
const handler2 = () => {
  //需要将三级分类的数据清空
  categoryStore.c3Id = ''
  //通知仓库获取二级分类的数据
  categoryStore.getC3()
}

// 接收attr组件通过Category标签传来的scene
defineProps(['scene'])
</script>

<script lang="ts">
export default {
  name: 'Category',
}
</script>

<style scoped></style>
