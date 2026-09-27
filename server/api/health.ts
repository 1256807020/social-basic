import { defineEventHandler } from 'h3'
import { ok, withApi } from '../lib/response'
import { db } from '../lib/json-db'
import { sendApi } from '../utils/route'

export default defineEventHandler(async (event) => {
  return sendApi(
    event,
    await withApi(async () => {
      const collections = await db.collections()
      return ok(
        {
          env: process.env.NODE_ENV || 'development',
          uptime: Math.round(process.uptime()),
          collections: collections.length,
          dataDir: db.dataDir,
        },
        'ok',
        { collections },
      )
    }),
  )
})
