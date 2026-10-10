// vue-i18n 实例插件：创建并注册到 app（页面里即可 useI18n()）
import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'zh',
    messages: {
      zh: { hello: '你好，欢迎来到 Social Basic' },
      en: { hello: 'Hello, welcome to Social Basic' },
    },
  })
  nuxtApp.vueApp.use(i18n)
})
