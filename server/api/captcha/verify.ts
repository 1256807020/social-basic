import { defineEventHandler } from 'h3'
import { ok, badRequest, withApi } from '../../lib/response'
import { verifyCaptcha } from '../../lib/captcha'
import { readJson, sendApi } from '../../utils/route'

export default defineEventHandler(async (event) => {
  return sendApi(
    event,
    await withApi(async () => {
      const body = await readJson(event)
      if (!body?.captchaId || body?.code === undefined) throw badRequest('缺少 captchaId 或 code')
      const success = await verifyCaptcha(body.captchaId, String(body.code))
      return ok({ success }, success ? '校验通过' : '验证码错误')
    }),
  )
})
