<template>
  <el-card>
    <el-table border style="margin: 10px 0px" :data="skuArr">
      <!-- 序号 -->
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="60px"
      ></el-table-column>
      <!-- 名称
        show-overflow-tooltip 是否隐藏额外内容并在单元格悬停时使用 Tooltip 显示它们。
        prop或者property来源于data中的数据 用于展示字段对应值 -->
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <!-- 描述 -->
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <!-- 图片 -->
      <el-table-column label="图片">
        <template v-slot="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <!-- 重量 -->
      <el-table-column label="重量" prop="weight"></el-table-column>
      <!-- 价格 -->
      <el-table-column label="价格" prop="price"></el-table-column>
      <!-- 操作 fixed将当前列固定在左侧或右侧 可选 true/right/left -->
      <el-table-column label="操作" width="205px" fixed="right">
        <template v-slot="{ row }">
          <el-button
            :type="row.isSale == 1 ? 'info' : 'success'"
            size="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            :title="row.isSale == 1 ? '下架商品' : '上架商品'"
            @click="updateSale(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            title="编辑商品"
            @click="updateSku"
          ></el-button>
          <!-- 商品详情按钮控制抽屉组件显示隐藏 -->
          <el-button
            type="info"
            size="small"
            icon="InfoFilled"
            title="商品详情"
            @click="showSku(row)"
          ></el-button>
          <!-- 气泡确认框 自带的事件confirm 点击确认按钮触发 -->
          <el-popconfirm
            width="200px"
            :title="`你确定要删除${row.skuName}?`"
            @confirm="removeSku(row.id)"
          >
            <!-- reference 触发 Popconfirm 显示的 HTML 元素 -->
            <template #reference>
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                title="删除商品"
              ></el-button>
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
      @current-change="getHasSku"
      @size-change="handler"
    />
    <!-- 抽屉组件：展示商品详情
      model-value / v-model控制抽屉显示与隐藏
      direction 控制Drawer 打开的方向 默认为rtl(right to left) 默认就是我们想要的样子
        -->
    <el-drawer v-model="drawer">
      <!-- 标题部分 -->
      <template #header>
        <h4>查看商品的详情</h4>
      </template>
      <!-- 主体部分 -->
      <template #default>
        <!-- 使用layout布局【分为24块，通过span去分每一块占的大小】中的基础网格布局 el-row为行 el-col为列 -->
        <el-row style="margin: 10px 0px">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <!-- tag标签 -->
            <el-tag
              style="margin: 5px"
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px"
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <!-- 走马灯组件 展示图片 -->
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img :src="item.imgUrl" style="width: 100%; height: 100%" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>
<!-- SKU（Stock Keeping Unit），最小库存单元 -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 请求
import {
  reqSkuList,
  reqCancelSale,
  reqSaleSku,
  reqSkuInfo,
  reqRemoveSku,
} from '@/api/product/sku'
// ts类型
import type {
  SkuData,
  SkuResponseData,
  SkuInfoData,
} from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
// 分页器数据
// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(5)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])

// 定义抽屉组件的数据
// 控制抽屉是否显示
let drawer = ref<boolean>(false)
// 用于存储在抽屉组件中需要展示的数据【数据来源于请求api】
let skuInfo = ref<any>({})

// 组件挂载完毕调用获取已有的sku
onMounted(() => {
  getHasSku()
})
// 获取已有的sku
const getHasSku = async (pager = 1) => {
  // 当前分页器的页码 如果没传入pageNo，则页码跳转到第一页
  pageNo.value = pager
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
// 分页器下拉菜单发生变化触发
const handler = () => {
  // 重新获取当前分页器情况下sku
  getHasSku()
}

// 商品的上架与下架的操作
const updateSale = async (row: SkuData) => {
  // 判断row.isSale为上架状态[1]还是下架状态[0]
  if (row.isSale == 1) {
    // 下架操作
    await reqCancelSale(row.id as number)
    // 提示信息
    ElMessage({ type: 'success', message: '下架成功' })
    // 发起请求获取当前更新完毕的全部已有的SKU
    getHasSku(pageNo.value)
  } else {
    //下架操作
    await reqSaleSku(row.id as number)
    //提示信息
    ElMessage({ type: 'success', message: '上架成功' })
    //发请求获取当前更新完毕的全部已有的SKU
    getHasSku(pageNo.value)
  }
}
// 更新已有的SKU
const updateSku = () => {
  ElMessage({ type: 'success', message: '程序员在努力的更新中....' })
}

// 查看商品详情按钮回调
const showSku = async (row: SkuData) => {
  // 展示抽屉
  drawer.value = true
  // 获取已有商品详情数据
  let result: SkuInfoData = await reqSkuInfo(row.id as number)
  // 存储已有的SKU
  skuInfo.value = result.data
}
// 删除某一个已有的商品 接收的是row.id 也就是sku的id
const removeSku = async (id: number) => {
  let result: any = await reqRemoveSku(id)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '删除成功' })
    //获取已有全部商品 如果删除之后当前页没有数据了，就将页码减一然后获取已有sku
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    //删除失败
    ElMessage({ type: 'error', message: '系统数据不能删除' })
  }
}
</script>

<style scoped lang="scss">
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
