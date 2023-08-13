<template>
  <el-form label-width="100px">
    <!-- SKU名称 -->
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <!-- 价格(元) -->
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <!-- 重量(g) -->
    <el-form-item label="重量(g)">
      <el-input
        placeholder="重量(克)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <!-- SKU描述 -->
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <!-- 平台属性 -->
    <el-form-item label="平台属性">
      <!-- inline 行内表单模式 -->
      <el-form inline>
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <!-- v-bind:value拿到el-option对应的属性id和属性值id
                然后在el-select中通过attrIdAndValueId变量收集到属性attr身上 -->
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <!-- 销售属性 -->
    <el-form-item label="销售属性">
      <el-form inline>
        <!-- 遍历属性 -->
        <el-form-item
          v-for="item in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleIdAndValueId">
            <!-- 遍历属性值 -->
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <!-- 图片名称 -->
    <el-form-item label="图片名称">
      <!-- 通过ref=table来拿到el-table组件的数据 -->
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <!-- 使用作用域插槽 将子组件中的数据传给父组件去使用，父组件需要使用template标签去使用 -->
          <template v-slot="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <!-- prop或者property来源于data中的数据 -->
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <!-- 点击设为默认按钮时 将图片数据收集起来 -->
            <el-button type="primary" size="small" @click="handler(row)">
              设为默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- 底部按钮 -->
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
// 引入请求接口 获取所有属性、所有销售属性、所有属性对应图片
import { reqAttr } from '@/api/product/attr'
import {
  reqSpuHasSaleAttr,
  reqSpuImageList,
  reqAddSku,
} from '@/api/product/spu'
// 引入type类型
import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

// 拿到自定义事件的方法
let $emit = defineEmits(['changeScene'])
// 取消按钮回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' }) // params为空即可 sku中用不到了
}

// 定义三个数组接收三个请求initSkuData拿来的数据
// 平台属性
let attrArr = ref<any>([])
//销售属性
let saleArr = ref<any>([])
//照片的数据
let imgArr = ref<any>([])

// 拿到el-table组件实例
let table = ref<any>()

// 收集sku参数【根据api接口需要的数据去编写】
let skuParams = reactive<SkuData>({
  //父组件传递过来的数据
  category3Id: '', //三级分类的ID
  spuId: '', //已有的SPU的ID
  tmId: '', //SPU品牌的ID
  // v-model收集的表单的数据
  skuName: '', //sku名字
  price: '', //sku价格
  weight: '', //sku重量
  skuDesc: '', //sku的描述
  // 三个请求得到的数据
  skuAttrValueList: [
    //平台属性的收集 只需要收集到属性attrId和属性值valueId
  ],
  skuSaleAttrValueList: [
    //销售属性 同样只需要收集到销售属性saleAttrId和销售属性值saleAttrValueId
  ],
  skuDefaultImg: '', //sku图片地址
})

// 请求平台属性获取、销售属性获取、图片名称获取数据，将方法对外暴露，供父组件调用
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any, // 因为我们不仅要使用c3Id还需要拿到spu的id，所以直接传来spu对象
) => {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  // reqAttr需要传递三个参数，c1Id、c2Id、c3Id[可以从spu对象中获取]
  let result1 = await reqAttr(c1Id, c2Id, spu.category3Id)
  let result2 = await reqSpuHasSaleAttr(spu.id) // 通过spu的id去拿到所有销售属性
  let result3 = await reqSpuImageList(spu.id)
  // 平台属性
  attrArr.value = result1.data
  //销售属性
  saleArr.value = result2.data
  //图片
  imgArr.value = result3.data
}
// 子组件方法对外暴露，让父组件拿到
defineExpose({ initSkuData })

// 设置默认图片的方法回调 row对象为图片对象
const handler = (row: any) => {
  // 点击时，全部图片复选框不勾选
  imgArr.value.forEach((item: any) => {
    // el-table方法toggleRowSelection 用于多选表格，切换某一行的选中状态
    // 如果使用了第二个参数，则可直接设置这一行选中与否【参数1为row】
    table.value.toggleRowSelection(item, false)
  })
  // 选中的图片勾选
  table.value.toggleRowSelection(row, true)
  // 收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}

// save保存按钮的方法
const save = async () => {
  // 整理数据
  // 平台属性 由于我们收集到的数据是两个id拼起来的字段 attrIdAndValueId，
  // 所以我们要将二者分开，然后变为对象形式存到数组中
  skuParams.skuAttrValueList = attrArr.value.reduce(
    // 使用数组api —— reduce累加器去处理
    // prev：初始值，空数组【然后将拿到的属性进行处理，放到初始值[]中，处理完最后返回即可】
    // next：数组中正在处理的元素 拿到的属性
    (prev: any, next: any) => {
      // 如果属性有这个字段
      if (next.attrIdAndValueId) {
        let [attrId, valueId] = next.attrIdAndValueId.split(':')
        prev.push({
          attrId,
          valueId,
        })
      }
      return prev
    },
    [], // 初始值[如果没有初始值，数组的第0个元素会作为初始值，然后reducer会从第1个元素执行]
  )
  // 销售属性 同上，我们得到的字段为 saleIdAndValueId 需要拆分存入数组
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleAttrIdAndName) {
        let [saleAttrId, saleAttrValueId] = next.saleAttrIdAndName.split(':')
        prev.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return prev
    },
    [], // 初始值
  )
  // 添加SKU的请求
  let result: any = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功',
    })
    //通知父组件切换场景为零
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败',
    })
  }
}
</script>

<style scoped></style>
