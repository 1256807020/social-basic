import { defineEventHandler, getMethod, createError } from 'h3'
import { toQuery, readJsonOptional, sendApi } from '../../utils/route'
import { withApi } from '../../lib/response'
import { handlers } from '../../lib/crud'

export default defineEventHandler(async (event) => {
  const resource = String(event.context.params?.resource)
  const method = getMethod(event)
  if (method === 'POST' || method === 'DELETE') {
    return sendApi(
      event,
      await withApi(async () => {
        const body = await readJsonOptional(event)
        const q = toQuery(event)
        const ids = body?.ids ?? (Array.isArray(body) ? body : q.ids)
        return handlers.batchDelete(resource, ids)
      }),
    )
  }
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
