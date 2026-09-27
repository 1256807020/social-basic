import { defineEventHandler, readMultipartFormData } from 'h3'
import { ok, badRequest, withApi } from '../../lib/response'
import { saveUpload } from '../../lib/media'
import { sendApi } from '../../utils/route'

export default defineEventHandler(async (event) => {
  return sendApi(
    event,
    await withApi(async () => {
      const parts = await readMultipartFormData(event)
      const files = (parts || []).filter((p) => p.name === 'file' && p.data && p.data.length)
      if (!files.length) throw badRequest('请选择要上传的图片')
      const saved: any[] = []
      for (const f of files) {
        const buf = Buffer.from(f.data)
        const name = await saveUpload(buf, f.filename || 'upload.bin')
        saved.push({
          name,
          original: f.filename,
          url: `/img/${encodeURIComponent(name)}`,
          size: f.data.length,
          sizeText: `${Math.round(f.data.length / 1024)} KB`,
        })
      }
      return ok(saved.length === 1 ? saved[0] : saved, `上传成功 ${saved.length} 张`, {}, 201)
    }),
  )
})
