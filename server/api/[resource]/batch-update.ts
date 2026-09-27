import { defineEventHandler } from 'h3'
import { readJson, sendApi } from '../../utils/route'
import { withApi } from '../../lib/response'
import { handlers } from '../../lib/crud'

export default defineEventHandler(async (event) => {
  const resource = String(event.context.params?.resource)
  return sendApi(
    event,
    await withApi(async () => {
      const body = await readJson(event)
      return handlers.batchUpdate(resource, body)
    }),
  )
})
