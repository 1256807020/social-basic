import { defineEventHandler, getQuery, setHeader } from 'h3'
import { placeholderSvg } from '../../../lib/media'

export default defineEventHandler((event) => {
  const size = String(event.context.params?.size || '')
  const q = getQuery(event) as Record<string, any>
  const m = size.match(/^(\d{1,4})[xX*](\d{1,4})$/)
  const w = Math.min(Math.max(parseInt(m ? m[1] : q.w, 10) || 300, 1), 3000)
  const h = Math.min(Math.max(parseInt(m ? m[2] : q.h, 10) || 200, 1), 3000)
  const text = String(q.text || `${w}×${h}`).slice(0, 40)
  const bg = String(q.bg || '#e2e8f0')
  const color = String(q.color || '#64748b')
  const svg = placeholderSvg(w, h, text, bg, color)
  setHeader(event, 'Content-Type', 'image/svg+xml')
  setHeader(event, 'Cache-Control', 'public, max-age=86400')
  return svg
})
