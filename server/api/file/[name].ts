import { defineEventHandler, getMethod, setHeader, createError } from 'h3'
import { sendApi } from '../../utils/route'
import { ok, withApi } from '../../lib/response'
import { resolveFile, deleteFile, mimeOf } from '../../lib/file'
import { promises as fsp } from 'fs'

export default defineEventHandler(async (event) => {
  const name = String(event.context.params?.name)
  const method = getMethod(event)
  if (method === 'DELETE') {
    return sendApi(
      event,
      await withApi(async () => {
        await deleteFile(name)
        return ok({ name }, '删除成功')
      }),
    )
  }
  // GET 静态访问
  try {
    const abs = resolveFile(name)
    const buf = await fsp.readFile(abs)
    setHeader(event, 'Content-Type', mimeOf(abs))
    setHeader(event, 'Cache-Control', 'public, max-age=86400')
    return buf
  } catch {
    throw createError({ statusCode: 404, statusMessage: '文件不存在' })
  }
})
