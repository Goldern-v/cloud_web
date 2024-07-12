import path, { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import PurgeIcons from 'vite-plugin-purge-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { visualizer } from 'rollup-plugin-visualizer' // 项目打包后根目录会生成一个stats.html视图分析依赖文件
import viteCompression from 'vite-plugin-compression' // 打包压缩成gzip
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import externalGlobals from 'rollup-plugin-external-globals'
// import fs from 'fs'

const requestUrl = 'http://192.168.101.208:18884'

// 参考：https://cn.vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    // 配置别名
    alias: {
      '@': resolve(__dirname, './src'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    }
  },
  plugins: [
    vue(),
    vueSetupExtend(),
    AutoImport({
      dts: './auto-imports.d.ts',
      imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
      eslintrc: {
        enabled: false,// 默认false, true启用。生成一次就可以，避免每次工程启动都生成，一旦生成配置文件之后，最好把enable关掉，即改成false
        //否则这个文件每次会在重新加载的时候重新生成，这会导致eslint有时会找不到这个文件。当需要更新配置文件的时候，再重新打开
      }
    }),
    Components({
      dts: './components.d.ts',
      dirs: ['src/components'], // 配置需要导入的自定义组件文件夹
      types: [{
        // 全局类型注册
        from: 'vue-router',
        names: ['RouterLink', 'RouterView']
      }]
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, 'src/icons/svg')],
      symbolId: 'icon-[dir]-[name]'
    }),
    visualizer(),
    PurgeIcons(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          echartsScript:
            '<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js"></script>'
        }
      }
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/styles/international/constant.scss";' // 预处理scss
      }
    }
  },
  envDir: path.resolve(__dirname, './env'),
  build: {
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      treeshake: true, // 消除未使用的代码,减小最终包的大小
      // external: ['echarts'], // 不需要打包,都是外部依赖项
      plugins: [
        viteCompression({
          verbose: true, // 是否在控制台中输出压缩结果
          disable: false,
          threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
          algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotlicompress '，'deflate '，'deflateRaw']
          ext: '.gz',
          deleteOriginFile: true // 源文件压缩后是否删除
        }),
        // externalGlobals({
        //   // 在项目中引入的变量名称
        //   echarts: 'echarts'
        // })
      ],
      output: {
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件 字体、图片等
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      },
    },
    commonjsOptions: {
      requireReturnsDefault: 'namespace', // 要求ES模块返回其名称空
    },
    terserOptions: {
      compress: { // 生产环境移除console和debugger
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000, // 端口号
    open: false, // 是否自动打开浏览器
    proxy: {
      '/iams': {
        target: requestUrl,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/iams/, '/iams')
      },
      '/api': {
        target: requestUrl,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api')
      },
      '/adapter': {
        target: requestUrl,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/adapter/, '/adapter')
      },
      '/bill': {
        target: requestUrl,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/bill/, '/bill')
      },
      '/bpm': {
        target: requestUrl,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/bpm/, '/bpm')
      },
      '/log': {
        target: requestUrl,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/log/, '/log')
      },
      '/radar': {
        target: requestUrl,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/radar/, '/radar')
      },
      '/info': {
        target: requestUrl,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/info/, '/info')
      },
      '/images': {
        target: requestUrl,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/images/, '/images')
      }
    }
  },
})
