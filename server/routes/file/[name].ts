import { defineEventHandler, setHeader, createError } from 'h3'
import { promises as fsp } from 'fs'
import { resolveFile, mimeOf } from '../../lib/file'

/** 静态文件访问：/file/:name（安全路径 + 正确 mime + 缓存），对齐 social-start 的 app/file/[name]/route.ts */
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
    throw createError({ statusCode: 404, statusMessage: '文件不存在' })
  }
  setHeader(event, 'Content-Type', mimeOf(abs))
  setHeader(event, 'Cache-Control', 'public, max-age=86400')
  setHeader(event, 'Content-Disposition', `inline; filename="${name}"`)
  return buf
})
