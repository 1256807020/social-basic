import { defineEventHandler, getMethod, createError } from 'h3'
import { toQuery, readJson, sendApi } from '../utils/route'
import { withApi } from '../lib/response'
import { handlers } from '../lib/crud'

export default defineEventHandler(async (event) => {
  const resource = String(event.context.params?.resource)
  const method = getMethod(event)
  if (method === 'GET') {
    return sendApi(event, await withApi(() => handlers.list(resource, toQuery(event))))
  }
  if (method === 'POST') {
    return sendApi(
      event,
      await withApi(async () => {
        const body = await readJson(event)
        return handlers.create(resource, body)
      }),
    )
  }
  if (method === 'DELETE') {
    const q = toQuery(event)
    return sendApi(event, await withApi(() => handlers.truncate(resource, q.confirm)))
  }
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
