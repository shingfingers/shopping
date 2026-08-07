import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
    // Gzip 压缩生产构建
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 全局注入 SCSS 变量和 mixins，无需在每个组件中手动导入
        // 注意：用函数形式排除 variables/mixins 自身，避免模块循环引用
        additionalData: (source, fp) => {
          if (fp.endsWith('variables.scss') || fp.endsWith('mixins.scss')) {
            return source
          }
          return `@use "@/assets/styles/variables.scss" as *; @use "@/assets/styles/mixins.scss" as *;\n${source}`
        },
        api: 'modern-compiler',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/user/cart': {
        target: 'http://localhost:8005',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/api/user/orders': {
        target: 'http://localhost:8006',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/api/user/address': {
        target: 'http://localhost:8006',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/api/user/payment': {
        target: 'http://localhost:8006',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/api/user/seckillGoods': {
        target: 'http://localhost:8007',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/api/user/goodsSearch': {
        target: 'http://localhost:8004',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/api/user/category': {
        target: 'http://localhost:8008',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/api/user/productType': {
        target: 'http://localhost:8008',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/api/user/brand': {
        target: 'http://localhost:8008',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/api/user/custcare': {
        target: 'http://localhost:8010',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/api/user/shoppingUser': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/api/user': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    // 生产构建优化
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'vendor': ['axios', 'dayjs', 'lodash-es'],
        },
      },
    },
    // 使用 esbuild 压缩（内置，无需额外依赖）
    minify: 'esbuild',
  },
})
