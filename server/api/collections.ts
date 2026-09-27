import { defineEventHandler } from 'h3'
import { ok, withApi } from '../lib/response'
import { db } from '../lib/json-db'
import { sendApi } from '../utils/route'

export default defineEventHandler(async (event) => {
  return sendApi(event, await withApi(async () => ok(await db.collections())))
})
