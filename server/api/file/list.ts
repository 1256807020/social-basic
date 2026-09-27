import { defineEventHandler } from 'h3'
import { ok, withApi } from '../../lib/response'
import { listFiles } from '../../lib/file'
import { sendApi } from '../../utils/route'

export default defineEventHandler(async (event) => {
  return sendApi(
    event,
    await withApi(async () => {
      const r = await listFiles()
      return ok(r.items, 'success', { total: r.total })
    }),
  )
})
