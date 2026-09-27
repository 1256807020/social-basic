import { defineEventHandler, getMethod, createError } from 'h3'
import { sendApi } from '../../utils/route'
import { withApi, ok, notFound } from '../../lib/response'
import * as db from '../../lib/json-db'

/** 字段结构自动推断 */
function inferSchema(list: any[]) {
  const fields = new Map<string, { types: Set<string>; filled: number; sample: any }>()
  const take = list.slice(0, Math.min(list.length, 50))
  take.forEach((item) => {
    Object.keys(item || {}).forEach((k) => {
      if (!fields.has(k)) fields.set(k, { types: new Set(), filled: 0, sample: undefined })
      const f = fields.get(k)!
      const v = item[k]
      if (v !== undefined && v !== null && v !== '') {
        f.filled++
        if (f.sample === undefined) f.sample = v
      }
      f.types.add(typeof v)
    })
  })
  return [...fields.entries()].map(([field, f]) => ({
    field,
    types: [...f.types].filter((t) => t !== 'undefined'),
    filled: f.filled,
    sample: f.sample,
  }))
}

export default defineEventHandler(async (event) => {
  const name = String(event.context.params?.name)
  const method = getMethod(event)
  if (method === 'GET') {
    return sendApi(
      event,
      await withApi(async () => {
        db.assertName(name)
        const list = await db.read(name)
        return ok({
          name,
          total: list.length,
          file: db.fileOf(name),
          schema: inferSchema(list),
          preview: list.slice(0, 5),
        })
      }),
    )
  }
  if (method === 'DELETE') {
    return sendApi(
      event,
      await withApi(async () => {
        db.assertName(name)
        const dropped = await db.dropCollection(name)
        if (!dropped) throw notFound(`集合 ${name} 不存在`)
        return ok({ dropped: name }, `已删除集合 ${name}`)
      }),
    )
  }
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
