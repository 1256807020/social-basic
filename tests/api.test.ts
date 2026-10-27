const BASE = process.env.TEST_BASE as string
const RES = 'todo' // 在隔离 DATA_DIR 下测试，不污染真实数据
const TREE = 'tree'

type ApiRes = { res: Response; json: any; text: string; ok: boolean; status: number }

async function api(p: string, init?: RequestInit): Promise<ApiRes> {
  const res = await fetch(`${BASE}${p}`, init)
  const text = await res.text()
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = null
  }
  return { res, json, text, ok: res.ok, status: res.status }
}

const j = (body: unknown, method = 'POST') =>
  ({
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as RequestInit

// 最小 1x1 透明 PNG
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
)

function multipart(file: Buffer, name = 'px.png') {
  const form = new FormData()
  // 新版 @types/node 让 Buffer 变为泛型 Buffer<ArrayBufferLike>，与 DOM 的 BlobPart(ArrayBuffer) 不匹配；
  // 运行时 Buffer 本就是合法的 BlobPart（Uint8Array 子类），此处收窄类型即可。
  form.append('file', new Blob([file as unknown as BlobPart], { type: 'image/png' }), name)
  return { method: 'POST', body: form } as RequestInit
}

beforeAll(async () => {
  await api(`/api/${RES}?confirm=1`, { method: 'DELETE' })
  await api(`/api/${TREE}?confirm=1`, { method: 'DELETE' })
})
afterAll(async () => {
  await api(`/api/${RES}?confirm=1`, { method: 'DELETE' })
  await api(`/api/${TREE}?confirm=1`, { method: 'DELETE' })
})

describe('基础 / health / collections', () => {
  it('GET /api/health 返回环境信息', async () => {
    const r = await api('/api/health')
    expect(r.ok).toBe(true)
    expect(r.json.code).toBe(0)
    expect(r.json.data).toHaveProperty('collections')
  })

  it('GET /api/collections 列出集合（含 todo）', async () => {
    const r = await api('/api/collections')
    expect(r.ok).toBe(true)
    expect(Array.isArray(r.json.data)).toBe(true)
    expect(r.json.data.some((c: any) => c.name === RES)).toBe(true)
  })

  it('GET /api/collections/:name 返回集合元信息', async () => {
    await api(`/api/${RES}`, j({ title: 'schema-seed' }))
    const r = await api(`/api/collections/${RES}`)
    expect(r.ok).toBe(true)
    expect(r.json.data.name).toBe(RES)
  })
})

describe('通用 CRUD（信封 {code,data,msg}）', () => {
  it('POST 新增单条 -> 201 + 自动 id/时间戳', async () => {
    const r = await api(`/api/${RES}`, j({ title: '任务A', status: 1 }))
    expect(r.status).toBe(201)
    expect(r.json.code).toBe(0)
    expect(r.json.data.id).toBeGreaterThan(0)
    expect(r.json.data.createdAt).toBeTruthy()
  })

  it('GET 列表带分页/总数', async () => {
    const r = await api(`/api/${RES}?page=1&pageSize=10`)
    expect(r.ok).toBe(true)
    expect(Array.isArray(r.json.data)).toBe(true)
    expect(r.json.total).toBeGreaterThanOrEqual(1)
    expect(r.json.totalPages).toBeGreaterThanOrEqual(1)
  })

  it('GET 数量统计', async () => {
    const r = await api(`/api/${RES}/count`)
    expect(r.ok).toBe(true)
    expect(r.json.data.total).toBeGreaterThanOrEqual(1)
  })

  it('GET 详情 /:id', async () => {
    const list = await api(`/api/${RES}?pageSize=1`)
    const id = list.json.data[0].id
    const r = await api(`/api/${RES}/${id}`)
    expect(r.ok).toBe(true)
    expect(r.json.data.id).toBe(id)
  })

  it('PATCH 增量修改 /:id', async () => {
    const list = await api(`/api/${RES}?pageSize=1`)
    const id = list.json.data[0].id
    const r = await api(`/api/${RES}/${id}`, j({ status: 2 }, 'PATCH'))
    expect(r.ok).toBe(true)
    expect(r.json.data.status).toBe(2)
  })

  it('关键字搜索 keyword', async () => {
    await api(`/api/${RES}`, j({ title: '独一无二关键字xyz' }))
    const r = await api(`/api/${RES}?keyword=独一无二关键字xyz`)
    expect(r.ok).toBe(true)
    expect(r.json.data.length).toBeGreaterThanOrEqual(1)
    expect(r.json.data[0].title).toContain('独一无二关键字xyz')
  })

  it('批量新增 /batch-create', async () => {
    const r = await api(`/api/${RES}/batch-create`, j([{ title: 'b1' }, { title: 'b2' }]))
    expect(r.ok).toBe(true)
    expect(Array.isArray(r.json.data)).toBe(true)
    expect(r.json.data.length).toBe(2)
  })

  it('批量删除 /batch-delete', async () => {
    const created = await api(`/api/${RES}/batch-create`, j([{ title: 'del1' }, { title: 'del2' }]))
    const ids = created.json.data.map((i: any) => i.id)
    const r = await api(`/api/${RES}/batch-delete`, j({ ids }))
    expect(r.ok).toBe(true)
    expect(r.json.data.deleted).toBe(2)
  })

  it('DELETE 单条 /:id', async () => {
    const c = await api(`/api/${RES}`, j({ title: 'to-del' }))
    const id = c.json.data.id
    const r = await api(`/api/${RES}/${id}`, { method: 'DELETE' })
    expect(r.ok).toBe(true)
    const after = await api(`/api/${RES}/${id}`)
    expect(after.status).toBe(404)
  })

  it('缺 confirm 清空集合被拒', async () => {
    const r = await api(`/api/${RES}`, { method: 'DELETE' })
    expect(r.ok).toBe(false)
    expect(r.json.code).not.toBe(0)
  })
})

describe('树形 / 聚合 / 导出', () => {
  it('树形：建父子节点 -> ?tree=1 返回 children', async () => {
    const root = await api(`/api/${TREE}`, j({ title: '根', parentId: 0 }))
    const rootId = root.json.data.id
    await api(`/api/${TREE}`, j({ title: '子', parentId: rootId }))
    const r = await api(`/api/${TREE}?tree=1&parentKey=parentId`)
    expect(r.ok).toBe(true)
    const node = r.json.data.find((n: any) => n.id === rootId)
    expect(node).toBeTruthy()
    expect(Array.isArray(node.children)).toBe(true)
    expect(node.children.length).toBe(1)
  })

  it('聚合：groupBy=status 分组计数', async () => {
    const r = await api(`/api/${RES}/aggregate?groupBy=status`)
    expect(r.ok).toBe(true)
    expect(Array.isArray(r.json.data)).toBe(true)
    expect(r.json.data[0]).toHaveProperty('count')
  })

  it('导出 CSV /:resource/export?format=csv', async () => {
    const r = await api(`/api/${RES}/export?format=csv`)
    expect(r.ok).toBe(true)
    expect(r.text).toContain('title')
  })

  it('导出 JSON /:resource/export?format=json', async () => {
    const r = await api(`/api/${RES}/export?format=json`)
    expect(r.ok).toBe(true)
    expect(Array.isArray(r.json)).toBe(true)
  })
})

describe('验证码 / 图片 / 占位图', () => {
  it('GET /api/captcha 返回 captchaId + svg 图', async () => {
    const r = await api('/api/captcha')
    expect(r.ok).toBe(true)
    expect(r.json.data.captchaId).toBeTruthy()
    expect(r.json.data.image).toContain('data:image/svg+xml')
  })

  it('POST /api/captcha/verify 校验', async () => {
    const c = await api('/api/captcha')
    const id = c.json.data.captchaId
    const ok = await api('/api/captcha/verify', j({ captchaId: id, code: '0000' }))
    // 无论对错都应有结构化返回（错则 success=false）
    expect(ok.ok).toBe(true)
    expect(ok.json.data).toHaveProperty('success')
  })

  it('POST /api/image/upload 上传（multipart）-> 201', async () => {
    const r = await api('/api/image/upload', multipart(PNG))
    expect(r.status).toBe(201)
    expect(r.json.code).toBe(0)
    expect(r.json.data.url).toContain('/img/')
  })

  it('GET /img/:name 静态访问已上传图片', async () => {
    const up = await api('/api/image/upload', multipart(PNG, 'serve.png'))
    const name = up.json.data.name
    const r = await api(`/img/${name}`)
    expect(r.ok).toBe(true)
    expect(r.res.headers.get('content-type')).toContain('image/')
  })

  it('GET /api/image/list 列出已上传图片', async () => {
    const r = await api('/api/image/list')
    expect(r.ok).toBe(true)
    expect(Array.isArray(r.json.data)).toBe(true)
    expect(r.json.data.length).toBeGreaterThanOrEqual(1)
  })

  it('GET /api/image/placeholder/:size 占位图 svg', async () => {
    const r = await api('/api/image/placeholder/200x120')
    expect(r.ok).toBe(true)
    expect(r.res.headers.get('content-type')).toContain('image/svg+xml')
  })
})
