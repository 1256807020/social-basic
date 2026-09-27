/**
 * 可选 adminToken 鉴权（进阶能力，独立于核心 CRUD）。
 *
 * 设计原则：
 * - 仅当环境变量 ADMIN_TOKEN 被设置时才「启用」；未设置时完全透明，
 *   核心 CRUD 本地 / 公开开发零负担，不影响核心能力使用。
 * - 启用后：写操作（POST / PUT / PATCH / DELETE）必须携带正确 token；
 *   读操作（GET / HEAD / OPTIONS，含列表、详情、统计）始终开放——兼顾 SEO 公开抓取与管理写保护。
 * - 核心 lib/crud.ts、lib/json-db.ts 无需任何改动，鉴权是独立的请求拦截层能力（Nitro middleware）。
 */
export function isAuthEnabled(): boolean {
  return Boolean(process.env.ADMIN_TOKEN)
}

function expectedToken(): string {
  return process.env.ADMIN_TOKEN || ''
}

/**
 * 从请求中提取客户端 token，优先级：
 *   Authorization: Bearer <token>  >  x-admin-token: <token>  >  ?adminToken=<token>
 * 入参兼容 Node IncomingHttpHeaders（req.headers）与 URL。
 */
export function extractToken(headers: Record<string, string | string[] | undefined>, url?: string): string | null {
  const auth = headers['authorization']
  if (auth && typeof auth === 'string' && auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim()

  const header = headers['x-admin-token']
  if (header) return (Array.isArray(header) ? header[0] : header).trim()

  if (url) {
    try {
      const q = new URL(url).searchParams.get('adminToken')
      if (q) return q.trim()
    } catch {
      /* url 解析异常时忽略 */
    }
  }
  return null
}

/** 校验请求是否放行（未启用 => 始终 true） */
export function verifyToken(
  headers: Record<string, string | string[] | undefined>,
  url?: string,
): boolean {
  if (!isAuthEnabled()) return true
  const t = extractToken(headers, url)
  return t !== null && t === expectedToken()
}
