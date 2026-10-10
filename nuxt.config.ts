import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  // Nuxt 4 显式将 app/ 设为源码目录（app.vue / pages / components 等都在 app/ 下）
  srcDir: 'app',
  devtools: { enabled: true },
  modules: ['@nuxt/content'],
  vite: {
    plugins: [tailwindcss()],
  },
  css: ['~/assets/css/tailwind.css'],
})
