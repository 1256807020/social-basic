import { defineEventHandler, getRequestHeader, readMultipartFormData, createError } from 'h3'
import { toQuery, readJson, sendApi } from '../../utils/route'
import { withApi, HttpError } from '../../lib/response'
import { handlers } from '../../lib/crud'
import { csvToArray } from '../../lib/csv'
import { assertName } from '../../lib/json-db'

export default defineEventHandler(async (event) => {
  const resource = String(event.context.params?.resource)
  return sendApi(
    event,
    await withApi(async () => {
      assertName(resource)
      const q = toQuery(event)
      const ct = (getRequestHeader(event, 'content-type') || '').toLowerCase()
      let records: any[]
      if (ct.includes('multipart/form-data')) {
        const parts = await readMultipartFormData(event)
        const filePart = (parts || []).find((p) => p.name === 'file')
        if (!filePart) throw new HttpError(400, 40000, '缺少文件字段 file')
        const text = Buffer.from(filePart.data).toString('utf8')
        const isCsv =
          (filePart.filename || '').toLowerCase().endsWith('.csv') || q.format === 'csv'
        records = isCsv ? csvToArray(text) : JSON.parse(text)
      } else {
        records = await readJson(event)
      }
      if (!Array.isArray(records)) records = [records]
      return handlers.create(resource, records)
    }),
  )
})
