/**
 * 路由层工具（Nitro / h3 版，对应 social-start 的 lib/route-utils.ts）
 * 从 H3Event 提取 query / body，并把 ApiResult 转成响应。
 */
import { getQuery, readBody, setResponseStatus } from 'h3'
import type { H3Event } from 'h3'
import { ApiResult, badRequest } from '../lib/response'

/** URL query -> 普通对象（值多为 string） */
export function toQuery(event: H3Event): Record<string, any> {
  return getQuery(event) as Record<string, any>
}

/** 解析 JSON 请求体，失败抛 badRequest（统一 400）。空 body 也视为非法。 */
export async function readJson(event: H3Event): Promise<any> {
  try {
    return await readBody(event)
  } catch {
    throw badRequest('请求体必须是合法 JSON')
  }
}

/** 解析 JSON 请求体，失败 / 空 body 返回 undefined（用于允许可选 body 的接口） */
export async function readJsonOptional(event: H3Event): Promise<any> {
  try {
    return await readBody(event)
  } catch {
    return undefined
  }
}

/** ApiResult -> 设置状态码并返回响应体（Nitro 自动 JSON 序列化） */
export function sendApi(event: H3Event, res: ApiResult) {
  setResponseStatus(event, res.status)
  return res.body
}
