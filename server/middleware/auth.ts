/**
 * 进阶鉴权（Nitro middleware，对应 social-start 的 proxy.ts）。
 * 仅 /api/* 生效，不干扰页面渲染与 SEO。
 * - 未配置 ADMIN_TOKEN：完全透明，核心 CRUD 本地 / 公开开放。
 * - 已配置：写操作需正确 adminToken，读操作始终放行。
 */
import { defineEventHandler, getMethod, createError } from 'h3'
import { isAuthEnabled, verifyToken } from '../lib/auth'

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
const READ_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

export default defineEventHandler((event) => {
  // 未启用：透明放行，核心能力零负担
  if (!isAuthEnabled()) return

  const url = event.node.req.url || ''
  // 仅匹配 /api 路由，页面（含 SSR/SEO）完全不受影响
  if (!url.startsWith('/api')) return

  const method = getMethod(event).toUpperCase()
  // 只读请求放行（列表 / 详情 / 统计 / 利于 SEO 的公开读）
  if (READ_METHODS.has(method)) return

  // 写操作必须携带正确的 adminToken
  if (!verifyToken(event.node.req.headers, `http://localhost${url}`)) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授权：写操作需要正确的 adminToken',
      data: { code: 40001, data: null, msg: '未授权：写操作需要正确的 adminToken' },
    })
  }
})
