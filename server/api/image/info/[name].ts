import { defineEventHandler } from 'h3'
import { ok, withApi } from '../../../lib/response'
import { infoImage } from '../../../lib/media'
import { sendApi } from '../../../utils/route'

export default defineEventHandler(async (event) => {
  const name = String(event.context.params?.name)
  return sendApi(event, await withApi(async () => ok(await infoImage(name))))
})
