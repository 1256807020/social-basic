import { defineEventHandler } from 'h3'
import { toQuery, sendApi } from '../../utils/route'
import { withApi } from '../../lib/response'
import { handlers } from '../../lib/crud'

export default defineEventHandler(async (event) => {
  const resource = String(event.context.params?.resource)
  return sendApi(event, await withApi(() => handlers.count(resource, toQuery(event))))
})
