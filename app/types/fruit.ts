// ───────────────────────────────────────────────────────────
// 资源类型定义（前端消费形状）—— 示例：fruit.json 集合（列表渲染课程用）
// 📌 照抄 app/types/todo.ts：只声明本页真正用到的字段，不追求与后端一一对应。
// 📌 统一用 [key: string]: unknown 兜住引擎动态字段（schema-less，后端可随时增删）。
// ───────────────────────────────────────────────────────────

/** 一条 fruit 记录 */
export interface Fruit {
  id: number
  name: string
  hot?: boolean
  createdAt?: string
  updatedAt?: string
  /** 引擎允许动态字段：未声明字段一律 unknown（不是 any） */
  [key: string]: unknown
}
