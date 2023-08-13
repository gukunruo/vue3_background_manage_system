<template>
  <!-- form组件 label-width设置每个form-item前面label的宽度 -->
  <el-form label-width="100px">
    <!-- SPU名称 -->
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请你输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <!-- SPU品牌 -->
    <el-form-item label="SPU品牌">
      <!-- el-option搭配父元素el-select的value,让对应的品牌展示出来 -->
      <el-select v-model="SpuParams.tmId">
        <!-- 遍历allTradeMark展示所有品牌 -->
        <el-option
          v-for="item in allTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <!-- SPU描述 -->
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请你输入SPU描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <!-- SPU图片 -->
    <el-form-item label="SPU图片">
      <!-- upload上传组件:
              [v-model:]fileList->展示默认图片
              action:上传图片的接口地址
              list-type:文件列表的类型
              设置照片墙样式 list-type="picture-card"
                
              :on-preview 点击文件列表中已上传的文件时的钩子 用于预览图片等
              :on-remove 文件列表移除文件时的钩子
              :before-upload 上传文件之前的钩子，参数为上传的文件， 
                    若返回false或者返回 Promise 且被 reject，则停止上传。 -->
      <el-upload
        v-model:file-List="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <!-- 点击放大查看图片对话框 -->
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <!-- SPU销售属性 -->
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        v-model="saleAttrIdAndName"
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : '无'
        "
      >
        <!-- 遍历未选择的属性 -->
        <el-option
          :value="`${item.id}:${item.name}`"
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <!-- 添加销售属性按钮 -->
      <el-button
        @click="addSaleAttr"
        :disabled="saleAttrIdAndName ? false : true"
        type="primary"
        icon="plus"
        size="default"
        style="margin-left: 10px"
      >
        添加销售属性
      </el-button>
      <!-- table展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="属性名"
          width="100px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="属性值">
          <!-- row:即为当前SPU已有的销售属性对象 -->
          <template v-slot="{ row }">
            <el-tag
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              style="margin: 0px 5px"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="item.id"
              class="mx-1"
              closable
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <!-- button和input二者只显示一个 通过属性对象中flag去控制 -->
            <el-input
              @blur="toLook(row)"
              v-if="row.flag"
              v-model="row.saleAttrValue"
              placeholder="请你输入属性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button
              @click="toEdit(row)"
              v-else
              type="primary"
              size="small"
              icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="{ row, $index }">
            <!-- 删除掉当前的属性 -->
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
              @once="console.log(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- 底部按钮 保存和取消 -->
    <el-form-item>
      <!-- 如果没有销售属性则禁用保存按钮 防止发送没有属性的spu请求 -->
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        type="primary"
        size="default"
        @click="save"
      >
        保存
      </el-button>
      <el-button type="default" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  SaleAttrValue,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
  SpuData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
} from '@/api/product/spu/type'
// 引入api发送获取spu数据的请求
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
let $emit = defineEmits(['changeScene']) // defineProps是Vue3提供方法,不需要引入直接使用
const cancel = () => {
  // 触发defineEmits传来的自定义事件changeScene
  $emit('changeScene', {
    flag: 0,
    params: 'update',
  })
}
// 存储已有的SPU这些数据
let allTradeMark = ref<Trademark[]>([])
// 商品图片
let imgList = ref<SpuImg[]>([])
// 已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
// 全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 存储预览图片地址 用于点击预览框时展示图片
let dialogImageUrl = ref<string>('')

// 存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '', //收集三级分类的ID
  spuName: '', //SPU的名字
  description: '', //SPU的描述
  tmId: '', //品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
})
// 存储新增销售属性的ID与属性的名字
let saleAttrIdAndName = ref<string>('')

// 子组件中定义请求数据方法,用于父组件调用去获取spu数据
const initHasSpuData = async (spu: SpuData) => {
  // 存储已有的SPU对象,将来在模板中展示 这样赋值SpuParams拿到的是spu的引用对象
  // 修改SpuParams的值会同时修改spu的值 因为SpuParams是通过ref函数创建的响应式对象，它们引用的是同一个内存地址，所以对SpuParams的修改会直接反映到spu上
  SpuParams.value = spu
  // 传来的spu:为父组件传递过来的已有的[不完整]SPU对象
  //获取全部品牌的数据
  let result1: AllTradeMark = await reqAllTradeMark()
  //获取某一个品牌旗下全部售卖商品的图片
  let result2: SpuHasImg = await reqSpuImageList(spu.id as number)
  //获取已有的SPU销售属性的数据
  let result3: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  //获取整个项目全部SPU的销售属性
  let result4: HasSaleAttrResponseData = await reqAllSaleAttr()
  // 存储全部品牌的数据
  allTradeMark.value = result1.data
  // 存储SPU对应商品图片 map方法用于遍历数组中每个元素 会返回一个新数组,不会修改原有数组
  imgList.value = result2.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  // 存储已有的SPU的销售属性
  saleAttr.value = result3.data
  // 存储全部的销售属性
  allSaleAttr.value = result4.data
}
// 照片墙点击预览按钮的时候触发的钩子 file为点击的文件
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  // 对话框弹出来
  dialogVisible.value = true
}
// 照片墙删除文件钩子
const handleRemove = () => {
  // 一般会用于在删除时发送请求收集数据,但是我们在标签中已经通过v-model收集好数据了 不用再发送请求
}
// 照片上传成功之前的钩子约束文件的大小与类型 file为上传的文件
const handlerUpload = (file: any) => {
  if (
    file.type == 'image/png' ||
    file.type == 'image/jpeg' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件务必小于3M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件务必PNG|JPG|GIF',
    })
    return false
  }
}

// 计算当前spu未拥有的spu
let unSelectSaleAttr = computed(() => {
  // 全部销售属性: 颜色、版本、尺码 - 已有的销售属性: 颜色、版本
  // filter过滤得到的是符合条件的Attr属性
  let unSelectAttr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectAttr
})

// 添加销售属性的方法
const addSaleAttr = () => {
  /* 销售属性必须包含的三个属性
    "baseSaleAttrId": number,
    "saleAttrName": string,
    "spuSaleAttrValueList": SpuSaleAttrValueList  */
  // 拆分id和name
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndName.value.split(':')
  // 准备一个新的销售属性对象:将来带给服务器即可
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 追加到数组
  saleAttr.value.push(newSaleAttr)
  // 清空收集的数据 [清空之后会通过computed重新计算unSelectSaleAttr]
  saleAttrIdAndName.value = ''
}

// 属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
  // 点击按钮的时候,input组件不就不出来->编辑模式
  row.flag = true
  // 转换为编辑模式的时候添加一个字段收集属性值
  row.saleAttrValue = ''
}
// 表单元素失却焦点的事件回调
const toLook = (row: SaleAttr) => {
  // 解构出属性的id和属性值name
  const { baseSaleAttrId, saleAttrValue } = row
  // 整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  //非法情况判断
  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空的',
    })
    return
  }
  // 判断属性值是否在数组当中存在
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复',
    })
    return
  }
  // saleAttr销售属性身上追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 切换为查看模式
  row.flag = false
}

// 保存按钮的回调 发送请求保存数据到服务器
const save = async () => {
  // 首先去整理上面收集到的零散的数据 然后发送请求 添加SPU|更新已有的SPU
  // 将数据整理到SpuParams.value上 此前已经将row-不完整的spu数据赋值给了SpuParams.value
  // 整理步骤1 照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    // 之前在标签中展示数据时将imgName和imgUrl通过map改为name\url,这里再成服务器需要的字段名
    return {
      imgName: item.name,
      // 已有的图片通过item.url即可 新增的图片需要通过item.response.data去拿到url
      imgUrl: item.url || (item.response && item.response.data),
    }
  })
  // 整理步骤2 整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value
  // 整理步骤3 清除掉spu的id,否则在添加spu时由于没有清spu的id,添加时会覆盖掉该id的spu
  SpuParams.value.id = null
  // 发送请求将SpuParams.value保存到服务器
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  // 反馈
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    })
    // 通知父组件场景切换为0
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败',
    })
  }
}

// SPU初始化请求方法[添加一个新的spu时需要调用的函数]
const initAddSpu = async (c3Id: number | string) => {
  // 首先需要清空可能存在的数据[可能是之前添加或修改的数据]
  Object.assign(SpuParams.value, {
    category3Id: '', //收集三级分类的ID
    spuName: '', //SPU的名字
    description: '', //SPU的描述
    tmId: '', //品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  })
  // 清空照片
  imgList.value = []
  // 清空销售属性
  saleAttr.value = []
  // 清除销售属性下拉菜单拿到的销售属性id和name拼接的字段
  saleAttrIdAndName.value = ''
  // 存储三级分类id
  SpuParams.value.category3Id = c3Id
  // 获取全部品牌数据 和 所有销售属性数据
  let result1: AllTradeMark = await reqAllTradeMark()
  let result2: HasSaleAttrResponseData = await reqAllSaleAttr()
  // 然后将这两个数据存储到对应的字段中
  allTradeMark.value = result1.data
  allSaleAttr.value = result2.data
}

// setup语法糖中默认是没有将数据和方法暴露出去的
// 需要通过defineExpose将方法和数据对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped></style>
