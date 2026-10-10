// 路由中间件示例：进入页面先打印日志（实战可改成“无 token 跳 /login”）
export default defineNuxtRouteMiddleware((to) => {
  console.log('[middleware/logger] 进入：', to.path)
})
