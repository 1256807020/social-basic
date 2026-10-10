// 自定义 server 路由示例：聚合统计（非通用 CRUD）
// 通用 CRUD 已用 /api/[resource]，这里演示“额外聚合接口”怎么写
export default defineEventHandler(async () => {
  const res = await $fetch('http://localhost:3000/api/todo?pageSize=9999')
  const items: unknown[] = (res as { data?: unknown[] }).data || []
  return { total: items.length }
})
