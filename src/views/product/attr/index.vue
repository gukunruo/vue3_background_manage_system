<template>
  <!-- 三级分类全局组件 -->
  <Category :scene="scene"></Category>
  <el-card style="margin: 10px 0px">
    <!-- 下面两个div用于场景切换：点击添加属性切换到卡片另一个内容 -->
    <!-- 场景1 -->
    <div v-show="scene == 0">
      <!-- 通过categoryStore.c3Id是否选择了三级分类来确定按钮是否可点 -->
      <el-button
        type="primary"
        size="default"
        icon="plus"
        :disabled="categoryStore.c3Id ? false : true"
        @click="addAttr"
      >
        添加属性
      </el-button>
      <!-- el-table的data属性用于展示表格的每项数据 -->
      <el-table border style="margin: 10px 0px" :data="attrArr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <!-- el-table-column的prop用于显示对应列内容的字段名，也可用property -->
        <el-table-column
          label="属性名称"
          width="120px"
          prop="attrName"
        ></el-table-column>
        <!-- 属性值使用el-tag标签进行遍历 外部需要使用table-column中的template具名插槽进行包裹 -->
        <el-table-column label="属性值名称">
          <!-- table-column插槽需要传递数据{ row, column, $index } row：已有的属性对象  -->
          <template v-slot="{ row }">
            <el-tag
              style="margin: 5px"
              v-for="item in row.attrValueList"
              :key="item.id"
            >
              {{ item.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateAttr(row)"
            ></el-button>
            <!-- 气泡确认框 -->
            <el-popconfirm
              :title="`你确定删除${row.attrName}吗?`"
              width="200px"
              @confirm="deleteAttr(row.id)"
            >
              <!-- reference具名插槽	触发 Popconfirm 显示的 HTML 元素 -->
              <template #reference>
                <!-- 这里的row是el-table data属性绑定的attrArr中的attr -->
                <el-button
                  type="primary"
                  size="small"
                  icon="Delete"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 场景2 -->
    <div v-show="scene == 1">
      <!-- 展示添加属性与修改数据的结构 设置 inline为 true 可让表单域变为行内的表单域 -->
      <el-form :inline="true">
        <el-form-item label="属性名称">
          <el-input
            placeholder="请您输入属性的名字"
            v-model="attrParams.attrName"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        @click="addAttrValue"
        :disabled="!attrParams.attrName"
        type="primary"
        icon="plus"
      >
        添加属性值
      </el-button>
      <el-button type="default" @click="cancel">取消</el-button>
      <!-- el-table的data属性是显示的数据源，用于el-table-column每一项使用具名插槽进行遍历 -->
      <el-table
        border
        style="margin: 10px 0px"
        :data="attrParams.attrValueList"
      >
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="属性值名称">
          <!-- 具名插槽进行解构，用于展示输入框添加属性值 row：即为当前属性值对象 -->
          <template v-slot="{ row, $index }">
            <!-- :ref绑定一个函数，将el-input组件实例传入，然后将当前的input组件存入到inputArr数组中 -->
            <el-input
              :ref="(vc: any) => inputArr[$index] = vc"
              size="small"
              placeholder="请你输入属性值名称"
              v-model="row.valueName"
              v-show="row.flag"
              @blur="toLook(row, $index)"
            ></el-input>
            <!-- div和el-input都是展示数据，一个为编辑模式一个为查看模式 -->
            <div v-show="!row.flag" @click="toEdit(row, $index)">
              {{ row.valueName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="属性值操作" width="280px">
          <!-- 删除按钮 需要拿到对应数据，所以需要使用具名插槽的解构形式 -->
          <template v-slot="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click="attrParams.attrValueList.splice($index, 1)"
              @once="console.log(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        @click="save"
        :disabled="attrParams.attrValueList.length <= 0"
      >
        保存并添加
      </el-button>
      <el-button type="default" @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
// 引入组合式api中watch对三级分类id进行侦听
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
// 引入获取已有属性和属性值的api接口方法
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
// 获取category小仓库
import useCategoryStore from '@/store/modules/category.ts'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()
// 存储已有的属性与属性值
let attrArr = ref<Attr[]>([])

// 定义card组件场景内容切换变量
let scene = ref<number>(0)

// 定义收集新增的属性的数据变量去接收
let attrParams = reactive<Attr>({
  attrName: '', //新增的属性的名字
  attrValueList: [], //新增的属性值数组
  categoryId: '', //三级分类的ID
  categoryLevel: 3, //代表的是三级分类
})
// 准备一个数组：将来存储对应数组实例el-input
let inputArr = ref<any>([])

// 侦听三级分类id变化 第一个参数使用箭头函数是确保每次拿到的都是新的值
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上次查询的属性与属性值
    attrArr.value = []
    // 有c3Id才发送请求，否则不发送
    if (!categoryStore.c3Id) return
    getAttr()
  },
)

// 获取已有的属性与属性值方法
const getAttr = async () => {
  // 将三个id从仓库对象中解构出来
  const { c1Id, c2Id, c3Id } = categoryStore
  //获取分类下的已有的属性与属性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  // console.log(result)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

// 添加属性按钮回调
const addAttr = () => {
  // 每一次点击的时候,先清空一下数据再收集数据
  /* Object.assign(target, ...sources) 将一个或多个源对象的属性复制到目标对象中。
  它接受一个目标对象和一个或多个源对象作为参数，并返回目标对象。
  静态方法，不会修改任何源对象，只返回一个新的目标对象*/
  Object.assign(attrParams, {
    attrName: '', //新增的属性的名字
    attrValueList: [], //新增的属性值数组
    categoryId: categoryStore.c3Id, //三级分类的ID
    categoryLevel: 3, //代表的是三级分类
  })
  // 切换为添加与修改属性的结构 也就是切换为场景2
  scene.value = 1
}
// 修改属性按钮回调
const updateAttr = (row: AttrValue) => {
  // 切换为添加与修改属性的结构 也就是切换为场景2
  scene.value = 1
  // 将原有数据展示在场景2中，只需将我们row中的数据给attrParams即可
  // Object.assign(target, ...sources) 将一个或多个源对象的属性复制到目标对象中
  // 由于Object.assign是浅拷贝，对于属性对应的值是引用对象的，会拷贝row中的引用对象给attrParams
  // 我们需要使用深拷贝，否则修改row影响attrParams，可以用JSON.parse(JSON.stringify(row))
  Object.assign(attrParams, JSON.parse(JSON.stringify(row))) // 实现深拷贝
}

// 取消按钮的回调
const cancel = () => {
  scene.value = 0
}

// 添加属性值回调
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    // 添加flag标记 控制每一个属性值编辑模式与查看模式切换
    flag: true,
  })
  // nextTick:响应式数据发生变化,获取更新的DOM(组件实例) 更新之后再进行调用
  nextTick(() => {
    // 数组的最后一项自动获取焦点，也就是最新添加的一项获取焦点
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
// 保存属性与属性值回调
const save = async () => {
  // 在点击添加属性时获取到categoryId，然后保存时发送添加的请求
  let result = await reqAddOrUpdateAttr(attrParams)
  // console.log(result)
  if (result.code == 200) {
    // 切换为场景1
    scene.value = 0
    // 提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    //获取全部已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}

// 属性值表单元素失却焦点事件回调 编辑模式变查看模式
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况判断1：不能为空
  if (row.valueName.trim() == '') {
    // 删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  // 非法情况2：属性值不能重复
  let repeat = attrParams.attrValueList.find((item) => {
    // 要将当前的row从attrValueList这里剔除掉，
    // 因为在点击添加属性值时已经将row添加到了attrValueList中
    if (item != row) {
      // 然后比对除了row的attrValueList每一项与row的valueName进行比对 将比对结果返回出去，给repeat
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    // 将重复的属性值从数组当中干掉
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  // 相应的属性值对象flag:变为false,展示div
  row.flag = false
}
// 点击属性值表单元素回调 查看模式变编辑模式
const toEdit = (row: AttrValue, $index: number) => {
  // 相应的属性值对象flag:变为true,展示input
  row.flag = true
  // nextTick:响应式数据发生变化,获取更新的DOM(组件实例) 更新之后再进行调用
  nextTick(() => {
    // 自动获取焦点
    inputArr.value[$index].focus()
  })
}

// 删除某一个已有的属性方法回调
const deleteAttr = async (attrId: number) => {
  // 发相应的删除已有的属性的请求
  let result: any = await reqRemoveAttr(attrId)
  //删除成功
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //获取一次已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 路由组件销毁的时候清空category小仓库中分类相关的数据【这个功能可以看需求，有时候不需要进行清空】
onBeforeUnmount(() => {
  // 利用仓库的$reset方法清空仓库中所有数据
  categoryStore.$reset()
})
</script>

<style scoped lang="scss"></style>
