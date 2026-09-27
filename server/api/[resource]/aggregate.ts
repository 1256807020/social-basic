import { defineEventHandler } from 'h3'
import { toQuery, sendApi } from '../../utils/route'
import { withApi, ok } from '../../lib/response'
import { aggregate } from '../../lib/aggregate'
import { assertName } from '../../lib/json-db'

export default defineEventHandler(async (event) => {
  const resource = String(event.context.params?.resource)
  return sendApi(
    event,
    await withApi(async () => {
      assertName(resource)
      const rows = await aggregate(resource, toQuery(event))
      return ok(rows, 'success', { total: rows.length })
    }),
  )
})
