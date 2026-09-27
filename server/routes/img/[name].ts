import { defineEventHandler, setHeader, createError } from 'h3'
import { promises as fsp } from 'fs'
import { resolveFile, mimeOf } from '../../lib/media'

/** 静态图片访问：/img/:name（安全路径 + 正确 mime + 缓存），对齐 social-start 的 app/img/[name]/route.ts */
export default defineEventHandler(async (event) => {
  const name = String(event.context.params?.name)
  let abs: string
  try {
    abs = resolveFile(name)
  } catch {
    throw createError({ statusCode: 400, statusMessage: '非法文件路径' })
  }
  let buf: Buffer
  try {
    buf = await fsp.readFile(abs)
  } catch {
    throw createError({ statusCode: 404, statusMessage: '图片不存在' })
  }
  setHeader(event, 'Content-Type', mimeOf(abs))
  setHeader(event, 'Cache-Control', 'public, max-age=86400')
  return buf
})
