import { defineConfig, loadEnv } from 'vite'
// 引入svg需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vue from '@vitejs/plugin-vue'
// src别名的配置 引入nodeJs的 path模块
import path from 'path'
// 引入mock插件提供的方法
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
// 由于要配置mock 所以需要将配置改成箭头函数形式，注意搭配return返回
export default defineConfig(({ command, mode }) => {
  // 获取各种环境下的对应的变量 process.cwd()获取项目根目录index.html所在位置
  const env = loadEnv(mode, process.cwd()) // 这样就获取到了3个.env.xxx文件中的环境变量
  return {
    plugins: [
      vue(), // 启用插件@vitejs/plugin-vue
      // svg矢量图配置
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      // 配置mock
      viteMockServe({
        localEnabled: command === 'serve', // 保证开发阶段可以使用mock接口
      }),
    ],
    // 配置模块解析规则
    resolve: {
      // resolve.alias 可以实现模块别名的配置
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    // 配置scss全局变量，不配置则没办法全局使用
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
          // 一定要注意后面的";" 否则会报错
        },
      },
    },
    //代理跨域
    server: {
      // 设置服务器端口
      port: 3030,
      proxy: {
        // env是通过loadEnv获取到的环境变量
        [env.VITE_APP_BASE_API]: {
          //获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //需要代理跨域
          changeOrigin: true,
          //路径重写 因为所有接口没有api前缀，所以要将其替换成空串
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
