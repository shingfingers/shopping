import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3001,
    open: true,
    proxy: {
      // 管理后台接口代理到 manager-api
      '/admin': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/goods': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/brand': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/productType': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/permission': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/role': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/seckillGoods': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/specification': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/sensitiveWord': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/faq': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/file': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'vue-vendor': ['vue', 'vue-router'],
          vendor: ['axios'],
        },
      },
    },
  },
})