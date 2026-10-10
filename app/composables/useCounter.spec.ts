import { describe, it, expect } from 'vitest'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('初始为 start', () => {
    const { count } = useCounter(5)
    expect(count.value).toBe(5)
  })
  it('inc 后 +1', () => {
    const { count, inc } = useCounter(0)
    inc()
    expect(count.value).toBe(1)
  })
})
