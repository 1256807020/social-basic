import { defineEventHandler, setHeader, createError } from 'h3'
import { toQuery } from '../../utils/route'
import { HttpError } from '../../lib/response'
import { db } from '../../lib/json-db'
import { arrayToCsv } from '../../lib/csv'

export default defineEventHandler(async (event) => {
  const resource = String(event.context.params?.resource)
  try {
    db.assertName(resource)
    const q = toQuery(event)
    const list = await db.read(resource)
    const format = q.format === 'csv' ? 'csv' : 'json'
    let body: string
    let contentType: string
    if (format === 'csv') {
      body = arrayToCsv(list)
      contentType = 'text/csv; charset=utf-8'
    } else {
      body = JSON.stringify(list, null, 2)
      contentType = 'application/json; charset=utf-8'
    }
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Content-Disposition', `attachment; filename="${resource}.${format}"`)
    return body
  } catch (e) {
    const err = e as HttpError
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: err?.message || '服务器内部错误',
      data: { code: err?.code || 50000 },
    })
  }
})
