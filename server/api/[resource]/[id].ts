import { defineEventHandler, getMethod, createError } from 'h3'
import { readJson, sendApi } from '../../utils/route'
import { withApi } from '../../lib/response'
import { handlers } from '../../lib/crud'

export default defineEventHandler(async (event) => {
  const resource = String(event.context.params?.resource)
  const id = event.context.params?.id
  const method = getMethod(event)
  if (method === 'GET') {
    return sendApi(event, await withApi(() => handlers.detail(resource, id)))
  }
  if (method === 'PUT') {
    return sendApi(
      event,
      await withApi(async () => {
        const body = await readJson(event)
        return handlers.update(resource, id, body, true)
      }),
    )
  }
  if (method === 'PATCH') {
    return sendApi(
      event,
      await withApi(async () => {
        const body = await readJson(event)
        return handlers.update(resource, id, body, false)
      }),
    )
  }
  if (method === 'DELETE') {
    return sendApi(event, await withApi(() => handlers.remove(resource, id)))
  }
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
