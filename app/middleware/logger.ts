// 🔧 固定写法：defineNuxtRouteMiddleware 定义「命名路由中间件」，
// 文件名即中间件名（这里是 logger），页面用 definePageMeta({ middleware: 'logger' }) 绑定。
// 📌 值得记录：to=目标路由，from=来源路由；返回 navigateTo('/login') 即可重定向（鉴权守卫核心）。
export default defineNuxtRouteMiddleware((to, from) => {
  // 👉 练习点：把下面这行日志换成「无 token → navigateTo('/login')」就是登录守卫。
  console.log('[middleware:logger]', from.path, '→', to.path)
})
