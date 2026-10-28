// 👉 练习点：真实鉴权守卫示例（本页未绑定，仅供对照学习）。
// 🔧 固定写法：useState 读登录态（跨组件/页面共享、SSR 安全），未登录则 navigateTo 重定向。
// ↔ 跨框架差异：React/Next 在 middleware.ts 里用 NextResponse.redirect()，靠 matcher 圈定路由，无页面级绑定。
export default defineNuxtRouteMiddleware((to) => {
  const token = useState<string>('token')
  // 📌 未登录且不是去登录页 → 重定向到 /login
  if (!token.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})
