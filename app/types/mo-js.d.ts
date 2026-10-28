// mo-js 官方不发布 TypeScript 类型，这里补一个最小声明，仅覆盖本页用到的 API。
// 用结构化类型代替 any，满足「禁 any」铁律且能约束用法。
declare module 'mo-js' {
  export interface BurstOptions {
    left?: number
    top?: number
    radius?: number | Record<string, number>
    count?: number
    children?: Record<string, unknown>
    [key: string]: unknown
  }

  export class Burst {
    constructor(options?: BurstOptions)
    /** 运行时微调位置（x/y 为页面坐标）并重新播放 */
    tune(options: Record<string, unknown>): this
    replay(): this
    /** mo-js 1.7.1 自动 append 到 document.body 的根 SVG 元素，用于卸载时清理 */
    el?: HTMLElement
  }

  const mojs: { Burst: typeof Burst }
  export default mojs
}
