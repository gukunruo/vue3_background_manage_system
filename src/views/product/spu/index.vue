<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <!-- 场景1 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <!-- 展示已有SPU数据 -->
        <el-table border style="margin: 10px 0px" :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <!-- prop 对应列内容的字段名【data绑定的records中每搁对象包含的字段名】，也可用property代替 -->
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <!-- table-column中的属性show-overflow-tooltip：内容过长被隐藏时显示tooltip -->
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作">
            <!-- row：records中的每个SPU对象 -->
            <template v-slot="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="viewSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                title="删除SKU"
                @click="deleteSku(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:currentPage="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        ></el-pagination>
      </div>
      <!-- 场景2 添加SPU|修改SPU子组件 绑定自定义事件changeScene
            通过ref拿到子组件实例 -->
      <SpuForm
        ref="spu"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></SpuForm>
      <!-- 场景3 添加SKU的子组件 -->
      <SkuForm
        ref="sku"
        v-show="scene == 2"
        @changeScene="changeScene"
      ></SkuForm>
      <!-- el-dialog对话框 用于展示sku列表 -->
      <!-- model-value / v-model	用于是否显示 Dialog -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template v-slot="{ row }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>
<!-- SPU(Standard Product Unit)：标准化产品单元,商品信息聚合的最小单位
        属性值、特性相同的商品就可以称为一个SPU -->
<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu/index'
import type {
  HasSpuResponseData,
  Records,
  SkuData,
  SpuData,
  SkuInfoData,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
// 引入两个子组件
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
// 引入category小仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()
// 场景数据 0:显示已有SPU  1:添加或者修改已有SPU 2:添加SKU的结构
let scene = ref<number>(0)
// 下面为分页器数据
let pageNo = ref<number>(1) // 分页器默认页码
let pageSize = ref<number>(3) // 每一页展示几条数据
let total = ref<number>(0) // 存储已有SPU总个数
// 存储已有的Spu
let records = ref<Records>([])

// 获取子组件实例spu
let spu = ref<any>()
let sku = ref<any>()

// 存储sku数据
let skuArr = ref<SkuData[]>([])
// 控制sku列表的显示
let show = ref<boolean>(false)

// 侦听三级分类id变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 务必保证有三级id【当一二级id发生变化，三级id会被清空的清空】
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)
// 将请求封装成函数 三级分类发送变化发送一次，页码发生变化发送一次
const getHasSpu = async (pager = 1) => {
  // 修改当前页码
  pageNo.value = pager
  // 发送请求
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
//分页器下拉菜单发生变化的时候触发
const changeSize = () => {
  getHasSpu()
}

// 添加新的SPU按钮的回调
const addSpu = () => {
  // 切换为场景1：添加与修改已有SPU结构->SpuForm
  scene.value = 1
  // 点击添加SPU按钮 调用子组件中的请求函数 请求两个下拉选择框的数据
  spu.value.initAddSpu(categoryStore.c3Id)
}
// 修改已有的SPU按钮的回调
const updateSpu = (row: SpuData) => {
  // 切换为场景1：添加与修改已有SPU结构->SpuForm
  scene.value = 1
  /* 用子组件实例的方法发送请求,然后子组件拿到数据在子组件中使用
  子组件中定义好请求的方法，通过父组件去调用【父组件给子组件绑定ref，拿到子组件实例】
  然后得到的数据直接存储在子组件中，不用再经过父组件 */
  // 调用子组件实例方法 获取完整已有的SPU数据
  spu.value.initHasSpuData(row) //将已有的row,也就是spu带给子组件
}

// 子组件SpuForm绑定自定义事件:子组件通知父组件切换场景
const changeScene = (obj: any) => {
  // 从对象中解构出来flag和params
  let { flag, params } = obj
  // 子组件SpuForm点击取消变为场景1,展示已有的SPU
  scene.value = flag
  // 判断是添加还是修改spu,然后判断页码跳转到那一页
  if (params == 'update') {
    // 场景更换 更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    // 场景更换 添加spu跳转时回到第一页
    getHasSpu() // 请求新数据
  }
}

// 添加sku按钮回调
const addSku = (row: SpuData) => {
  // 点击添加SKU按钮切换场景为2
  scene.value = 2
  // 调用子组件的请求方法到添加SKU的数据[平台属性获取、销售属性获取、图片名称获取]
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 查看SKU列表的数据
const viewSku = async (row: SpuData) => {
  // 发送请求reqSkuList获取sku列表
  let result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code == 200) {
    // 将值存到skuArr数组中
    skuArr.value = result.data
    // 显示对话框
    show.value = true
  }
}

// 删除已有的SPU按钮的回调
const deleteSku = async (row: SpuData) => {
  // 发起请求
  let result = await reqRemoveSpu(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 获取剩余SPU数据 如果当前页没有数据 则pageNo当前页码减一
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
// 路由组件销毁前，清空仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped lang="scss"></style>
