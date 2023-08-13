<template>
  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button type="primary" size="default" icon="Plus" @click="addTrademark">
      添加品牌
    </el-button>
    <!-- 表格组件：用于展示已有得平台数据 -->
    <!-- table表格：border属性:可以设置表格纵向是否有边框
         table-column列: label:某一个列的头部标签名 width:设置这列宽度 align:设置这一列对齐方式 -->
    <el-table style="margin: 10px 0px" border :data="trademarkArr">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <!-- table-column:默认展示数据用div -->
      <!-- tmName是trademarkArr中每个品牌对应的品牌名 -->
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <!-- 显示数据使用插槽形式 row代表arr中每一个品牌对象 -->
        <template v-slot="{ row }">
          <img
            :src="row.logoUrl"
            style="width: 100px; height: 100px"
            alt="图片加载失败"
          />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTrademark(row)"
          ></el-button>
          <!-- 气泡确认框el-popconfirm组件包裹删除按钮 confirm点击确定时触发 -->
          <el-popconfirm
            :title="`您确定要删除${row.tmName}?`"
            width="250px"
            icon="Delete"
            @confirm="removeTradeMark(row.id)"
          >
            <!-- 具名插槽 reference：触发popconfirm显示的html元素 -->
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件
                pagination
                   v-model:current-page:设置分页器当前页码
                   v-model:page-size:设置每一个展示数据条数
                   page-sizes:用于设置下拉菜单数据 可选每页几条数据
                   background:设置分页器按钮的背景颜色
                   layout:可以设置分页器六个子组件布局调整 ->箭头用于子组件顶到最右侧 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :pager-count="7"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="sizeChange"
      @current-change="getHasTrademark"
    />
  </el-card>
  <!-- 对话框组件：在添加品牌与修改已有品牌的业务时候使用结构 -->
  <!-- v-model：属性用户控制对话框的显示与隐藏的 true显示 false隐藏
      title：设置对话框左上角标题 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌 ' : '添加品牌'"
  >
    <!-- :model用于表单校验，用于指定数据收集到的地方 -->
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input
          placeholder="请您输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <!-- upload组件属性：action图片上传路径书写/api,否则代理服务器不发送这次post请求  -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽：footer对话框底部 -->
    <template #footer>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
      <el-button type="primary" size="default" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 引入upload组件需要使用的类型
import { UploadProps, ElMessage } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue'
// 引入api接口
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
// 引入ts类型
import {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from '@/api/product/trademark/type.ts'
// 当前页码
let pageNo = ref<number>(1)
// 每页显示数据个数
let limit = ref<number>(3)
// 存储请求到的已有品牌数据总数
let total = ref<number>(0)
//存储已有品牌的数据
let trademarkArr = ref<Records>([])
//控制对话框显示与隐藏 默认隐藏
let dialogFormVisible = ref<boolean>(false)

// 定义收集新增品牌数据 携带的参数
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})

//获取el-form组件实例
let formRef = ref()

// 获取已有品牌的接口封装成一个函数：任何情况下想获取品牌数据，调用此函数即可
const getHasTrademark = async (pager = 1) => {
  // 如果没有默认传入page时，将pager赋值给pageNo，将页码改为1 [分页器发送改变没有page时]
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  // console.log(result)
  if (result.code == 200) {
    //存储已有品牌总个数
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
// 组件挂载完毕发送请求
onMounted(() => {
  getHasTrademark()
})

//当下拉菜单发生变化的时触发此方法
//这个自定义事件,分页器组件会将下拉菜单选中数据返回
const sizeChange = () => {
  // pageNo.value = 1 // 当前每一页的数据量发生变化的时候，当前页码归1
  getHasTrademark()
}

//添加品牌按钮的回调
const addTrademark = () => {
  //清空收集数据
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  //对话框显示
  dialogFormVisible.value = true
  // 下面这种写法目的：第一次点击添加时可能没有el-form，因为没有数据，拿不到el-form
  // 第一种写法：ts的问号语法：可选链运算符，如果没有formRef.value则不调用clearValidate
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  // node中的 process.nextTick() 将一个回调函数推迟到下一个事件循环迭代中执行
  // 第2种写法：nextTick，使用nextTick可以获取到更新后的DOM
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
//修改已有品牌的按钮的回调
//row：row即为当前已有的品牌
const updateTrademark = (row: TradeMark) => {
  //清空校验规则错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  //对话框显示
  dialogFormVisible.value = true
  // 展示已有品牌数据
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  // trademarkParams.id = row.id // 同时需要将当前品牌id赋值给trademarkParams对象
  // 使用ES6语法合并对象的方式代替上面赋值方式【可以解决上面的bug】
  Object.assign(trademarkParams, row)
}

//对话框底部取消按钮
const cancel = () => {
  //对话框隐藏
  dialogFormVisible.value = false
}
const confirm = async () => {
  //在你发请求之前,要对于整个表单进行校验 await语句如果执行失败则后面不再执行
  //调用validate这个方法进行全部表单相校验,如果校验全部通过，在执行后面的语法
  await formRef.value.validate() // validate可以对整个表单内容进行验证 接收一个回调函数或者返回promise
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  //添加|修改已有品牌 [提示是否添加成功]
  if (result.code == 200) {
    // 关闭对话框
    dialogFormVisible.value = false
    // 弹出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    // 再次发请求获取已有全部的品牌数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    // 添加品牌失败
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
    //关闭对话框
    dialogFormVisible.value = false
  }
}

//上传图片组件->上传图片之前触发的钩子函数 rawFile为上传的文件对象
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //钩子是在图片上传成功之前触发,上传文件之前可以约束文件类型与大小
  //要求:上传文件格式png|jpg|gif 4M【不约束则可以上传所有类型文件】
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true // 返回true可以上传 false则停止上传
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必PNG|JPG|GIF',
    })
    return false
  }
}
//图片上传成功钩子 response：即为当前这次上传图片post请求服务器返回的数据
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  //收集上传图片的地址,添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  //图片上传成功,清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}

//品牌自定义校验规则方法 rule相应规则对象 value文本框内容 callback放行函数
const validatorTmName = (_rule: any, value: any, callBack: any) => {
  //是当表单元素触发blur时候,会触发此方法
  //自定义校验规则
  if (value.trim().length >= 2) {
    callBack()
  } else {
    //校验未通过返回的错误的提示信息
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}
//品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (_rule: any, value: any, callBack: any) => {
  //如果图片上传
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片务必上传'))
  }
}

// 表单校验规则对象
const rules = {
  tmName: [
    // required:这个字段务必校验,表单项前面出来五角星
    // trigger:代表触发校验规则时机[blur、change]
    // validator中文校验器
    { required: true, trigger: 'blur', validator: validatorTmName },
  ],
  // 上传文件时没有触发校验的时机，所以不用写trigger
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}

// 气泡确认框确定按钮的回调
const removeTradeMark = async (id: number) => {
  //点击确定按钮删除已有品牌请求
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    //删除成功提示信息
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    // 再次获取已有的品牌数据
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
/* el-dialog样式 */
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
