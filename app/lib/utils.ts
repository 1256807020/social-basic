import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** shadcn 风格 className 合并工具（等价于 social-start 的 lib/utils.ts 的 cn） */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
