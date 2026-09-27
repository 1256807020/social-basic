import { defineEventHandler } from 'h3'
import { sendApi } from '../../utils/route'
import { ok, withApi } from '../../lib/response'
import { deleteImage } from '../../lib/media'

/** 删除图片：DELETE /api/image/:name，对齐 social-start 的 app/api/image/[name]/route.ts（静态访问走 /img/:name） */
export default defineEventHandler(async (event) => {
  const name = String(event.context.params?.name)
  return sendApi(
    event,
    await withApi(async () => {
      await deleteImage(name)
      return ok({ name }, '删除成功')
    }),
  )
})
